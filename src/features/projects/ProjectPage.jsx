import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  setSearch,
  setStatusFilter,
} from "../../redux/slices/projectsSlice";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Filter,
  FolderKanban,
  User,
  Clock,
  CheckCircle,
  Activity,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export default function ProjectPage() {
  const dispatch = useDispatch();
  const { list, loading, error, search, statusFilter } = useSelector(
    (state) => state.projects,
  );

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filtered = list.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 size={48} className="spin" color="#4f46e5" />
        <p style={styles.loadingText}>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} color="#dc2626" />
        <p style={styles.errorText}>{error}</p>
        <button
          onClick={() => dispatch(fetchProjects())}
          style={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <FolderKanban size={32} color="#4f46e5" />
          <div>
            <h1 style={styles.title}>Projects</h1>
            <p style={styles.subtitle}>Manage and track all your projects</p>
          </div>
        </div>

        <Link to="/projects/new" style={styles.createButtonLink}>
          <button style={styles.createButton}>
            <PlusCircle size={20} />
            New Project
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchWrapper}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
          {search && (
            <button
              style={styles.clearButton}
              onClick={() => dispatch(setSearch(""))}
            >
              <XCircle size={18} color="#9ca3af" />
            </button>
          )}
        </div>

        <div style={styles.filterWrapper}>
          <Filter size={20} color="#9ca3af" style={styles.filterIcon} />
          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && (
        <div style={styles.summary}>
          <p style={styles.summaryText}>
            Showing <strong>{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "project" : "projects"}
            {statusFilter !== "all" && ` with status "${statusFilter}"`}
            {search && ` matching "${search}"`}
          </p>
        </div>
      )}

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <FolderKanban size={64} color="#d1d5db" />
          <h3 style={styles.emptyStateTitle}>No projects found</h3>
          <p style={styles.emptyStateText}>
            {search || statusFilter !== "all"
              ? "Try adjusting your filters or search terms"
              : "Get started by creating your first project"}
          </p>
          {(search || statusFilter !== "all") && (
            <button
              style={styles.clearFiltersButton}
              onClick={() => {
                dispatch(setSearch(""));
                dispatch(setStatusFilter("all"));
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={styles.projectsGrid}>
          {filtered.map((project) => (
            <Link
              to={`/projects/${project.id}`}
              key={project.id}
              style={styles.projectCardLink}
            >
              <div style={styles.projectCard}>
                <div style={styles.projectCardHeader}>
                  <div style={styles.projectIcon}>
                    <FolderKanban size={24} color="#4f46e5" />
                  </div>
                  <span style={getStatusStyle(project.status)}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </span>
                </div>

                <h3 style={styles.projectName}>{project.name}</h3>

                <div style={styles.projectDetails}>
                  <div style={styles.projectDetail}>
                    <User size={14} color="#6b7280" />
                    <span style={styles.projectDetailText}>
                      {project.owner || "Unassigned"}
                    </span>
                  </div>
                </div>

                <div style={styles.progressSection}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>Progress</span>
                    <span style={styles.progressValue}>
                      {project.progress || 0}%
                    </span>
                  </div>
                  <div style={styles.progressBarContainer}>
                    <div
                      style={{
                        ...styles.progressBarFill,
                        width: `${project.progress || 0}%`,
                        backgroundColor: getProgressColor(project.progress),
                      }}
                    />
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.viewDetails}>
                    View Details <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function for status styles
function getStatusStyle(status) {
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
}

// Helper function for progress bar color
function getProgressColor(progress) {
  if (progress >= 75) return "#22c55e";
  if (progress >= 50) return "#eab308";
  if (progress >= 25) return "#f97316";
  return "#ef4444";
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  // Loading State
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "16px",
  },
  loadingText: {
    color: "#4b5563",
    fontSize: "16px",
    margin: 0,
  },

  // Error State
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "16px",
    textAlign: "center",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "16px",
    margin: 0,
  },
  retryButton: {
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },

  // Header Styles
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(24px, 5vw, 32px)",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1.2,
  },
  subtitle: {
    margin: "4px 0 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  createButtonLink: {
    textDecoration: "none",
  },
  createButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
  },

  // Filters
  filtersContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: "2",
    minWidth: "280px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 44px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "white",
  },
  clearButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filterWrapper: {
    flex: "1",
    minWidth: "200px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  filterIcon: {
    position: "absolute",
    left: "12px",
    pointerEvents: "none",
  },
  filterSelect: {
    width: "100%",
    padding: "12px 16px 12px 44px",
    border: "1px solid #e5e7eb",
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
  },

  // Summary
  summary: {
    marginBottom: "20px",
  },
  summaryText: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },

  // Projects Grid
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  projectCardLink: {
    textDecoration: "none",
    color: "inherit",
  },
  projectCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    height: "100%",
    cursor: "pointer",
  },
  projectCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  projectIcon: {
    width: "40px",
    height: "40px",
    backgroundColor: "#eef2ff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    lineHeight: 1.4,
  },
  projectDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  projectDetail: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  projectDetailText: {
    color: "#4b5563",
    fontSize: "14px",
  },

  // Progress Section
  progressSection: {
    marginTop: "8px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  progressLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },
  progressValue: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#111827",
  },
  progressBarContainer: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.3s ease",
  },

  // Card Footer
  cardFooter: {
    marginTop: "auto",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  viewDetails: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "64px 24px",
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyStateTitle: {
    margin: "16px 0 8px 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  emptyStateText: {
    color: "#6b7280",
    fontSize: "16px",
    margin: "0 0 20px 0",
  },
  clearFiltersButton: {
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

// Add this CSS for the spinning animation
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
