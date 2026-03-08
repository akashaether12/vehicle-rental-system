import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { getApiError } from "../../api/http";
import LoadingScreen from "../../components/LoadingScreen";

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (searchQuery = search) => {
    setLoading(true);
    try {
      const response = await api.get("/users", {
        params: { search: searchQuery, limit: 200 },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error(getApiError(error, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateRole = async (userId, role) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      toast.success("Role updated.");
      fetchUsers();
    } catch (error) {
      toast.error(getApiError(error, "Failed to update role."));
    }
  };

  const updateStatus = async (userId, isActive) => {
    try {
      await api.patch(`/users/${userId}/status`, { isActive });
      toast.success("Status updated.");
      fetchUsers();
    } catch (error) {
      toast.error(getApiError(error, "Failed to update status."));
    }
  };

  return (
    <div className="stack-lg">
      <section className="section-head">
        <h1>Manage Users</h1>
        <p>Search users, change roles, and activate/deactivate access.</p>
      </section>

      <section className="card row gap">
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn btn-small" type="button" onClick={() => fetchUsers(search)}>
          Search
        </button>
      </section>

      {loading ? (
        <LoadingScreen label="Loading users..." />
      ) : users.length === 0 ? (
        <div className="state-card">No users found.</div>
      ) : (
        <section className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select value={user.role} onChange={(event) => updateRole(user.id, event.target.value)}>
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={user.isActive}
                        onChange={(event) => updateStatus(user.id, event.target.checked)}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </label>
                  </td>
                  <td>{dayjs(user.createdAt).format("DD MMM YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
