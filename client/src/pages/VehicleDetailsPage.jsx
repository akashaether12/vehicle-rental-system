import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { getApiError } from "../api/http";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";
import PaymentForm from "../components/PaymentForm";

const fallbackImage =
  "https://images.unsplash.com/photo-1549925862-990f9b473f13?auto=format&fit=crop&w=1200&q=80";

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
  });
  const [availability, setAvailability] = useState(null);
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const dayCount = useMemo(() => {
    const start = dayjs(dates.startDate);
    const end = dayjs(dates.endDate);
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) return 0;
    return end.diff(start, "day") + 1;
  }, [dates]);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const response = await api.get(`/vehicles/${id}`);
        setVehicle(response.data.vehicle);
      } catch (error) {
        toast.error(getApiError(error, "Failed to fetch vehicle details."));
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const checkAvailability = async () => {
    if (!dates.startDate || !dates.endDate) {
      toast.error("Select start and end dates.");
      return;
    }

    try {
      const response = await api.get(`/vehicles/${id}/availability`, {
        params: dates,
      });
      setAvailability(response.data.available);
      if (response.data.available) {
        toast.success("Vehicle is available for selected dates.");
      } else {
        toast.error("Vehicle is not available for selected dates.");
      }
    } catch (error) {
      toast.error(getApiError(error, "Availability check failed."));
    }
  };

  const createBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/vehicles/${id}` } });
      return;
    }
    if (user.role !== "customer") {
      toast.error("Only customers can create bookings.");
      return;
    }

    if (availability !== true) {
      toast.error("Check availability first.");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post("/bookings", {
        vehicleId: id,
        ...dates,
      });
      setBooking(response.data.booking);
      toast.success("Booking hold created. Complete payment now.");
    } catch (error) {
      toast.error(getApiError(error, "Failed to create booking."));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingScreen label="Loading vehicle details..." />;
  if (!vehicle) return <div className="state-card">Vehicle not found.</div>;

  return (
    <div className="stack-lg">
      <section className="grid grid-2">
        <img className="detail-image" src={vehicle.images?.[0] || fallbackImage} alt={vehicle.model} />
        <article className="card stack">
          <h1>
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="muted">{vehicle.description || "Premium rental vehicle with verified documents."}</p>
          <p>
            <strong>Type:</strong> {vehicle.type}
          </p>
          <p>
            <strong>Transmission:</strong> {vehicle.transmission}
          </p>
          <p>
            <strong>Fuel:</strong> {vehicle.fuelType}
          </p>
          <p>
            <strong>Seats:</strong> {vehicle.seats}
          </p>
          <p>
            <strong>Location:</strong> {vehicle.location}
          </p>
          <p className="price">INR {vehicle.pricePerDay}/day</p>
        </article>
      </section>

      <section className="card stack">
        <h2>Book This Vehicle</h2>
        <div className="grid grid-3">
          <label>
            Start Date
            <input
              type="date"
              value={dates.startDate}
              onChange={(event) => setDates((prev) => ({ ...prev, startDate: event.target.value }))}
            />
          </label>
          <label>
            End Date
            <input
              type="date"
              value={dates.endDate}
              onChange={(event) => setDates((prev) => ({ ...prev, endDate: event.target.value }))}
            />
          </label>
          <div className="summary-box">
            <p>Duration</p>
            <h3>{dayCount} day(s)</h3>
            <p>Estimated total: INR {dayCount > 0 ? dayCount * vehicle.pricePerDay : 0}</p>
          </div>
        </div>

        <div className="row gap">
          <button className="btn btn-small" type="button" onClick={checkAvailability}>
            Check Availability
          </button>
          <button
            className="btn btn-small btn-ghost"
            type="button"
            onClick={createBooking}
            disabled={bookingLoading}
          >
            {bookingLoading ? "Creating..." : "Create Booking"}
          </button>
          {availability !== null && (
            <span className={`pill ${availability ? "pill-success" : "pill-danger"}`}>
              {availability ? "Available" : "Unavailable"}
            </span>
          )}
        </div>
      </section>

      {booking && (
        <PaymentForm
          booking={booking}
          onSuccess={() => {
            setBooking(null);
            navigate("/my-bookings");
          }}
          onCancel={() => setBooking(null)}
        />
      )}
    </div>
  );
}
