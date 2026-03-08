export default function StatCard({ label, value, accent = "default" }) {
  return (
    <div className={`card stat-card stat-${accent}`}>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}
