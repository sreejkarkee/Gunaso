export default function StatusBadge({ value }) {
  return <span className={`status status-${value}`}>{value.replace("_", " ")}</span>;
}
