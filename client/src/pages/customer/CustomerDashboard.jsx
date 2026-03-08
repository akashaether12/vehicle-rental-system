import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";
import StatCard from "../../components/StatCard";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/bookings/my");
        setBookings(response.data.bookings || []);
      } catch (error) {
        toast.error(getApiError(error, "Failed to load dashboard."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const now = dayjs();
    const upcoming = bookings.filter(
      (booking) => booking.status !== "canceled" && dayjs(booking.endDate).isAfter(now.subtract(1, "day"))
    ).length;
    const pending = bookings.filter((booking) => booking.status === "pending_payment").length;
    const past = bookings.filter((booking) => dayjs(booking.endDate).isBefore(now) || booking.status === "canceled")
      .length;

    return { upcoming, pending, past };
  }, [bookings]);

  if (loading) return <LoadingScreen label="Preparing dashboard..." />;

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>Customer Dashboard</h1>
        <p>Track upcoming rentals, pending payments, and previous trips.</p>
      </section>

      <section className="grid grid-3">
        <StatCard label="Upcoming Bookings" value={stats.upcoming} accent="good" />
        <StatCard label="Pending Payments" value={stats.pending} accent="warn" />
        <StatCard label="Past / Canceled" value={stats.past} accent="default" />
      </section>

      <section className="card stack">
        <div className="section-head">
          <h2>Recent Bookings</h2>
        </div>
        {bookings.length === 0 ? (
          <p className="muted">No bookings yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      {booking.vehicle?.brand} {booking.vehicle?.model}
                    </td>
                    <td>
                      {dayjs(booking.startDate).format("DD MMM YYYY")} -{" "}
                      {dayjs(booking.endDate).format("DD MMM YYYY")}
                    </td>
                    <td>{booking.status}</td>
                    <td>INR {booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="row gap">
          <Link className="btn btn-small" to="/vehicles">
            Book Another Vehicle
          </Link>
          <Link className="btn btn-small btn-ghost" to="/my-bookings">
            View All Bookings
          </Link>
        </div>
      </section>
    </div>
  );
}
