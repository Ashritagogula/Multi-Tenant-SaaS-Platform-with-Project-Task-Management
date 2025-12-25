import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://backend:5000/api";

export default function EditUser() {
  const { id } = useParams();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user");
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setFullName(res.data.data.fullName);
        setRole(res.data.data.role);
        setIsActive(res.data.data.isActive);
      });
  }, []);

  const update = async () => {
    await axios.put(
      `${API}/users/${id}`,
      { fullName, role, isActive },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate("/users");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit User</h2>
      <input value={fullName} onChange={e => setFullName(e.target.value)} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="tenant_admin">Tenant Admin</option>
      </select>
      <select value={isActive} onChange={e => setIsActive(e.target.value === "true")}>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
      <button onClick={update}>Save</button>
    </div>
  );
}
