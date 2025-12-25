import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const projectsRes = await axios.get(`${API_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const projects = projectsRes.data.data.projects || [];

        let totalTasks = 0;
        let completed = 0;

        projects.forEach((p) => {
          totalTasks += p.taskCount || 0;
          completed += p.completedTaskCount || 0;
        });

        setStats({
          projects: projects.length,
          tasks: totalTasks,
          completed,
          pending: totalTasks - completed,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchStats();
  }, []); // ✅ runs only once

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>

        <div style={styles.cards}>
          <Card title="Total Projects" value={stats.projects} />
          <Card title="Total Tasks" value={stats.tasks} />
          <Card title="Completed Tasks" value={stats.completed} />
          <Card title="Pending Tasks" value={stats.pending} />
        </div>
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

const styles = {
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    background: "#1a1a1a",
    color: "white",
    borderRadius: "10px",
  },
};

export default Dashboard;
