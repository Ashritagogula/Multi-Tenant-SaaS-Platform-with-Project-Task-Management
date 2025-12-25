import { useState } from "react";

const ProjectModal = ({ close, refresh, editProject }) => {
  const token = localStorage.getItem("token");

  const [name, setName] = useState(editProject?.name || "");
  const [description, setDescription] = useState(
    editProject?.description || ""
  );
  const [status, setStatus] = useState(editProject?.status || "active");

  const saveProject = async () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    const url = editProject
      ? `http://localhost:5000/api/projects/${editProject.id}`
      : "http://localhost:5000/api/projects";

    const method = editProject ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, status }),
    });

    refresh();
    close();
  };

  return (
    <div style={{ border: "1px solid black", padding: "20px" }}>
      <h3>{editProject ? "Edit Project" : "Create Project"}</h3>

      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
        <option value="completed">Completed</option>
      </select>

      <br /><br />

      <button onClick={saveProject}>Save</button>
      <button onClick={close}>Cancel</button>
    </div>
  );
};

export default ProjectModal;
