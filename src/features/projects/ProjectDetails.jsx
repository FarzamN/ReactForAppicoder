import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveTask, toggleTask } from "../../redux/slices/projectsSlice";
import TaskForm from "./TaskForm";
import { useState } from "react";
import {
  FolderKanban,
  User,
  Clock,
  CheckCircle,
  Activity,
  Edit3,
  ArrowLeft,
  CheckSquare,
  Square,
  Calendar,
  FileText,
  BarChart3,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) =>
    state.projects.list.find((p) => p.id === id),
  );

  const [editingTask, setEditingTask] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleSaveTask = (task) => {
    console.log({ projectId: project.id, task });
    dispatch(saveTask({ projectId: project.id, task }));

    setEditingTask(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Activity size={16} color="#16a34a" />;
      case "completed":
        return <CheckCircle size={16} color="#9333ea" />;
      case "pending":
        return <Clock size={16} color="#d97706" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 8px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "capitalize",
    };

    const statusStyles = {
      active: {
        ...baseStyle,
        backgroundColor: "#dcfce7",
        color: "#166534",
      },
      completed: {
        ...baseStyle,
        backgroundColor: "#f3e8ff",
        color: "#6b21a8",
      },
      pending: {
        ...baseStyle,
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },
    };

    return statusStyles[status] || statusStyles.pending;
  };

  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completed = project.tasks.filter((t) => t.completed).length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  const progress = calculateProgress();

  const activeTasks = project.tasks?.filter((t) => !t.completed) || [];
  const completedTasks = project.tasks?.filter((t) => t.completed) || [];

  if (!project) {
    return (
      <div style={styles.notFound}>
        <AlertCircle size={64} color="#9ca3af" />
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/projects" style={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <Link to="/projects" style={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer}>
            <FolderKanban size={32} color="#4f46e5" />
          </div>
          <div style={styles.headerInfo}>
            <h1 style={styles.title}>{project.name}</h1>
            <div style={styles.metaContainer}>
              <span style={styles.metaItem}>
                <User size={14} color="#6b7280" />
                {project.owner}
              </span>
              <span style={getStatusStyle(project.status)}>
                {getStatusIcon(project.status)}
                {project.status}
              </span>
            </div>
          </div>
        </div>

        <Link to={`/projects/edit/${project.id}`} style={styles.editButton}>
          <Edit3 size={16} />
          Edit Project
        </Link>
      </div>

      {/* Project Details Grid */}
      <div style={styles.detailsGrid}>
        {/* Description */}
        {project.description && (
          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <FileText size={18} color="#4f46e5" />
              <h3 style={styles.detailTitle}>Description</h3>
            </div>
            <p style={styles.description}>{project.description}</p>
          </div>
        )}

        {/* Progress */}
        <div style={styles.detailCard}>
          <div style={styles.detailHeader}>
            <BarChart3 size={18} color="#4f46e5" />
            <h3 style={styles.detailTitle}>Progress</h3>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Overall Progress</span>
              <span style={styles.progressValue}>{progress}%</span>
            </div>
            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? "#22c55e" : "#4f46e5",
                }}
              />
            </div>
            <div style={styles.taskStats}>
              <span style={styles.taskStat}>
                <CheckCircle size={14} color="#22c55e" />
                {completedTasks.length} Completed
              </span>
              <span style={styles.taskStat}>
                <Clock size={14} color="#d97706" />
                {activeTasks.length} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Dates */}
        {(project.startDate || project.endDate) && (
          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <Calendar size={18} color="#4f46e5" />
              <h3 style={styles.detailTitle}>Timeline</h3>
            </div>
            <div style={styles.dates}>
              {project.startDate && (
                <div style={styles.dateItem}>
                  <span style={styles.dateLabel}>Start:</span>
                  <span style={styles.dateValue}>
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {project.endDate && (
                <div style={styles.dateItem}>
                  <span style={styles.dateLabel}>End:</span>
                  <span style={styles.dateValue}>
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div style={styles.tasksSection}>
        <div style={styles.tasksHeader}>
          <div style={styles.tasksTitle}>
            <CheckSquare size={24} color="#4f46e5" />
            <h2 style={styles.tasksHeading}>Tasks</h2>
          </div>
          <button
            style={styles.filterButton}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "Hide" : "Show"} Completed
          </button>
        </div>

        {/* Task Form */}
        <div style={styles.taskFormContainer}>
          <TaskForm
            initialTask={editingTask}
            onSave={handleSaveTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>

        {/* Tasks Lists */}
        {project.tasks && project.tasks.length > 0 ? (
          <div style={styles.tasksContainer}>
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div style={styles.taskGroup}>
                <h3 style={styles.taskGroupTitle}>
                  Active Tasks ({activeTasks.length})
                </h3>
                <div style={styles.taskList}>
                  {activeTasks.map((task) => (
                    <div key={task.id} style={styles.taskItem}>
                      <div style={styles.taskContent}>
                        <button
                          style={styles.checkbox}
                          onClick={() =>
                            dispatch(
                              toggleTask({
                                projectId: project.id,
                                taskId: task.id,
                              }),
                            )
                          }
                        >
                          <Square size={20} color="#9ca3af" />
                        </button>
                        <span style={styles.taskTitle}>{task.title}</span>
                      </div>
                      <button
                        style={styles.editTaskButton}
                        onClick={() => setEditingTask(task)}
                      >
                        <Edit3 size={16} color="#6b7280" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {showCompleted && completedTasks.length > 0 && (
              <div style={styles.taskGroup}>
                <h3 style={styles.taskGroupTitle}>
                  Completed Tasks ({completedTasks.length})
                </h3>
                <div style={styles.taskList}>
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{ ...styles.taskItem, ...styles.completedTask }}
                    >
                      <div style={styles.taskContent}>
                        <button
                          style={styles.checkbox}
                          onClick={() =>
                            dispatch(
                              toggleTask({
                                projectId: project.id,
                                taskId: task.id,
                              }),
                            )
                          }
                        >
                          <CheckCircle size={20} color="#22c55e" />
                        </button>
                        <span
                          style={{
                            ...styles.taskTitle,
                            ...styles.completedTaskTitle,
                          }}
                        >
                          {task.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.emptyTasks}>
            <CheckSquare size={48} color="#d1d5db" />
            <p style={styles.emptyTasksText}>
              No tasks yet. Add your first task above!
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <Link to={`/projects`} style={styles.quickActionLink}>
          View All Projects
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  // Not Found
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "16px",
    textAlign: "center",
    padding: "24px",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "14px",
    marginTop: "16px",
  },

  // Back Button
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 12px",
    backgroundColor: "transparent",
    border: "none",
    color: "#4b5563",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "24px",
    textDecoration: "none",
    transition: "background-color 0.2s",

    ":hover": {
      backgroundColor: "#f3f4f6",
    },
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  iconContainer: {
    width: "56px",
    height: "56px",
    backgroundColor: "#eef2ff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: "clamp(24px, 5vw, 32px)",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },
  metaContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#4b5563",
    fontSize: "14px",
  },
  editButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",

    ":hover": {
      backgroundColor: "#4338ca",
    },
  },

  // Details Grid
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  detailCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },
  detailHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  detailTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
  },
  description: {
    margin: 0,
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  // Progress
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  progressValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },
  progressBarContainer: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.3s ease",
  },
  taskStats: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  taskStat: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "#4b5563",
  },

  // Dates
  dates: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  dateItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  dateValue: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111827",
  },

  // Tasks Section
  tasksSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },
  tasksHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  tasksTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tasksHeading: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  filterButton: {
    padding: "6px 12px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#4b5563",
    cursor: "pointer",
    transition: "background-color 0.2s",

    ":hover": {
      backgroundColor: "#e5e7eb",
    },
  },
  taskFormContainer: {
    marginBottom: "24px",
  },

  // Tasks
  tasksContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  taskGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskGroupTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s",

    ":hover": {
      borderColor: "#d1d5db",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
  },
  completedTask: {
    backgroundColor: "#f9fafb",
    opacity: 0.8,
  },
  taskContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
  },
  checkbox: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",

    ":hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  taskTitle: {
    fontSize: "14px",
    color: "#111827",
  },
  completedTaskTitle: {
    textDecoration: "line-through",
    color: "#9ca3af",
  },
  editTaskButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    ":hover": {
      backgroundColor: "#f3f4f6",
    },
  },

  // Empty Tasks
  emptyTasks: {
    textAlign: "center",
    padding: "48px 24px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  emptyTasksText: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "12px",
  },

  // Quick Actions
  quickActions: {
    marginTop: "24px",
    textAlign: "center",
  },
  quickActionLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "6px",
    backgroundColor: "#eef2ff",
    transition: "background-color 0.2s",

    ":hover": {
      backgroundColor: "#e0e7ff",
    },
  },
};

// Add global styles for hover effects
const style = document.createElement("style");
style.textContent = `
  .back-button:hover,
  .edit-task-button:hover,
  .checkbox:hover {
    background-color: #f3f4f6 !important;
  }
  
  .edit-button:hover {
    background-color: #4338ca !important;
  }
  
  .filter-button:hover {
    background-color: #e5e7eb !important;
  }
  
  .quick-action-link:hover {
    background-color: #e0e7ff !important;
  }
`;
document.head.appendChild(style);
