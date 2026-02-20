import { useEffect, useState } from "react";
import {
  PlusCircle,
  Edit2,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function TaskForm({ initialTask, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setError("");
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (title.trim().length < 3) {
      setError("Task title must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSave({
        ...initialTask,
        title: title.trim(),
        completed: initialTask?.completed ?? false,
      });

      if (!initialTask) {
        setTitle(""); // Only clear for new tasks
      }
    } catch (err) {
      setError("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setError("");
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && initialTask) {
      handleCancel();
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            {initialTask ? (
              <Edit2 size={18} color="#9ca3af" style={styles.inputIcon} />
            ) : (
              <PlusCircle size={18} color="#9ca3af" style={styles.inputIcon} />
            )}

            <input
              style={{
                ...styles.input,
                ...(error ? styles.inputError : {}),
              }}
              type="text"
              placeholder={
                initialTask ? "Update task title..." : "Enter task title..."
              }
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              autoFocus={!!initialTask}
              maxLength={100}
            />

            {title && (
              <button
                type="button"
                style={styles.clearButton}
                onClick={() => {
                  setTitle("");
                  setError("");
                }}
                aria-label="Clear input"
              >
                <XCircle size={16} color="#9ca3af" />
              </button>
            )}
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <AlertCircle size={14} color="#dc2626" />
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <div style={styles.charCount}>
            <span
              style={{
                ...styles.charCountText,
                color: title.length > 90 ? "#dc2626" : "#9ca3af",
              }}
            >
              {title.length}/100
            </span>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isSubmitting ? styles.buttonDisabled : {}),
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner} />
                {initialTask ? "Updating..." : "Adding..."}
              </span>
            ) : (
              <span style={styles.buttonContent}>
                {initialTask ? (
                  <>
                    <CheckCircle size={18} />
                    Update
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    Add Task
                  </>
                )}
              </span>
            )}
          </button>

          {initialTask && (
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <XCircle size={18} />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },

  form: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",

    // Responsive breakpoint
    "@media (maxWidth: 640px)": {
      flexDirection: "column",
      width: "100%",
    },
  },

  inputWrapper: {
    flex: 1,
    minWidth: "250px",
    position: "relative",
  },

  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },

  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    zIndex: 1,
  },

  input: {
    width: "100%",
    padding: "14px 16px 14px 40px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "white",
    fontFamily: "system-ui, -apple-system, sans-serif",

    // Hover state
    ":hover": {
      borderColor: "#d1d5db",
    },

    // Focus state
    ":focus": {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },

    // Disabled state
    ":disabled": {
      backgroundColor: "#f3f4f6",
      cursor: "not-allowed",
      opacity: 0.7,
    },

    // Placeholder
    "::placeholder": {
      color: "#9ca3af",
      fontSize: "14px",
    },
  },

  inputError: {
    borderColor: "#dc2626",
    ":focus": {
      borderColor: "#dc2626",
      boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
    },
  },

  clearButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    transition: "background-color 0.2s",

    ":hover": {
      backgroundColor: "#f3f4f6",
    },
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "6px",
    paddingLeft: "12px",
  },

  errorText: {
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "500",
  },

  charCount: {
    position: "absolute",
    right: "12px",
    bottom: "-20px",
    fontSize: "11px",
  },

  charCountText: {
    transition: "color 0.2s",
  },

  buttonGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",

    "@media (maxWidth: 640px)": {
      width: "100%",
    },
  },

  submitButton: {
    padding: "14px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
    minWidth: "120px",

    // Hover state
    ":hover:not(:disabled)": {
      backgroundColor: "#4338ca",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)",
    },

    // Active state
    ":active:not(:disabled)": {
      transform: "translateY(0)",
      boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
    },

    "@media (maxWidth: 640px)": {
      width: "100%",
    },
  },

  cancelButton: {
    padding: "14px 24px",
    backgroundColor: "white",
    color: "#4b5563",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",

    // Hover state
    ":hover:not(:disabled)": {
      backgroundColor: "#f9fafb",
      borderColor: "#d1d5db",
      color: "#111827",
    },

    "@media (maxWidth: 640px)": {
      width: "100%",
    },
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    pointerEvents: "none",
  },

  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  // Spinner animation
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

// Add global styles for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Hover effects using className instead of inline styles */
  .task-form-input:hover {
    border-color: #d1d5db !important;
  }
  
  .task-form-input:focus {
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }
  
  .task-form-submit:hover:not(:disabled) {
    background-color: #4338ca !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3) !important;
  }
  
  .task-form-cancel:hover:not(:disabled) {
    background-color: #f9fafb !important;
    border-color: #d1d5db !important;
    color: #111827 !important;
  }
  
  .clear-button:hover {
    background-color: #f3f4f6 !important;
  }
`;
document.head.appendChild(style);
