import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";
import PaymentForm from "../../components/PaymentForm";

const tabs = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past / Canceled" },
];

export default function MyBookingsPage() {
  const [tab, setTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payBooking, setPayBooking] = useState(null);

  const fetchBookings = useCallback(async (activeTab = tab) => {
    setLoading(true);
    try {
      const response = await api.get("/bookings/my", {
        params: { filter: activeTab },
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      toast.error(getApiError(error, "Failed to load bookings."));
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchBookings(tab);
  }, [tab, fetchBookings]);

  const cancelBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success("Booking canceled.");
      fetchBookings();
    } catch (error) {
      toast.error(getApiError(error, "Failed to cancel booking."));
    }
  };

  if (loading) return <LoadingScreen label="Loading bookings..." />;

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>My Bookings</h1>
        <p>View upcoming and past bookings. Complete pending payments or cancel before start date.</p>
      </section>

      <div className="row gap">
        {tabs.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`pill-tab ${tab === item.value ? "pill-tab-active" : ""}`}
            onClick={() => setTab(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="state-card">No bookings found.</div>
      ) : (
        <section className="stack">
          {bookings.map((booking) => {
            const holdExpired =
              booking.status === "pending_payment" &&
              booking.holdExpiresAt &&
              dayjs(booking.holdExpiresAt).isBefore(dayjs());

            return (
              <article className="card stack" key={booking._id}>
                <div className="row between">
                  <div>
                    <h3>
                      {booking.vehicle?.brand} {booking.vehicle?.model}
                    </h3>
                    <p className="muted">
                      {dayjs(booking.startDate).format("DD MMM YYYY")} -{" "}
                      {dayjs(booking.endDate).format("DD MMM YYYY")} ({booking.days} day(s))
                    </p>
                  </div>
                  <div className="stack-sm">
                    <span
                      className={`pill ${
                        booking.status === "confirmed"
                          ? "pill-success"
                          : booking.status === "pending_payment"
                            ? "pill-warning"
                            : "pill-danger"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="muted">INR {booking.totalPrice}</span>
                  </div>
                </div>

                {holdExpired && <p className="error-text">Payment hold expired. Create a new booking.</p>}

                <div className="row gap">
                  {booking.status === "pending_payment" && !holdExpired && (
                    <button className="btn btn-small" type="button" onClick={() => setPayBooking(booking)}>
                      Pay Now
                    </button>
                  )}
                  {booking.status !== "canceled" && (
                    <button className="btn btn-ghost btn-small" type="button" onClick={() => cancelBooking(booking._id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {payBooking && (
        <PaymentForm
          booking={payBooking}
          onSuccess={() => {
            setPayBooking(null);
            fetchBookings();
          }}
          onCancel={() => setPayBooking(null)}
        />
      )}
    </div>
  );
}
