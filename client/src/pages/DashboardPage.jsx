import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

function ComplaintCard({ item }) {
  return <article className="complaint-card"><div className="card-meta"><StatusBadge value={item.status} /><span>{item.ticketId}</span></div><h3>{item.title}</h3><p>{item.description.slice(0, 150)}{item.description.length > 150 ? "…" : ""}</p><a className="text-button" href={`#complaint/${item._id}`}>View details →</a></article>;
}

export default function DashboardPage({ api, user }) {
  const [items, setItems] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api("/complaints").then((data) => setItems(data.complaints)).catch((requestError) => setError(requestError.message)); }, []);
  return <section className="page"><div className="welcome-banner"><div><p className="kicker">WELCOME TO YOUR DASHBOARD</p><h1>Hello, {user.name}.</h1><p>Track your public service requests or submit a new complaint when your community needs attention.</p></div><a className="button" href="#new">File a complaint</a></div><div className="page-title"><div><p className="kicker">ACTIVITY</p><h2>Your complaints</h2></div><span className="dashboard-count">{items?.length ?? 0} total</span></div>{error && <div className="empty error-state"><h3>We could not load your dashboard</h3><p>{error}</p><button className="button" onClick={() => window.location.reload()}>Try again</button></div>}{!error && (items === null ? <Loading /> : items.length ? <div className="cards">{items.map((item) => <ComplaintCard key={item._id} item={item} />)}</div> : <div className="empty"><h3>Your dashboard is ready</h3><p>You have not filed a complaint yet. Start by telling us what needs attention.</p><a className="button" href="#new">File your first complaint</a></div>)}</section>;
}
