import { useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/payments/my");
        setPayments(response.data.payments || []);
      } catch (error) {
        toast.error(getApiError(error, "Failed to load payment history."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <LoadingScreen label="Loading payments..." />;

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>Payment History</h1>
        <p>Track successful, failed, and refunded transactions.</p>
      </section>

      {payments.length === 0 ? (
        <div className="state-card">No payments found.</div>
      ) : (
        <section className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{dayjs(payment.createdAt).format("DD MMM YYYY HH:mm")}</td>
                  <td>
                    {payment.vehicle?.brand} {payment.vehicle?.model}
                  </td>
                  <td>INR {payment.amount}</td>
                  <td>{payment.method}</td>
                  <td>{payment.status}</td>
                  <td>{payment.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
