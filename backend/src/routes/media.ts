
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

type MediaBindings = {
  transport_db: D1Database;
  MEDIA_BUCKET: R2Bucket;
  R2_URL: string;
};

const media = new Hono<any>();

const PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const PHOTO_LIMIT = 1 * 1024 * 1024;
const VIDEO_LIMIT = 8 * 1024 * 1024;

function isFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string" && "arrayBuffer" in value;
}

function extensionFor(type: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };

  return extensions[type] ?? "bin";
}

function publicUrl(base: string, key: string) {
  return `${base.replace(/\/+$/, "")}/${key}`;
}

async function removeObjects(
  env: MediaBindings,
  keys: string[],
) {
  for (const key of keys) {
    await env.MEDIA_BUCKET.delete(key);
  }
}

async function saveMedia(
  env: MediaBindings,
  kind: "lost-found" | "sumo-counter",
  listingId: number,
  files: File[],
  video?: File,
) {
  const db = env.transport_db;
  const uploadedKeys: string[] = [];

  try {
    for (const file of [...files, ...(video ? [video] : [])]) {
      const key =
        `${kind}/${listingId}/${crypto.randomUUID()}.` +
        extensionFor(file.type);

      await env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
      });

      uploadedKeys.push(key);

      if (kind === "lost-found") {
        await db.prepare(
          `INSERT INTO lost_found_media
           (listing_id, object_key, media_type, size_bytes)
           VALUES (?, ?, ?, ?)`,
        ).bind(
          listingId,
          key,
          file.type.startsWith("video/") ? "video" : "photo",
          file.size,
        ).run();
      } else {
        await db.prepare(
          `INSERT INTO sumo_counter_media
           (item_id, object_key, size_bytes)
           VALUES (?, ?, ?)`,
        ).bind(listingId, key, file.size).run();
      }
    }
  } catch (error) {
    await Promise.allSettled(
      uploadedKeys.map((key) => env.MEDIA_BUCKET.delete(key)),
    );

    if (kind === "lost-found") {
      await db.prepare(
        "DELETE FROM lost_found_media WHERE listing_id = ?",
      ).bind(listingId).run();
      await db.prepare(
        "DELETE FROM lost_found WHERE id = ?",
      ).bind(listingId).run();
    } else {
      await db.prepare(
        "DELETE FROM sumo_counter_media WHERE item_id = ?",
      ).bind(listingId).run();
      await db.prepare(
        "DELETE FROM sumo_counter_items WHERE id = ?",
      ).bind(listingId).run();
    }

    throw error;
  }

  return uploadedKeys;
}

// Public: Lost & Found listings and their media URLs.
media.get("/lost-found", async (c) => {
  const env = c.env as MediaBindings;
  const db = env.transport_db;

  const { results = [] } = await db.prepare(
    `SELECT * FROM lost_found
     WHERE status = 'active' AND expires_at > CURRENT_TIMESTAMP
     ORDER BY created_at DESC`,
  ).all();

  const listings = await Promise.all(
    results.map(async (item: any) => {
      const { results: files = [] } = await db.prepare(
        `SELECT id, object_key, media_type, size_bytes
         FROM lost_found_media WHERE listing_id = ? ORDER BY id`,
      ).bind(item.id).all();

      return {
        ...item,
        media: files.map((file: any) => ({
          id: file.id,
          type: file.media_type,
          sizeBytes: file.size_bytes,
          url: publicUrl(env.R2_URL, file.object_key),
        })),
      };
    }),
  );

  return c.json(listings);
});

// Public: Sumo Counter items and their photos.
media.get("/sumo-counter", async (c) => {
  const env = c.env as MediaBindings;
  const db = env.transport_db;

  const { results = [] } = await db.prepare(
    `SELECT * FROM sumo_counter_items
     WHERE status = 'active' AND expires_at > CURRENT_TIMESTAMP
     ORDER BY created_at DESC`,
  ).all();

  const items = await Promise.all(
    results.map(async (item: any) => {
      const { results: files = [] } = await db.prepare(
        `SELECT id, object_key, size_bytes
         FROM sumo_counter_media WHERE item_id = ? ORDER BY id`,
      ).bind(item.id).all();

      return {
        ...item,
        photos: files.map((file: any) => ({
          id: file.id,
          sizeBytes: file.size_bytes,
          url: publicUrl(env.R2_URL, file.object_key),
        })),
      };
    }),
  );

  return c.json(items);
});

// Both admin and staff can manage every listing.
async function requireManager(c: any, next: any) {
  const user = c.get("user") as { role?: string } | undefined;

  if (!user || !["admin", "staff"].includes(user.role ?? "")) {
    return c.json({ error: "Admin or staff access required" }, 403);
  }

  await next();
}

media.post("/lost-found", authMiddleware, requireManager, async (c) => {
  const env = c.env as MediaBindings;
  const form = await c.req.formData();

  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();

  const photos = form.getAll("photos").filter(isFile);
  const videoEntry = form.get("video");
  const video = videoEntry && isFile(videoEntry) && videoEntry.size
    ? videoEntry
    : undefined;

  if (!title) return c.json({ error: "Title is required" }, 400);
  if (photos.length < 1 || photos.length > 3) {
    return c.json({ error: "Upload 1 to 3 photos" }, 400);
  }
  if (photos.some((f) => !PHOTO_TYPES.has(f.type) || f.size > PHOTO_LIMIT || !f.size)) {
    return c.json({ error: "Photos must be JPEG, PNG or WebP, up to 1 MB each" }, 400);
  }
  if (video && (!VIDEO_TYPES.has(video.type) || video.size > VIDEO_LIMIT)) {
    return c.json({ error: "Video must be MP4, WebM or MOV, up to 8 MB" }, 400);
  }

  const user = c.get("user") as { id?: number };
  if (!Number.isInteger(Number(user?.id))) {
    return c.json({ error: "Invalid user in token" }, 401);
  }

  const result = await env.transport_db.prepare(
    `INSERT INTO lost_found
     (title, description, location, created_by, expires_at)
     VALUES (?, ?, ?, ?, datetime('now', '+7 days'))`,
  ).bind(
    title, description || null, location || null, Number(user.id),
  ).run();

  const id = Number(result.meta.last_row_id);

  try {
    await saveMedia(env, "lost-found", id, photos, video);
  } catch {
    return c.json({ error: "Upload failed; listing was rolled back" }, 500);
  }

  return c.json({ success: true, id }, 201);
});

media.post("/sumo-counter", authMiddleware, requireManager, async (c) => {
  const env = c.env as MediaBindings;
  const form = await c.req.formData();

  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const priceText = String(form.get("price") ?? "").trim();
  const photos = form.getAll("photos").filter(isFile);

  const price = priceText === "" ? null : Number(priceText);

  if (!title) return c.json({ error: "Title is required" }, 400);
  if (price !== null && (!Number.isFinite(price) || price < 0)) {
    return c.json({ error: "Price must be a non-negative number" }, 400);
  }
  if (photos.length < 1 || photos.length > 3) {
    return c.json({ error: "Upload 1 to 3 photos" }, 400);
  }
  if (photos.some((f) => !PHOTO_TYPES.has(f.type) || f.size > PHOTO_LIMIT || !f.size)) {
    return c.json({ error: "Photos must be JPEG, PNG or WebP, up to 1 MB each" }, 400);
  }

  const user = c.get("user") as { id?: number };
  if (!Number.isInteger(Number(user?.id))) {
    return c.json({ error: "Invalid user in token" }, 401);
  }

  const result = await env.transport_db.prepare(
    `INSERT INTO sumo_counter_items
     (title, description, price, created_by, expires_at)
     VALUES (?, ?, ?, ?, datetime('now', '+30 days'))`,
  ).bind(
    title, description || null, price, Number(user.id),
  ).run();

  const id = Number(result.meta.last_row_id);

  try {
    await saveMedia(env, "sumo-counter", id, photos);
  } catch {
    return c.json({ error: "Upload failed; listing was rolled back" }, 500);
  }

  return c.json({ success: true, id }, 201);
});

// Delete any Lost & Found listing and its R2 files.
media.delete("/lost-found/:id", authMiddleware, requireManager, async (c) => {
  const env = c.env as MediaBindings;
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id < 1) {
    return c.json({ error: "Invalid listing ID" }, 400);
  }

  const { results = [] } = await env.transport_db.prepare(
    "SELECT object_key FROM lost_found_media WHERE listing_id = ?",
  ).bind(id).all();

  try {
    await removeObjects(env, results.map((r: any) => r.object_key));
  } catch {
    return c.json({ error: "Could not delete media; listing retained" }, 500);
  }

  await env.transport_db.prepare(
    "DELETE FROM lost_found_media WHERE listing_id = ?",
  ).bind(id).run();
  await env.transport_db.prepare(
    "DELETE FROM lost_found WHERE id = ?",
  ).bind(id).run();

  return c.json({ success: true });
});

// Delete any Sumo Counter item and its R2 files.
media.delete("/sumo-counter/:id", authMiddleware, requireManager, async (c) => {
  const env = c.env as MediaBindings;
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id < 1) {
    return c.json({ error: "Invalid item ID" }, 400);
  }

  const { results = [] } = await env.transport_db.prepare(
    "SELECT object_key FROM sumo_counter_media WHERE item_id = ?",
  ).bind(id).all();

  try {
    await removeObjects(env, results.map((r: any) => r.object_key));
  } catch {
    return c.json({ error: "Could not delete media; item retained" }, 500);
  }

  await env.transport_db.prepare(
    "DELETE FROM sumo_counter_media WHERE item_id = ?",
  ).bind(id).run();
  await env.transport_db.prepare(
    "DELETE FROM sumo_counter_items WHERE id = ?",
  ).bind(id).run();

  return c.json({ success: true });
});

// Expiry cleanup is invoked by the Worker's scheduled handler.
export async function cleanupExpiredMedia(env: MediaBindings) {
  const db = env.transport_db;

  const lost = await db.prepare(
    "SELECT id FROM lost_found WHERE expires_at <= CURRENT_TIMESTAMP",
  ).all();

  for (const item of lost.results as Array<{ id: number }>) {
    const files = await db.prepare(
      "SELECT object_key FROM lost_found_media WHERE listing_id = ?",
    ).bind(item.id).all();

    try {
      await removeObjects(
        env,
        (files.results as Array<{ object_key: string }>).map((f) => f.object_key),
      );
      await db.prepare(
        "DELETE FROM lost_found_media WHERE listing_id = ?",
      ).bind(item.id).run();
      await db.prepare("DELETE FROM lost_found WHERE id = ?")
        .bind(item.id).run();
    } catch (error) {
      console.error("Lost & Found expiry cleanup failed", item.id, error);
    }
  }

  const items = await db.prepare(
    "SELECT id FROM sumo_counter_items WHERE expires_at <= CURRENT_TIMESTAMP",
  ).all();

  for (const item of items.results as Array<{ id: number }>) {
    const files = await db.prepare(
      "SELECT object_key FROM sumo_counter_media WHERE item_id = ?",
    ).bind(item.id).all();

    try {
      await removeObjects(
        env,
        (files.results as Array<{ object_key: string }>).map((f) => f.object_key),
      );
      await db.prepare(
        "DELETE FROM sumo_counter_media WHERE item_id = ?",
      ).bind(item.id).run();
      await db.prepare("DELETE FROM sumo_counter_items WHERE id = ?")
        .bind(item.id).run();
    } catch (error) {
      console.error("Sumo Counter expiry cleanup failed", item.id, error);
    }
  }
}

export default media;
