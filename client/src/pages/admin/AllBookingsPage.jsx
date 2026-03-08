import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";

export default function AllBookingsPage() {
  const [status, setStatus] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async (statusFilter = status) => {
    setLoading(true);
    try {
      const response = await api.get("/bookings", {
        params: {
          status: statusFilter || undefined,
          limit: 200,
        },
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      toast.error(getApiError(error, "Failed to load bookings."));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchBookings(status);
  }, [status, fetchBookings]);

  const cancelBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, { reason: "Canceled by admin from panel" });
      toast.success("Booking canceled.");
      fetchBookings(status);
    } catch (error) {
      toast.error(getApiError(error, "Failed to cancel booking."));
    }
  };

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>All Bookings</h1>
        <p>Monitor all reservations and apply admin cancellation when required.</p>
      </section>

      <section className="card row between wrap">
        <label>
          Status Filter
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>

        <button className="btn btn-small btn-ghost" type="button" onClick={() => fetchBookings(status)}>
          Refresh
        </button>
      </section>

      {loading ? (
        <LoadingScreen label="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <div className="state-card">No bookings found.</div>
      ) : (
        <section className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "-"}</td>
                  <td>
                    {booking.vehicle?.brand} {booking.vehicle?.model}
                  </td>
                  <td>
                    {dayjs(booking.startDate).format("DD MMM YYYY")} -{" "}
                    {dayjs(booking.endDate).format("DD MMM YYYY")}
                  </td>
                  <td>{booking.status}</td>
                  <td>{booking.paymentStatus}</td>
                  <td>INR {booking.totalPrice}</td>
                  <td>
                    {booking.status !== "canceled" ? (
                      <button className="btn btn-small btn-danger" type="button" onClick={() => cancelBooking(booking._id)}>
                        Cancel
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
