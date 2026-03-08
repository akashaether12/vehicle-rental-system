import { Link } from "react-router-dom";
import { CalendarCheck, Car, CreditCard, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: Car,
    title: "Wide Vehicle Catalog",
    description: "Sedans, SUVs, EVs, bikes, and premium cars with transparent daily pricing.",
  },
  {
    icon: CalendarCheck,
    title: "Accurate Availability",
    description: "Date-range availability checks prevent double-booking with payment hold windows.",
  },
  {
    icon: CreditCard,
    title: "Fast Payment Simulation",
    description: "Card, UPI, net banking, and cash simulation with payment history tracking.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Security",
    description: "JWT auth for customers/admins, protected routes, and complete booking controls.",
  },
];

export default function HomePage() {
  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Project 13 • Vehicle Rental System</span>
          <h1>Book the right ride in minutes.</h1>
          <p>
            Browse available vehicles, reserve for exact dates, pay securely, and manage everything from one
            responsive dashboard.
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
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Everything Required Is Built-In</h2>
          <p>Authentication, booking, payments, admin tools, and reporting in one platform.</p>
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
