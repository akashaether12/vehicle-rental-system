import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getApiError } from "../api/http";
import VehicleCard from "../components/VehicleCard";
import LoadingScreen from "../components/LoadingScreen";

const defaultFilters = {
  search: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  startDate: "",
  endDate: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function VehiclesPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async (activeFilters = defaultFilters) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== "") params[key] = value;
      });

      const response = await api.get("/vehicles", { params });
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      toast.error(getApiError(error, "Failed to load vehicles."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(defaultFilters);
  }, [fetchVehicles]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchVehicles(filters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    fetchVehicles(defaultFilters);
  };

  return (
    <div className="stack-lg">
      <section className="section">
        <div className="section-head">
          <h1>Browse Vehicles</h1>
          <p>Search by vehicle type, budget, and date availability.</p>
        </div>

        <form className="card filter-form" onSubmit={handleSearch}>
          <div className="grid grid-6">
            <input
              name="search"
              placeholder="Search by brand/model/location"
              value={filters.search}
              onChange={handleChange}
            />
            <select name="type" value={filters.type} onChange={handleChange}>
              <option value="">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="luxury">Luxury</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="bike">Bike</option>
              <option value="ev">EV</option>
            </select>
            <input
              name="minPrice"
              type="number"
              min="0"
              placeholder="Min price/day"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <input
              name="maxPrice"
              type="number"
              min="0"
              placeholder="Max price/day"
              value={filters.maxPrice}
              onChange={handleChange}
            />
            <input name="startDate" type="date" value={filters.startDate} onChange={handleChange} />
            <input name="endDate" type="date" value={filters.endDate} onChange={handleChange} />
            <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
              <option value="createdAt">Newest</option>
              <option value="pricePerDay">Price</option>
              <option value="year">Year</option>
            </select>
            <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="row gap">
            <button className="btn btn-small" type="submit">
              Search
            </button>
            <button className="btn btn-ghost btn-small" type="button" onClick={clearFilters}>
              Reset
            </button>
          </div>
        </form>
      </section>

      {loading ? (
        <LoadingScreen label="Loading vehicles..." />
      ) : vehicles.length === 0 ? (
        <div className="state-card">
          <p>No vehicles match your filters.</p>
        </div>
      ) : (
        <section className="grid grid-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </section>
      )}
    </div>
  );
}
