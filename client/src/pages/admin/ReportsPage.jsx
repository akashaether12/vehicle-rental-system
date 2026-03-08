import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/reports/dashboard");
        setReport(response.data);
      } catch (error) {
        toast.error(getApiError(error, "Failed to load reports."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <LoadingScreen label="Loading reports..." />;
  if (!report) return <div className="state-card">No report data.</div>;

  const maxRevenue = Math.max(...report.monthlyRevenue.map((item) => item.total), 1);

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>Reports</h1>
        <p>Revenue and booking performance overview.</p>
      </section>

      <section className="card stack">
        <h2>Monthly Revenue (Last 6 Months)</h2>
        {report.monthlyRevenue.length === 0 ? (
          <p className="muted">No revenue data yet.</p>
        ) : (
          <div className="stack">
            {report.monthlyRevenue.map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(item.total / maxRevenue) * 100}%` }} />
                </div>
                <strong>INR {item.total}</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card table-wrap">
        <table>
          <tbody>
            <tr>
              <th>Total Customers</th>
              <td>{report.totalUsers}</td>
            </tr>
            <tr>
              <th>Active Vehicles</th>
              <td>{report.totalVehicles}</td>
            </tr>
            <tr>
              <th>Confirmed Bookings</th>
              <td>{report.totalBookings}</td>
            </tr>
            <tr>
              <th>Upcoming Bookings</th>
              <td>{report.upcomingBookings}</td>
            </tr>
            <tr>
              <th>Net Revenue</th>
              <td>INR {report.totalRevenue}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
