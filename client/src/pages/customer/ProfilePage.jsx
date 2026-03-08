import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import useAuth from "../../hooks/useAuth";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      licenseNumber: user.licenseNumber || "",
      licenseExpiry: user.licenseExpiry ? user.licenseExpiry.slice(0, 10) : "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.patch("/users/me", form);
      await refreshUser();
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getApiError(error, "Failed to update profile."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>My Profile</h1>
        <p className="muted">Update your contact and license information.</p>

        <div className="grid grid-2">
          <label>
            First Name
            <input name="firstName" value={form.firstName} onChange={handleChange} />
          </label>
          <label>
            Last Name
            <input name="lastName" value={form.lastName} onChange={handleChange} />
          </label>
        </div>

        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>

        <label>
          License Number
          <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} />
        </label>

        <label>
          License Expiry
          <input type="date" name="licenseExpiry" value={form.licenseExpiry} onChange={handleChange} />
        </label>

        <button className="btn btn-full" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
