import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <h2 style={styles.logo}>My SaaS</h2>

      <div style={styles.links}>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/projects")}>Projects</button>

        {user?.role === "tenant_admin" && (
          <button onClick={() => navigate("/users")}>Users</button>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#111",
    color: "white",
  },
  logo: { margin: 0 },
  links: { display: "flex", gap: "10px" },
};

export default Navbar;
