import { BatteryCharging, Fuel, GaugeCircle, MapPin, Users } from "lucide-react";
import { getVehicleDisplayName, getVehicleSpecs, getVehicleSubtitle, getVehicleTheme } from "../utils/vehicleTheme";

export default function VehiclePoster({ vehicle, compact = false }) {
  const theme = getVehicleTheme(vehicle?.type);
  const displayName = getVehicleDisplayName(vehicle);
  const subtitle = getVehicleSubtitle(vehicle);
  const specs = getVehicleSpecs(vehicle);

  return (
    <div
      className={`vehicle-poster ${compact ? "vehicle-poster-compact" : ""}`}
      style={{
        "--poster-base": theme.base,
        "--poster-base-alt": theme.baseAlt,
        "--poster-accent": theme.accent,
        "--poster-accent-soft": theme.accentSoft,
      }}
      aria-label={`${displayName} visual`}
    >
      <div className="vehicle-poster-glow" />

      <div className="vehicle-poster-head">
        <span className="vehicle-poster-eyebrow">{theme.eyebrow}</span>
        <span className="vehicle-poster-chip">{theme.chip}</span>
      </div>

      <div className="vehicle-poster-copy">
        <h3>{displayName}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="vehicle-poster-stats">
        <span>
          <Users size={13} /> {specs[0]}
        </span>
        <span>
          <GaugeCircle size={13} /> {specs[1]}
        </span>
        <span>
          {vehicle?.fuelType === "electric" ? <BatteryCharging size={13} /> : <Fuel size={13} />} {specs[2]}
        </span>
        <span>
          <MapPin size={13} /> {vehicle?.location}
        </span>
      </div>

      <div className={`vehicle-silhouette vehicle-silhouette-${vehicle?.type || "other"}`}>
        <div className="vehicle-silhouette-road" />
        <div className="vehicle-silhouette-body" />
        <div className="vehicle-silhouette-roof" />
        <div className="vehicle-silhouette-window vehicle-silhouette-window-front" />
        <div className="vehicle-silhouette-window vehicle-silhouette-window-back" />
        <div className="vehicle-silhouette-light" />
        <div className="vehicle-silhouette-wheel vehicle-silhouette-wheel-front" />
        <div className="vehicle-silhouette-wheel vehicle-silhouette-wheel-back" />
      </div>
    </div>
  );
}
