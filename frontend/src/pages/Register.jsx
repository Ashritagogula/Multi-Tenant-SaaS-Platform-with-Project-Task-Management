import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

// IMPORTANT: VITE_API_URL must be http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organizationName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔍 Frontend validations
    if (
      !form.organizationName ||
      !form.subdomain ||
      !form.adminEmail ||
      !form.adminFullName ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.terms) {
      setError("Please accept Terms & Conditions");
      return;
    }

    try {
      setLoading(true);

      // ✅ CORRECT API CALL (matches backend)
      await axios.post(`${API_URL}/tenants`, {
        tenantName: form.organizationName,
        subdomain: form.subdomain,
        email: form.adminEmail,
        password: form.password,
        fullName: form.adminFullName,
      });

      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Create your workspace</h1>
        <p className="subtitle">Start your SaaS journey in seconds</p>

        <form onSubmit={handleSubmit}>
          <input
            name="organizationName"
            placeholder="Organization name"
            value={form.organizationName}
            onChange={handleChange}
          />

          <div className="subdomain-box">
            <input
              name="subdomain"
              placeholder="Subdomain"
              value={form.subdomain}
              onChange={handleChange}
            />
            <span>.yourapp.com</span>
          </div>

          <input
            type="email"
            name="adminEmail"
            placeholder="Admin email"
            value={form.adminEmail}
            onChange={handleChange}
          />

          <input
            name="adminFullName"
            placeholder="Admin full name"
            value={form.adminFullName}
            onChange={handleChange}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <label className="checkbox">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <span>I agree to the Terms & Conditions</span>
          </label>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <p className="footer-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
