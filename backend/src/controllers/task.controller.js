/*
====================================
API 16: Create Task (SAFE PLACEHOLDER)
POST /api/projects/:projectId/tasks
====================================
*/
export const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, priority, dueDate } = req.body;
  const { tenantId } = req.user;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Task title is required",
    });
  }

  // 🔒 HARD BLOCK cross-tenant access (SAFE DEFAULT)
  // Any projectId not belonging to current tenant is rejected
  // (Since DB models are not ready yet)

  if (!projectId.startsWith(tenantId)) {
    return res.status(403).json({
      success: false,
      message: "Project does not belong to your tenant",
    });
  }

  // ✅ Temporary success for SAME tenant only
  return res.status(201).json({
    success: true,
    data: {
      id: "task-uuid-placeholder",
      projectId,
      tenantId,
      title,
      description: description || null,
      status: "todo",
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    },
  });
};
