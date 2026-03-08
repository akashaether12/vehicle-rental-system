import { Link } from "react-router-dom";
import { Gauge, MapPin, Users } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80";

export default function VehicleCard({ vehicle }) {
  return (
    <article className="card vehicle-card">
      <img
        src={vehicle.images?.[0] || fallbackImage}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="vehicle-image"
      />

      <div className="vehicle-body">
        <div className="vehicle-top">
          <h3>
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className={`pill ${vehicle.isActive ? "pill-success" : "pill-muted"}`}>
            {vehicle.isActive ? "Available" : "Inactive"}
          </span>
        </div>

        <p className="muted">{vehicle.type.toUpperCase()}</p>
        <div className="vehicle-meta">
          <span>
            <Users size={14} /> {vehicle.seats} seats
          </span>
          <span>
            <Gauge size={14} /> {vehicle.transmission}
          </span>
          <span>
            <MapPin size={14} /> {vehicle.location}
          </span>
        </div>

        <div className="vehicle-bottom">
          <p className="price">INR {vehicle.pricePerDay}/day</p>
          <Link className="btn btn-small" to={`/vehicles/${vehicle._id}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
