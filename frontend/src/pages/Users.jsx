import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://backend:5000/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const me = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (me.data.data.role !== "tenant_admin") {
        navigate("/dashboard");
        return;
      }

      const tenantId = me.data.data.tenant.id;

      const res = await axios.get(
        `${API}/tenants/${tenantId}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, role }
        }
      );

      setUsers(res.data.data.users);
    } catch (error) {
      alert("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch {
      alert("Cannot delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All</option>
          <option value="tenant_admin">Tenant Admin</option>
          <option value="user">User</option>
        </select>

        <button onClick={() => navigate("/users/add")}>Add User</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Active" : "Inactive"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => navigate(`/users/edit/${u.id}`)}>
                    Edit
                  </button>
                  <button onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
