
import { useCallback, useEffect, useState } from "react";
import "../styles/MediaListings.css";

const API = import.meta.env.VITE_API_URL ||
  "https://transport-system.celestialq7.workers.dev";

export default function SumoCounter() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/media/sumo-counter`);
      if (!response.ok) throw new Error("Could not load items");
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

    if (photos.length < 1 || photos.length > 3) {
      setError("Select 1–3 photos.");
      return;
    }
    if (photos.some((f) => f.size > 1024 * 1024)) {
      setError("Each photo must be 1 MB or smaller.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${API}/api/media/sumo-counter`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");

      form.reset();
      setMessage("Item published.");
      await loadItems();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(id) {
    if (!window.confirm("Delete this item and its photos?")) return;

    setError("");
    try {
      const response = await fetch(`${API}/api/media/sumo-counter/${id}`, {
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
      <h1>Items for Sale</h1>
      <p>Items publish immediately and expire after 30 days.</p>

      <form className="media-form" onSubmit={submit}>
        <label>
          Item title *
          <input name="title" required maxLength={150} />
        </label>
        <label>
          Description
          <textarea name="description" rows="3" maxLength={2000} />
        </label>
        <label>
          Price (₹)
          <input name="price" type="number" min="0" step="0.01" />
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
        {error && <p className="media-error">{error}</p>}
        {message && <p className="media-success">{message}</p>}
        <button disabled={busy}>
          {busy ? "Uploading…" : "Publish item"}
        </button>
      </form>

      <h2>Current items</h2>
      <div className="media-grid">
        {items.map((item) => (
          <article className="media-card" key={item.id}>
            <h3>{item.title}</h3>
            {item.price !== null && item.price !== "" && (
              <strong>₹{Number(item.price).toLocaleString("en-IN")}</strong>
            )}
            <p>{item.description}</p>
            <div className="media-gallery">
              {item.photos?.map((photo) => (
                <img key={photo.id} src={photo.url} alt={item.title} />
              ))}
            </div>
            <button
              type="button"
              className="media-delete"
              onClick={() => removeItem(item.id)}
            >
              Delete item
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
