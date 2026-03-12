import { Link } from "react-router-dom";
import { ArrowRight, Gauge, MapPin, Users } from "lucide-react";
import VehiclePoster from "./VehiclePoster";
import { getVehicleDisplayName, getVehicleSubtitle } from "../utils/vehicleTheme";

export default function VehicleCard({ vehicle }) {
  return (
    <article className="card vehicle-card">
      <VehiclePoster vehicle={vehicle} compact />

      <div className="vehicle-body">
        <div className="vehicle-top">
          <div className="stack-sm">
            <h3>{getVehicleDisplayName(vehicle)}</h3>
            <p className="vehicle-subtitle">{getVehicleSubtitle(vehicle)}</p>
          </div>
          <span className={`pill ${vehicle.isActive ? "pill-success" : "pill-muted"}`}>
            {vehicle.isActive ? "Available" : "Inactive"}
          </span>
        </div>

        <p className="vehicle-blurb">
          {vehicle.description || "Curated for reliable rentals with clear pricing and verified details."}
        </p>

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
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
