import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://backend:5000/api";

export default function AddEditUserModal({
  isOpen,
  onClose,
  mode,
  userData,
  refreshUsers
}) {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "user",
    isActive: true
  });

  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // ✅ SAFE EFFECT — NO WARNING
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && userData) {
      setForm({
        email: userData.email || "",
        fullName: userData.fullName || "",
        password: "",
        role: userData.role || "user",
        isActive: userData.isActive ?? true
      });
    }

    if (mode === "add") {
      setForm({
        email: "",
        fullName: "",
        password: "",
        role: "user",
        isActive: true
      });
    }
  }, [isOpen, mode]); // ❗ no userData dependency

  if (!isOpen) return null;

  const validate = () => {
    if (!form.email || !form.fullName) {
      setError("Email and Full Name are required");
      return false;
    }
    if (mode === "add" && !form.password) {
      setError("Password is required");
      return false;
    }
    setError("");
    return true;
  };

  const save = async () => {
    if (!validate()) return;

    try {
      if (mode === "add") {
        const me = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const tenantId = me.data.data.tenant.id;

        await axios.post(
          `${API}/tenants/${tenantId}/users`,
          {
            email: form.email,
            fullName: form.fullName,
            password: form.password,
            role: form.role
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.put(
          `${API}/users/${userData.id}`,
          {
            fullName: form.fullName,
            role: form.role,
            isActive: form.isActive,
            ...(form.password && { password: form.password })
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      refreshUsers();
      onClose();
    } catch {
      setError("Operation failed");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{mode === "add" ? "Add User" : "Edit User"}</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          placeholder="Email"
          value={form.email}
          disabled={mode === "edit"}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          type="password"
          placeholder={mode === "add" ? "Password" : "New Password (optional)"}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>

        {mode === "edit" && (
          <label>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            Active
          </label>
        )}

        <div style={{ marginTop: "10px" }}>
          <button onClick={save}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modal = {
  background: "#fff",
  padding: "20px",
  width: "320px"
};
