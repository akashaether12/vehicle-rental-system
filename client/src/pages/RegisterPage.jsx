import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiError } from "../api/http";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Registration successful.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getApiError(error, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create Customer Account</h1>
        <p className="muted">Use valid license details to complete bookings quickly.</p>

        <div className="grid grid-2">
          <label>
            First Name
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Last Name
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        <div className="grid grid-2">
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            License Number
            <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required />
          </label>
        </div>

        <label>
          License Expiry
          <input type="date" name="licenseExpiry" value={form.licenseExpiry} onChange={handleChange} />
        </label>

        <button className="btn btn-full" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="muted">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </form>
    </section>
  );
}
