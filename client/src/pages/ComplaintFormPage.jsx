import { useEffect, useState } from "react";
import { categories } from "../constants/complaints";

const maxImages = 5;

export default function ComplaintFormPage({ api, notify }) {
  const [form, setForm] = useState({ title: "", description: "", category: "other", urgency: "medium", address: "" });
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const selectImages = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError("Images must be JPG, PNG, or WebP files smaller than 5 MB.");
      return;
    }
    if (selected.length + images.length + imageUrls.length > maxImages) {
      setError(`You can attach up to ${maxImages} images.`);
      return;
    }
    setError("");
    setImages((current) => [...current, ...selected.map((image) => Object.assign(image, { preview: URL.createObjectURL(image) }))]);
    event.target.value = "";
  };

  const addImageUrl = () => {
    const value = imageUrl.trim();
    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      setError("Enter a valid HTTP or HTTPS image URL.");
      return;
    }
    if (images.length + imageUrls.length >= maxImages) {
      setError(`You can attach up to ${maxImages} images.`);
      return;
    }
    if (imageUrls.includes(value)) {
      setError("That image URL has already been added.");
      return;
    }
    setImageUrls((current) => [...current, value]);
    setImageUrl("");
    setError("");
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const removeImageUrl = (url) => setImageUrls((current) => current.filter((item) => item !== url));

  useEffect(() => () => images.forEach((image) => URL.revokeObjectURL(image.preview)), [images]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("payload", JSON.stringify({
        ...form,
        location: { coordinates: [0, 0], address: form.address },
        attachments: imageUrls,
      }));
      images.forEach((image) => payload.append("images", image));
      const { complaint } = await api("/complaints", { method: "POST", body: payload });
      notify(`Complaint ${complaint.ticketId} submitted`);
      window.location.hash = `#complaint/${complaint._id}`;
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return <section className="form-page">
    <div className="form-heading"><div><p className="kicker">PUBLIC SERVICE REQUEST</p><h2>File a complaint</h2><p className="subtitle">Give enough detail for the right department to help.</p></div><span className="form-step">01 / 02</span></div>
    <form onSubmit={submit}>
      <label>Title<input name="title" required minLength="5" maxLength="120" placeholder="What needs attention?" value={form.title} onChange={update} /></label>
      <label>Description<textarea name="description" required minLength="10" placeholder="Describe what happened..." value={form.description} onChange={update} /></label>
      <div className="form-row"><label>Category<select name="category" value={form.category} onChange={update}>{categories.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label><label>Urgency<select name="urgency" value={form.urgency} onChange={update}><option>low</option><option>medium</option><option>high</option><option>critical</option></select></label></div>
      <label>Location or address<input name="address" required placeholder="Ward, street, or landmark" value={form.address} onChange={update} /></label>
      <div className="upload-box">
        <div><strong>Add photos</strong><span>Upload from your device or add image URLs. Up to 5 images, 5 MB each for uploads.</span></div>
        <label className="upload-button">Choose images<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectImages} /></label>
        <div className="image-url-row"><input type="url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addImageUrl())} /><button className="secondary-button" type="button" onClick={addImageUrl}>Add URL</button></div>
        {(images.length > 0 || imageUrls.length > 0) && <div className="attachment-list">{images.map((image, index) => <div className="attachment-item" key={`${image.name}-${index}`}><img src={image.preview} alt={image.name} /><button type="button" onClick={() => removeImage(index)} aria-label={`Remove ${image.name}`}>×</button></div>)}{imageUrls.map((url) => <div className="attachment-item" key={url}><img src={url} alt="External attachment preview" onError={(event) => { event.currentTarget.style.opacity = "0.35"; }} /><button type="button" onClick={() => removeImageUrl(url)} aria-label="Remove image URL">×</button></div>)}</div>}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="form-actions"><button className="button" disabled={busy}>{busy ? "Submitting..." : "Submit complaint"}</button><a className="text-button" href="#dashboard">Cancel</a></div>
    </form>
  </section>;
}
