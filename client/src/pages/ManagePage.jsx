import { useEffect, useState } from "react";
import { statuses } from "../constants/complaints";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

export default function ManagePage({ api, notify }) {
  const [items, setItems] = useState(null);
  const [responses, setResponses] = useState({});
  useEffect(() => { api("/complaints").then((data) => setItems(data.complaints)); }, []);
  const update = async (id, status) => { try { await api(`/complaints/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); setItems((old) => old.map((item) => item._id === id ? { ...item, status } : item)); notify("Complaint status updated"); } catch (error) { notify(error.message); } };
  const respond = async (id) => { const message = responses[id]?.trim(); if (!message) return notify("Write a response before sending"); try { const { complaint } = await api(`/complaints/${id}/response`, { method: "PATCH", body: JSON.stringify({ message }) }); setItems((old) => old.map((item) => item._id === id ? complaint : item)); setResponses((old) => ({ ...old, [id]: "" })); notify("Official response sent"); } catch (error) { notify(error.message); } };
  return <section className="page"><div className="page-title"><div><p className="kicker">STAFF WORKSPACE</p><h2>Complaint management</h2><p className="subtitle">Review citizen complaints, acknowledge receipt, and send official responses.</p></div></div>{items === null ? <Loading /> : <div className="cards">{items.map((item) => <article className="complaint-card" key={item._id}><div className="card-meta"><StatusBadge value={item.status} /><span>{item.ticketId}</span></div><h3>{item.title}</h3><p>{item.description.slice(0, 120)}</p><label>Update status<select value={item.status} onChange={(event) => update(item._id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>{item.officialResponse?.message && <p className="official-response"><strong>Response sent:</strong> {item.officialResponse.message}</p>}<label>Official response<textarea rows="3" placeholder="Tell the citizen what happens next..." value={responses[item._id] || ""} onChange={(event) => setResponses((old) => ({ ...old, [item._id]: event.target.value }))} /></label><button className="button" onClick={() => respond(item._id)}>Send response</button><a className="text-button" href={`#complaint/${item._id}`}>View details →</a></article>)}</div>}</section>;
}
