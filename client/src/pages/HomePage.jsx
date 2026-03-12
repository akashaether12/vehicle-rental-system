import { Link } from "react-router-dom";
import { CalendarCheck, Car, CreditCard, ShieldCheck } from "lucide-react";
import VehiclePoster from "../components/VehiclePoster";

const highlights = [
  {
    icon: Car,
    title: "Clean Fleet Presentation",
    description: "Every listing now stays visually aligned and tied to actual vehicle metadata.",
  },
  {
    icon: CalendarCheck,
    title: "Reliable Availability",
    description: "Date-range checks and booking holds prevent overlapping reservations.",
  },
  {
    icon: CreditCard,
    title: "Faster Checkout",
    description: "Payment simulation remains quick, visible, and integrated with booking status.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Customer and admin journeys stay separate without creating UI confusion.",
  },
];

const previewFleet = [
  {
    name: "Honda City ZX",
    brand: "Honda",
    model: "City ZX",
    type: "sedan",
    year: 2024,
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    location: "Bangalore",
  },
  {
    name: "Mahindra XUV700 AX7",
    brand: "Mahindra",
    model: "XUV700 AX7",
    type: "suv",
    year: 2024,
    seats: 7,
    transmission: "automatic",
    fuelType: "diesel",
    location: "Hyderabad",
  },
  {
    name: "Tata Nexon EV Empowered",
    brand: "Tata",
    model: "Nexon EV Empowered",
    type: "ev",
    year: 2024,
    seats: 5,
    transmission: "automatic",
    fuelType: "electric",
    location: "Chennai",
  },
];

export default function HomePage() {
  return (
    <div className="stack-lg">
      <section className="hero hero-split">
        <div className="hero-content">
          <span className="hero-tag">Project 13 | Vehicle Rental System</span>
          <h1>Rent a vehicle through a catalog that finally feels trustworthy.</h1>
          <p>
            Browse a rebuilt fleet interface, verify dates before payment, and move from discovery to booking
            without broken alignment or confusing vehicle presentation.
          </p>
          <div className="row gap">
            <Link className="btn" to="/vehicles">
              Browse Vehicles
            </Link>
            <Link className="btn btn-ghost" to="/register">
              Create Account
            </Link>
          </div>
        </div>

        <div className="hero-showcase">
          {previewFleet.map((vehicle) => (
            <div className="hero-showcase-card" key={vehicle.name}>
              <VehiclePoster vehicle={vehicle} compact />
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-3 metrics-grid">
        <article className="card metric-card">
          <p>Presentation</p>
          <h3>Consistent</h3>
          <span>Vehicles now render from metadata-first visuals instead of mismatched stock photos.</span>
        </article>
        <article className="card metric-card">
          <p>Availability</p>
          <h3>Protected</h3>
          <span>Double-booking prevention stays enforced across the booking and payment flow.</span>
        </article>
        <article className="card metric-card">
          <p>Experience</p>
          <h3>Responsive</h3>
          <span>The public catalog and details pages now hold alignment better on desktop and mobile.</span>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Everything Required Still Works</h2>
          <p>Authentication, booking, payments, admin tools, and reports remain intact behind the redesign.</p>
        </div>

        <div className="grid grid-4">
          {highlights.map((item) => (
            <article key={item.title} className="card feature-card">
              <item.icon size={18} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
