import { useEffect, useState } from "react";
import { statuses } from "../constants/complaints";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

export default function ManagePage({ api, notify, user }) {
  const [items, setItems] = useState(null);
  const [users, setUsers] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    api("/complaints").then((data) => setItems(data.complaints)).catch((error) => notify(error.message));
    if (user.role === "admin") {
      api("/auth").then((data) => setUsers(data.users)).catch((error) => notify(error.message));
    }
  }, []);

  const update = async (id, status) => {
    try {
      await api(`/complaints/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setItems((old) => old.map((item) => item._id === id ? { ...item, status } : item));
      notify("Complaint status updated");
    } catch (error) { notify(error.message); }
  };

  const respond = async (id) => {
    const message = responses[id]?.trim();
    if (!message) return notify("Write a response before sending");
    try {
      const { complaint } = await api(`/complaints/${id}/response`, { method: "PATCH", body: JSON.stringify({ message }) });
      setItems((old) => old.map((item) => item._id === id ? complaint : item));
      setResponses((old) => ({ ...old, [id]: "" }));
      notify("Official response sent");
    } catch (error) { notify(error.message); }
  };

  const removeComplaint = async (id) => {
    if (!window.confirm("Delete this complaint permanently?")) return;
    try {
      await api(`/complaints/${id}`, { method: "DELETE" });
      setItems((old) => old.filter((item) => item._id !== id));
      notify("Complaint deleted");
    } catch (error) { notify(error.message); }
  };

  const removeUser = async (item) => {
    if (!window.confirm(`Delete ${item.name} and all complaints they filed? This cannot be undone.`)) return;
    try {
      await api(`/auth/${item._id}`, { method: "DELETE" });
      setUsers((old) => old.filter((userItem) => userItem._id !== item._id));
      setItems((old) => old.filter((complaint) => complaint.citizen?.toString() !== item._id));
      notify("User and their complaints deleted");
    } catch (error) { notify(error.message); }
  };

  return <section className="page">
    <div className="page-title"><div><p className="kicker">STAFF WORKSPACE</p><h2>Complaint management</h2><p className="subtitle">Review citizen complaints, acknowledge receipt, and send official responses.</p></div></div>
    {user.role === "admin" && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="kicker">ADMINISTRATION</p><h3>User accounts</h3></div><span className="dashboard-count">{users?.length ?? 0} users</span></div>{users === null ? <Loading /> : <div className="user-list">{users.map((item) => <div className="user-row" key={item._id}><div><strong>{item.name}</strong><span>{item.email} · {item.role}</span></div><button className="danger-button" onClick={() => removeUser(item)}>Remove user</button></div>)}</div>}</section>}
    <div className="manage-heading"><h3>Complaints</h3><span className="dashboard-count">{items?.length ?? 0} total</span></div>
    {items === null ? <Loading /> : <div className="cards">{items.map((item) => <article className="complaint-card" key={item._id}><div className="card-meta"><StatusBadge value={item.status} /><span>{item.ticketId}</span></div><h3>{item.title}</h3><p>{item.description.slice(0, 120)}</p><label>Update status<select value={item.status} onChange={(event) => update(item._id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>{item.officialResponse?.message && <p className="official-response"><strong>Response sent:</strong> {item.officialResponse.message}</p>}<label>Official response<textarea rows="3" placeholder="Tell the citizen what happens next..." value={responses[item._id] || ""} onChange={(event) => setResponses((old) => ({ ...old, [item._id]: event.target.value }))} /></label><button className="button" onClick={() => respond(item._id)}>Send response</button>{user.role === "admin" && <button className="danger-button" onClick={() => removeComplaint(item._id)}>Delete complaint</button>}<a className="text-button" href={`#complaint/${item._id}`}>View details →</a></article>)}</div>}
  </section>;
}
