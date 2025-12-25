import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://backend:5000/api";

export default function AddUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const submit = async () => {
    try {
      const me = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const tenantId = me.data.data.tenant.id;

      await axios.post(
        `${API}/tenants/${tenantId}/users`,
        { fullName, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/users");
    } catch {
      alert("Failed to add user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add User</h2>
      <input placeholder="Full Name" onChange={e => setFullName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <select onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="tenant_admin">Tenant Admin</option>
      </select>
      <button onClick={submit}>Create</button>
    </div>
  );
}
