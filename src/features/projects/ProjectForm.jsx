import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveProject } from "../../redux/slices/projectsSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  FolderKanban,
  Save,
  XCircle,
  User,
  FileText,
  AlertCircle,
  ChevronLeft,
  Edit3,
  PlusCircle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

export default function ProjectForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector((state) => state.projects.list);
  const loading = useSelector((state) => state.projects.loading);

  const existingProject = projects.find((p) => p.id === id);

  const [form, setForm] = useState({
    name: "",
    owner: "",
    status: "active",
    description: "",
    progress: 0,
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (existingProject) {
      setForm(existingProject);
    }
  }, [existingProject]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Project name is required";
    else if (form.name.length < 3)
      errs.name = "Project name must be at least 3 characters";
    else if (form.name.length > 100)
      errs.name = "Project name must be less than 100 characters";

    if (!form.owner.trim()) errs.owner = "Project owner is required";

    if (form.startDate && form.endDate) {
      if (new Date(form.startDate) > new Date(form.endDate)) {
        errs.endDate = "End date must be after start date";
      }
    }

    if (form.progress < 0 || form.progress > 100) {
      errs.progress = "Progress must be between 0 and 100";
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const validationErrors = validate();
    if (validationErrors[field]) {
      setErrors({ ...errors, [field]: validationErrors[field] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(form).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      );
      setTouched(allTouched);
      return;
    }

    try {
      await dispatch(saveProject(form));
      navigate("/projects");
    } catch (error) {
      setErrors({ submit: "Failed to save project. Please try again." });
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Activity size={18} color="#16a34a" />;
      case "completed":
        return <CheckCircle size={18} color="#9333ea" />;
      case "pending":
        return <Clock size={18} color="#d97706" />;
      default:
        return <Clock size={18} color="#6b7280" />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate("/projects")} style={styles.backButton}>
          <ChevronLeft size={20} />
          Back to Projects
        </button>

        <div style={styles.headerContent}>
          <div style={styles.iconContainer}>
            {id ? (
              <Edit3 size={32} color="#4f46e5" />
            ) : (
              <PlusCircle size={32} color="#4f46e5" />
            )}
          </div>
          <div>
            <h1 style={styles.title}>
              {id ? "Edit Project" : "Create New Project"}
            </h1>
            <p style={styles.subtitle}>
              {id
                ? "Update your project details below"
                : "Fill in the details to create a new project"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={styles.formCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Project Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <FolderKanban size={16} color="#4b5563" />
              Project Name <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                name="name"
                style={{
                  ...styles.input,
                  ...(touched.name && errors.name ? styles.inputError : {}),
                }}
                type="text"
                placeholder="e.g., Website Redesign"
                value={form.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                disabled={loading}
              />
              {touched.name && errors.name && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={14} color="#dc2626" />
                  <span style={styles.errorText}>{errors.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Owner */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <User size={16} color="#4b5563" />
              Project Owner <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                name="owner"
                style={{
                  ...styles.input,
                  ...(touched.owner && errors.owner ? styles.inputError : {}),
                }}
                type="text"
                placeholder="e.g., John Doe"
                value={form.owner}
                onChange={handleChange}
                onBlur={() => handleBlur("owner")}
                disabled={loading}
              />
              {touched.owner && errors.owner && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={14} color="#dc2626" />
                  <span style={styles.errorText}>{errors.owner}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status and Progress Row */}
          <div style={styles.rowFields}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Status</label>
              <div style={styles.selectWrapper}>
                <select
                  name="status"
                  style={styles.select}
                  value={form.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                {/* <div style={styles.statusIcon}>
                  {getStatusIcon(form.status)}
                </div> */}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Progress (%)</label>
              <input
                name="progress"
                style={styles.input}
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                value={form.progress}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Dates Row */}
          <div style={styles.rowFields}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Start Date</label>
              <input
                name="startDate"
                style={styles.input}
                type="date"
                value={form.startDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>End Date</label>
              <input
                name="endDate"
                style={{
                  ...styles.input,
                  ...(touched.endDate && errors.endDate
                    ? styles.inputError
                    : {}),
                }}
                type="date"
                value={form.endDate}
                onChange={handleChange}
                onBlur={() => handleBlur("endDate")}
                disabled={loading}
              />
              {touched.endDate && errors.endDate && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={14} color="#dc2626" />
                  <span style={styles.errorText}>{errors.endDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <FileText size={16} color="#4b5563" />
              Description
            </label>
            <textarea
              name="description"
              style={styles.textarea}
              placeholder="Describe your project..."
              value={form.description}
              onChange={handleChange}
              rows="4"
              disabled={loading}
            />
          </div>

          {/* Error Summary */}
          {errors.submit && (
            <div style={styles.errorSummary}>
              <AlertCircle size={20} color="#dc2626" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
              disabled={loading}
            >
              <XCircle size={18} />
              Cancel
            </button>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(loading ? styles.buttonDisabled : {}),
              }}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.buttonContent}>
                  <span style={styles.spinner} />
                  Saving...
                </span>
              ) : (
                <span style={styles.buttonContent}>
                  <Save size={18} />
                  {id ? "Update Project" : "Create Project"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  header: {
    marginBottom: "24px",
  },

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
    marginBottom: "16px",
    transition: "background-color 0.2s",

    ":hover": {
      backgroundColor: "#f3f4f6",
    },
  },

  headerContent: {
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

  title: {
    margin: 0,
    fontSize: "clamp(24px, 5vw, 32px)",
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    margin: "4px 0 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  formCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },

  rowFields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",

    "@media (maxWidth: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },

  required: {
    color: "#dc2626",
    fontSize: "14px",
  },

  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "white",

    ":focus": {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },

    ":hover:not(:disabled)": {
      borderColor: "#d1d5db",
    },

    ":disabled": {
      backgroundColor: "#f3f4f6",
      cursor: "not-allowed",
    },
  },

  inputError: {
    borderColor: "#dc2626",
    ":focus": {
      borderColor: "#dc2626",
      boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
    },
  },

  selectWrapper: {
    position: "relative",
  },

  select: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",

    ":focus": {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },

  statusIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "inherit",

    ":focus": {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "4px",
  },

  errorText: {
    color: "#dc2626",
    fontSize: "13px",
  },

  errorSummary: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "8px",
    color: "#dc2626",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "16px",

    "@media (maxWidth: 640px)": {
      flexDirection: "column-reverse",
    },
  },

  submitButton: {
    padding: "12px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
    minWidth: "160px",

    ":hover:not(:disabled)": {
      backgroundColor: "#4338ca",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)",
    },

    "@media (maxWidth: 640px)": {
      width: "100%",
    },
  },

  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "white",
    color: "#4b5563",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",

    ":hover:not(:disabled)": {
      backgroundColor: "#f9fafb",
      borderColor: "#d1d5db",
    },

    "@media (maxWidth: 640px)": {
      width: "100%",
    },
  },

  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "white",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
};

// Add global styles
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    opacity: 1;
    height: 20px;
  }
`;
document.head.appendChild(style);
