import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CarFront, LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";
import useAuth from "../hooks/useAuth";

const navClass = ({ isActive }) => clsx("nav-link", isActive && "nav-link-active");

export default function Layout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { to: "/", label: "Home" },
        { to: "/vehicles", label: "Vehicles" },
      ];
    }

    if (user.role === "admin") {
      return [
        { to: "/admin", label: "Admin Dashboard" },
        { to: "/admin/vehicles", label: "Manage Vehicles" },
        { to: "/admin/bookings", label: "All Bookings" },
        { to: "/admin/users", label: "Manage Users" },
        { to: "/admin/reports", label: "Reports" },
        { to: "/profile", label: "Profile" },
      ];
    }

    return [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/vehicles", label: "Browse Vehicles" },
      { to: "/my-bookings", label: "My Bookings" },
      { to: "/payments", label: "Make Payment" },
      { to: "/profile", label: "Profile" },
    ];
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <CarFront size={20} />
            <span>Velocity Rentals</span>
          </Link>

          <button className="menu-button" onClick={() => setOpen((prev) => !prev)} type="button">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className={clsx("site-nav", open && "site-nav-open")}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}

            {!isAuthenticated && (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/admin/login" className={navClass} onClick={() => setOpen(false)}>
                  Admin Login
                </NavLink>
                <NavLink to="/register" className="btn btn-small" onClick={() => setOpen(false)}>
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <button className="btn btn-ghost btn-small" type="button" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="container main-content">{children}</main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>Secure bookings, role-based management, and real-time availability checks.</p>
        </div>
      </footer>
    </div>
  );
}
