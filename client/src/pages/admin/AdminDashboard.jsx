import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/reports/dashboard");
        setReport(response.data);
      } catch (error) {
        toast.error(getApiError(error, "Failed to load admin dashboard."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <LoadingScreen label="Loading admin dashboard..." />;
  if (!report) return <div className="state-card">Unable to load dashboard report.</div>;

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>Admin Dashboard</h1>
        <p>Monitor users, fleet, bookings, and revenue.</p>
      </section>

      <section className="grid grid-4">
        <StatCard label="Customers" value={report.totalUsers} accent="default" />
        <StatCard label="Active Vehicles" value={report.totalVehicles} accent="good" />
        <StatCard label="Confirmed Bookings" value={report.totalBookings} accent="warn" />
        <StatCard label="Revenue (INR)" value={report.totalRevenue} accent="good" />
      </section>

      <section className="card stack">
        <h2>Quick Admin Actions</h2>
        <div className="row gap wrap">
          <Link className="btn btn-small" to="/admin/vehicles">
            Add / Edit Vehicles
          </Link>
          <Link className="btn btn-small btn-ghost" to="/admin/bookings">
            Manage Bookings
          </Link>
          <Link className="btn btn-small btn-ghost" to="/admin/users">
            Manage Users
          </Link>
          <Link className="btn btn-small btn-ghost" to="/admin/reports">
            View Reports
          </Link>
        </div>
      </section>
    </div>
  );
}
