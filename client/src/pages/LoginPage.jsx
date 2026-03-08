import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiError } from "../api/http";

export default function LoginPage({ mode = "customer" }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await login(form, mode);
      toast.success("Login successful.");

      const fromState = location.state?.from;
      const redirect =
        (typeof fromState === "string" ? fromState : fromState?.pathname) ||
        (response.user.role === "admin" ? "/admin" : "/dashboard");
      navigate(redirect, { replace: true });
    } catch (error) {
      toast.error(getApiError(error, "Login failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>{mode === "admin" ? "Admin Login" : "Customer Login"}</h1>
        <p className="muted">
          {mode === "admin"
            ? "Sign in with admin credentials to manage vehicles and bookings."
            : "Sign in to book vehicles, make payments, and manage rentals."}
        </p>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>

        <button className="btn btn-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {mode === "customer" ? (
          <p className="muted">
            New user? <Link to="/register">Create account</Link>
          </p>
        ) : (
          <p className="muted">
            Customer login? <Link to="/login">Switch</Link>
          </p>
        )}
      </form>
    </section>
  );
}
