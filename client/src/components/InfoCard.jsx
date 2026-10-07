export default function InfoCard({ number, title, text }) {
  return <article className="info-card"><b>{number}</b><h3>{title}</h3><p>{text}</p></article>;
}
