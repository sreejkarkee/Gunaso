import { useEffect, useState } from "react";
import { categories } from "../constants/complaints";

export default function ComplaintFormPage({ api, notify }) {
  const [form, setForm] = useState({ title: "", description: "", category: "other", urgency: "medium", address: "" });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const selectImages = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError("Images must be JPG, PNG, or WebP files smaller than 5 MB.");
      return;
    }
    setError("");
    setImages(selected.map((image) => Object.assign(image, { preview: URL.createObjectURL(image) })));
  };
  useEffect(() => () => images.forEach((image) => URL.revokeObjectURL(image.preview)), [images]);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const payload = new FormData();
      payload.append("payload", JSON.stringify({ ...form, location: { coordinates: [0, 0], address: form.address } }));
      images.forEach((image) => payload.append("images", image));
      const { complaint } = await api("/complaints", { method: "POST", body: payload });
      notify(`Complaint ${complaint.ticketId} submitted`); window.location.hash = `#complaint/${complaint._id}`;
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  };
  return <section className="form-page"><div className="form-heading"><div><p className="kicker">PUBLIC SERVICE REQUEST</p><h2>File a complaint</h2><p className="subtitle">Give enough detail for the right department to help.</p></div><span className="form-step">01 / 02</span></div><form onSubmit={submit}><label>Title<input name="title" required minLength="5" maxLength="120" placeholder="What needs attention?" value={form.title} onChange={update} /></label><label>Description<textarea name="description" required minLength="10" placeholder="Describe what happened..." value={form.description} onChange={update} /></label><div className="form-row"><label>Category<select name="category" value={form.category} onChange={update}>{categories.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label><label>Urgency<select name="urgency" value={form.urgency} onChange={update}><option>low</option><option>medium</option><option>high</option><option>critical</option></select></label></div><label>Location or address<input name="address" required placeholder="Ward, street, or landmark" value={form.address} onChange={update} /></label><div className="upload-box"><div><strong>Add photos</strong><span>Help officers understand the issue. Up to 5 images, 5 MB each.</span></div><label className="upload-button">Choose images<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectImages} /></label>{images.length > 0 && <div className="image-previews">{images.map((image) => <img key={image.name} src={image.preview} alt={image.name} />)}</div>}</div>{error && <p className="error">{error}</p>}<div className="form-actions"><button className="button" disabled={busy}>{busy ? "Submitting..." : "Submit complaint"}</button><a className="text-button" href="#dashboard">Cancel</a></div></form></section>;
}
