import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

function ComplaintCard({ item }) {
  return <article className="complaint-card"><div className="card-meta"><StatusBadge value={item.status} /><span>{item.ticketId}</span></div><h3>{item.title}</h3><p>{item.description.slice(0, 150)}{item.description.length > 150 ? "…" : ""}</p><a className="text-button" href={`#complaint/${item._id}`}>View details →</a></article>;
}

export default function DashboardPage({ api }) {
  const [items, setItems] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api("/complaints").then((data) => setItems(data.complaints)).catch((requestError) => setError(requestError.message)); }, []);
  return <section className="page"><div className="page-title"><div><p className="kicker">CITIZEN DASHBOARD</p><h2>Your complaints</h2></div><a className="button" href="#new">+ File complaint</a></div>{error && <p className="error">{error}</p>}{items === null ? <Loading /> : items.length ? <div className="cards">{items.map((item) => <ComplaintCard key={item._id} item={item} />)}</div> : <div className="empty"><h3>No complaints yet</h3><p>File your first complaint and start tracking progress.</p><a className="button" href="#new">File a complaint</a></div>}</section>;
}
