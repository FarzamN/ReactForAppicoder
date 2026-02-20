import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  CheckCircle,
  Clock,
  Activity,
  PlusCircle,
  ArrowRight,
  FolderKanban,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  const projects = useSelector((state) => state.projects.list);

  const total = projects.length;
  const active = projects.filter((p) => p.status === "active").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const pending = projects.filter((p) => p.status === "pending").length;

  const recentProjects = [...projects].slice(-5).reverse();

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <FolderKanban size={32} color="#4f46e5" />
          <div>
            <h2 style={styles.title}>Dashboard</h2>
            <p style={styles.subtitle}>
              Welcome back! Here's your project overview
            </p>
          </div>
        </div>
        <Link to="/projects/new" style={styles.createButtonLink}>
          <button style={styles.createButton}>
            <PlusCircle size={20} />
            Create Project
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<FolderOpen size={24} color="#4f46e5" />}
          label="Total Projects"
          value={total}
          bgColor="#eef2ff"
        />
        <StatCard
          icon={<Activity size={24} color="#16a34a" />}
          label="Active"
          value={active}
          bgColor="#dcfce7"
        />
        <StatCard
          icon={<CheckCircle size={24} color="#9333ea" />}
          label="Completed"
          value={completed}
          bgColor="#f3e8ff"
        />
        <StatCard
          icon={<Clock size={24} color="#d97706" />}
          label="Pending"
          value={pending}
          bgColor="#fef3c7"
        />
      </div>

      {/* Recent Projects Section */}
      <div style={styles.recentSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>
            <BarChart3 size={24} color="#4f46e5" />
            <h3 style={styles.sectionHeading}>Recent Projects</h3>
          </div>
          {recentProjects.length > 0 && (
            <Link to="/projects" style={styles.viewAllLink}>
              View All <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <div style={styles.emptyState}>
            <FolderOpen size={48} color="#9ca3af" />
            <p style={styles.emptyStateText}>
              No projects yet. Create your first project!
            </p>
          </div>
        ) : (
          <div style={styles.projectsGrid}>
            {recentProjects.map((p) => (
              <div key={p.id} style={styles.projectCard}>
                <div style={styles.projectCardHeader}>
                  <div style={styles.projectIcon}>
                    <FolderKanban size={20} color="#4f46e5" />
                  </div>
                  <span style={getStatusStyle(p.status)}>{p.status}</span>
                </div>
                <h4 style={styles.projectName}>{p.name}</h4>
                <p style={styles.projectMeta}>
                  Created:{" "}
                  {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                </p>
                <Link to={`/projects/${p.id}`} style={styles.viewButton}>
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div style={{ ...styles.statCard, backgroundColor: bgColor }}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statContent}>
        <h3 style={styles.statValue}>{value}</h3>
        <p style={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

// Helper function for status styles
function getStatusStyle(status) {
  const statusStyles = {
    active: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      padding: "4px 8px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "capitalize",
    },
    completed: {
      backgroundColor: "#f3e8ff",
      color: "#6b21a8",
      padding: "4px 8px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "capitalize",
    },
    pending: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      padding: "4px 8px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "capitalize",
    },
  };

  return statusStyles[status] || statusStyles.pending;
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
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
  // Stats Grid - Responsive
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "40px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "12px",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    margin: 0,
    fontSize: "clamp(20px, 4vw, 28px)",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1.2,
  },
  statLabel: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#4b5563",
    fontWeight: "500",
  },
  // Recent Projects Section
  recentSection: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionHeading: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  viewAllLink: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    padding: "6px 12px",
    borderRadius: "6px",
    backgroundColor: "#eef2ff",
    transition: "background-color 0.2s",
  },
  // Projects Grid - Responsive
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  projectCard: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "20px",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  projectCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectIcon: {
    width: "36px",
    height: "36px",
    backgroundColor: "#eef2ff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  projectMeta: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },
  viewButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
    marginTop: "8px",
    padding: "6px 0",
    borderTop: "1px solid #e5e7eb",
  },
  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
  },
  emptyStateText: {
    color: "#6b7280",
    fontSize: "16px",
    marginTop: "12px",
  },
};
