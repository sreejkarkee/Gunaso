import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

function locationLabel(location) {
  if (location?.address) return location.address;
  if (location?.coordinates?.length === 2) {
    return `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`;
  }
  return "Location not provided";
}

function ComplaintFeedCard({ item }) {
  return (
    <article className="feed-card">
      <div className="card-meta">
        <StatusBadge value={item.status} />
        <span>{item.ticketId}</span>
      </div>
      <div className="feed-card-heading">
        <div>
          <p className="feed-category">{item.category}</p>
          <h3>{item.title}</h3>
        </div>
        <span className={`urgency urgency-${item.urgency}`}>{item.urgency}</span>
      </div>
      <p className="feed-description">{item.description}</p>
      <div className="feed-details">
        <span><strong>Filed by</strong>{item.citizen?.name || "Anonymous citizen"}</span>
        <span><strong>Location</strong>{locationLabel(item.location)}</span>
      </div>
    </article>
  );
}

export default function FeedPage({ api }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/complaints/feed")
      .then((data) => setItems(data.complaints))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <section className="page feed-page">
      <div className="page-title feed-title">
        <div>
          <p className="kicker">COMMUNITY PULSE</p>
          <h1>Complaint feed</h1>
          <p className="subtitle">See what your community has reported and follow each issue as it moves forward.</p>
        </div>
        <span className="dashboard-count">{items?.length ?? 0} reports</span>
      </div>
      {error && <div className="empty error-state"><h3>We could not load the feed</h3><p>{error}</p></div>}
      {!error && (items === null ? <Loading /> : items.length ? (
        <div className="feed-list">{items.map((item) => <ComplaintFeedCard key={item._id} item={item} />)}</div>
      ) : <div className="empty"><h3>No complaints have been filed yet</h3><p>Be the first to report an issue in your community.</p></div>)}
    </section>
  );
}
