import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";

const initialForm = {
  name: "",
  brand: "",
  model: "",
  type: "sedan",
  year: "",
  seats: "4",
  transmission: "automatic",
  fuelType: "petrol",
  location: "",
  pricePerDay: "",
  images: "",
  description: "",
  isActive: true,
};

export default function ManageVehiclesPage() {
  const [form, setForm] = useState(initialForm);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vehicles", {
        params: { includeInactive: true, limit: 200 },
      });
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      toast.error(getApiError(error, "Failed to load vehicles."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const submitVehicle = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      year: form.year ? Number(form.year) : undefined,
      seats: Number(form.seats),
      pricePerDay: Number(form.pricePerDay),
      images: form.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
        toast.success("Vehicle updated.");
      } else {
        await api.post("/vehicles", payload);
        toast.success("Vehicle added.");
      }

      resetForm();
      fetchVehicles();
    } catch (error) {
      toast.error(getApiError(error, "Failed to save vehicle."));
    } finally {
      setSaving(false);
    }
  };

  const editVehicle = (vehicle) => {
    setEditingId(vehicle._id);
    setForm({
      name: vehicle.name || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      type: vehicle.type || "sedan",
      year: vehicle.year ? String(vehicle.year) : "",
      seats: vehicle.seats ? String(vehicle.seats) : "4",
      transmission: vehicle.transmission || "automatic",
      fuelType: vehicle.fuelType || "petrol",
      location: vehicle.location || "",
      pricePerDay: vehicle.pricePerDay ? String(vehicle.pricePerDay) : "",
      images: vehicle.images?.join(", ") || "",
      description: vehicle.description || "",
      isActive: vehicle.isActive,
    });
  };

  const deleteVehicle = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success("Vehicle marked inactive.");
      fetchVehicles();
    } catch (error) {
      toast.error(getApiError(error, "Failed to delete vehicle."));
    }
  };

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>Manage Vehicles</h1>
        <p>Add, edit, and soft-delete vehicles in the fleet.</p>
      </section>

      <form className="card stack" onSubmit={submitVehicle}>
        <h2>{editingId ? "Edit Vehicle" : "Add Vehicle"}</h2>
        <div className="grid grid-3">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Brand
            <input name="brand" value={form.brand} onChange={handleChange} required />
          </label>
          <label>
            Model
            <input name="model" value={form.model} onChange={handleChange} required />
          </label>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="luxury">Luxury</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="bike">Bike</option>
              <option value="ev">EV</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Year
            <input type="number" name="year" value={form.year} onChange={handleChange} />
          </label>
          <label>
            Seats
            <input type="number" name="seats" min="1" value={form.seats} onChange={handleChange} required />
          </label>
          <label>
            Transmission
            <select name="transmission" value={form.transmission} onChange={handleChange}>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </label>
          <label>
            Fuel Type
            <select name="fuelType" value={form.fuelType} onChange={handleChange}>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="cng">CNG</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Location
            <input name="location" value={form.location} onChange={handleChange} required />
          </label>
          <label>
            Price Per Day (INR)
            <input
              type="number"
              name="pricePerDay"
              min="1"
              value={form.pricePerDay}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          Images (comma-separated URLs)
          <input name="images" value={form.images} onChange={handleChange} />
        </label>

        <label>
          Description
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
        </label>

        <label className="checkbox">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          Active
        </label>

        <div className="row gap">
          <button className="btn btn-small" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Vehicle" : "Add Vehicle"}
          </button>
          {editingId && (
            <button className="btn btn-small btn-ghost" type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <LoadingScreen label="Loading vehicles..." />
      ) : (
        <section className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price/day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>
                    {vehicle.brand} {vehicle.model}
                  </td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.location}</td>
                  <td>INR {vehicle.pricePerDay}</td>
                  <td>{vehicle.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="row gap">
                      <button className="btn btn-small btn-ghost" type="button" onClick={() => editVehicle(vehicle)}>
                        Edit
                      </button>
                      <button className="btn btn-small btn-danger" type="button" onClick={() => deleteVehicle(vehicle._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
