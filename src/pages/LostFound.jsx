
import { useCallback, useEffect, useState } from "react";
import "../styles/MediaListings.css";

const API = import.meta.env.VITE_API_URL ||
  "https://transport-system.celestialq7.workers.dev";

export default function LostFound() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/media/lost-found`);
      if (!response.ok) throw new Error("Could not load listings");
      setItems(await response.json());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const photos = data.getAll("photos").filter((f) => f.size > 0);
    const video = data.get("video");

    if (photos.length < 1 || photos.length > 3) {
      setError("Select 1–3 photos.");
      return;
    }
    if (photos.some((f) => f.size > 1024 * 1024)) {
      setError("Each photo must be 1 MB or smaller.");
      return;
    }
    if (video?.size > 8 * 1024 * 1024) {
      setError("The video must be 8 MB or smaller.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${API}/api/media/lost-found`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");

      form.reset();
      setMessage("Listing published.");
      await loadItems();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(id) {
    if (!window.confirm("Delete this listing and its media files?")) return;

    setError("");
    try {
      const response = await fetch(`${API}/api/media/lost-found/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Delete failed");
      await loadItems();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="media-manager">
      <h1>Lost &amp; Found</h1>
      <p>Listings are published immediately and expire after 7 days.</p>

      <form className="media-form" onSubmit={submit}>
        <label>
          Title *
          <input name="title" required maxLength={150} />
        </label>
        <label>
          Description
          <textarea name="description" rows="3" maxLength={2000} />
        </label>
        <label>
          Location
          <input name="location" maxLength={200} />
        </label>
        <label>
          Photos * (1–3, up to 1 MB each)
          <input
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
          />
        </label>
        <label>
          Optional short video (up to 8 MB)
          <input
            name="video"
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
          />
        </label>
        {error && <p className="media-error">{error}</p>}
        {message && <p className="media-success">{message}</p>}
        <button disabled={busy}>
          {busy ? "Uploading…" : "Publish listing"}
        </button>
      </form>

      <h2>Current listings</h2>
      <div className="media-grid">
        {items.map((item) => (
          <article className="media-card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.location && <p>Location: {item.location}</p>}
            <div className="media-gallery">
              {item.media?.map((file) =>
                file.type === "video" ? (
                  <video key={file.id} src={file.url} controls />
                ) : (
                  <img key={file.id} src={file.url} alt={item.title} />
                )
              )}
            </div>
            <button
              type="button"
              className="media-delete"
              onClick={() => removeItem(item.id)}
            >
              Delete listing
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
