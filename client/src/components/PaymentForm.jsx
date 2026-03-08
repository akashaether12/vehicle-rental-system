import { useState } from "react";
import toast from "react-hot-toast";
import api, { getApiError } from "../api/http";

export default function PaymentForm({ booking, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    method: "card",
    cardNumber: "",
    cardHolderName: "",
    upiId: "",
  });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        bookingId: booking._id,
        method: form.method,
      };

      if (form.method === "card") {
        payload.cardNumber = form.cardNumber;
        payload.cardHolderName = form.cardHolderName;
      }

      if (form.method === "upi") {
        payload.upiId = form.upiId;
      }

      const response = await api.post("/payments/process", payload);
      toast.success("Payment completed. Booking confirmed.");
      onSuccess?.(response.data);
    } catch (error) {
      toast.error(getApiError(error, "Payment failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card payment-form" onSubmit={handleSubmit}>
      <div className="section-head">
        <h3>Complete Payment</h3>
        <p>
          Total: <strong>INR {booking.totalPrice}</strong>
        </p>
      </div>

      <label>
        Payment Method
        <select name="method" value={form.method} onChange={updateField}>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="netbanking">Net Banking</option>
          <option value="cash">Cash</option>
        </select>
      </label>

      {form.method === "card" && (
        <>
          <label>
            Card Number
            <input
              name="cardNumber"
              placeholder="4111111111111111"
              value={form.cardNumber}
              onChange={updateField}
              required
            />
          </label>
          <label>
            Card Holder Name
            <input
              name="cardHolderName"
              placeholder="Card holder name"
              value={form.cardHolderName}
              onChange={updateField}
              required
            />
          </label>
          <p className="hint">Simulation rule: card numbers ending with 0 fail.</p>
        </>
      )}

      {form.method === "upi" && (
        <label>
          UPI ID
          <input name="upiId" placeholder="name@upi" value={form.upiId} onChange={updateField} required />
        </label>
      )}

      <div className="row gap">
        <button className="btn btn-full" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {onCancel && (
          <button className="btn btn-ghost btn-full" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
