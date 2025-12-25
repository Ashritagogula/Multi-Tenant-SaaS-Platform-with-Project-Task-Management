import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectDetails.css";
import AddTaskModal from "../components/AddTaskModal";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // Fetch project details
  const fetchProject = async () => {
    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setProject(data.data);
  };

  const fetchTasks = async () => {
  const res = await fetch(
    `http://localhost:5000/api/projects/${projectId}/tasks`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  setTasks(data.data || []);
};


  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchProject();
        await fetchTasks();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId]);

  // EDIT TASK
  const handleEditTask = async (taskId, oldTitle) => {
    const newTitle = prompt("Edit task title", oldTitle);
    if (!newTitle) return;

    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });

    fetchTasks();
  };

  // CHANGE STATUS
  const handleChangeStatus = async (taskId, currentStatus) => {
    const nextStatus =
      currentStatus === "todo"
        ? "in_progress"
        : currentStatus === "in_progress"
        ? "completed"
        : "todo";

    await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    fetchTasks();
  };

  // DELETE TASK
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  };

  if (loading) return <p className="info-text">Loading project...</p>;
  if (!project) return <p className="info-text">Project not found</p>;

  return (
    <div className="project-details-page">
      {/* Header */}
      <div className="project-header">
        <div>
          <h2>{project.name}</h2>
          <span className={`status-badge ${project.status}`}>
            {project.status}
          </span>
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate("/projects")}
        >
          ← Back to Projects
        </button>
      </div>

      <p className="project-description">
        {project.description || "No description"}
      </p>

      {/* Tasks Section */}
      <div className="tasks-header">
        <h3>Tasks</h3>
        <button
          className="btn-primary"
          onClick={() => setShowAddTask(true)}
        >
          + Add Task
        </button>
      </div>

      {showAddTask && (
        <AddTaskModal
          projectId={projectId}
          onClose={() => setShowAddTask(false)}
          onTaskCreated={fetchTasks}
        />
      )}

      {tasks.length === 0 && (
        <p className="info-text">No tasks created yet</p>
      )}

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-top">
              <h4>{task.title}</h4>
              <span className={`status-badge ${task.status}`}>
                {task.status}
              </span>
            </div>

            <div className="task-meta">
              <span className={`priority ${task.priority}`}>
                {task.priority}
              </span>
              <span>
                Assigned: {task.assignedTo?.fullName || "Unassigned"}
              </span>
              <span>
                Due: {task.dueDate || "—"}
              </span>
            </div>

            <div className="task-actions">
              <button
                className="btn-warning"
                onClick={() => handleEditTask(task.id, task.title)}
              >
                Edit
              </button>

              <button
                className="btn-secondary"
                onClick={() =>
                  handleChangeStatus(task.id, task.status)
                }
              >
                Change Status
              </button>

              <button
                className="btn-danger"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
