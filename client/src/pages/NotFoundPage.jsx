import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="state-card">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="btn btn-small" to="/">
        Return Home
      </Link>
    </div>
  );
}
