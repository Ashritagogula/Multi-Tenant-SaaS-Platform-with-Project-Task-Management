import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "../components/ProjectModal";
import "./Projects.css";

const Projects = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);

      const res = await fetch(
        `http://localhost:5000/api/projects?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setProjects(data?.data?.projects || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, search]);

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProjects();
  };

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="projects-header">
        <h2>Projects</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Create New Project
        </button>
      </div>

      {/* Filters */}
      <div className="projects-filters">
        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="text"
          placeholder="Search projects..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading && <p className="info-text">Loading projects...</p>}

      {!loading && projects.length === 0 && (
        <p className="info-text">No projects found</p>
      )}

      <div className="projects-grid">
        {projects.map((p) => (
          <div key={p.id} className="project-card">
            <div className="project-top">
              <h3>{p.name}</h3>
              <span className={`status-badge ${p.status}`}>
                {p.status}
              </span>
            </div>

            <p className="project-desc">{p.description}</p>

            <div className="project-meta">
              <span>Tasks: {p.taskCount}</span>
              <span>Created by: {p.createdBy?.fullName}</span>
            </div>

            <div className="project-actions">
              <button
                className="btn-secondary"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                View
              </button>
              <button
                className="btn-warning"
                onClick={() => {
                  setEditProject(p);
                  setShowModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn-danger"
                onClick={() => deleteProject(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProjectModal
          close={() => {
            setShowModal(false);
            setEditProject(null);
          }}
          refresh={fetchProjects}
          editProject={editProject}
        />
      )}
    </div>
  );
};

export default Projects;
