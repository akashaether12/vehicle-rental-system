export default function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="state-card">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
