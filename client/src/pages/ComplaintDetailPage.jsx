import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

export default function ComplaintDetailPage({ api, id }) {
  const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api(`/complaints/${id}`).then(setData).catch((requestError) => setError(requestError.message)); }, [id]);
  if (error) return <section className="page"><p className="error">{error}</p></section>;
  if (!data) return <Loading />;
  const { complaint, history } = data;
  return <section className="detail-page"><a className="text-button" href="#dashboard">← Back to complaints</a><article className="detail-card"><div className="card-meta"><span className="kicker">{complaint.ticketId}</span><StatusBadge value={complaint.status} /></div><h2>{complaint.title}</h2><p>{complaint.description}</p><div className="detail-grid"><div>Category<strong>{complaint.category}</strong></div><div>Urgency<strong>{complaint.urgency}</strong></div><div>Department<strong>{complaint.department?.name || "Being assigned"}</strong></div><div>Location<strong>{complaint.location?.address || "Not provided"}</strong></div></div><h3>Activity</h3><div className="timeline">{history.map((item) => <div key={item._id} className="timeline-item"><StatusBadge value={item.to} /><p>{new Date(item.createdAt).toLocaleString()} · {item.changedBy?.name || "System"}</p>{item.remark && <span>{item.remark}</span>}</div>)}</div></article></section>;
}
