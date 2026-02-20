import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  Grid,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user = useSelector((state) => state.auth?.user);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { path: "/projects", label: "Projects", icon: FolderKanban },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const sidebarWidth = isCollapsed ? "80px" : "260px";

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          style={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div style={styles.overlay} onClick={closeMobileSidebar} />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          width: isMobile ? (isMobileOpen ? "280px" : "0") : sidebarWidth,
          transform: isMobile && !isMobileOpen ? "translateX(-100%)" : "none",
          backgroundColor: "#ffffff",
          borderRight: `1px solid ${"#e5e7eb"}`,
        }}
      >
        {/* Sidebar Header */}
        <div style={styles.header}>
          {!isCollapsed ? (
            <div style={styles.logo}>
              <Grid size={28} color="#4f46e5" />
              <span
                style={{
                  ...styles.logoText,
                  color: "#111827",
                }}
              >
                ProjectHub
              </span>
            </div>
          ) : (
            <div style={styles.logoCollapsed}>
              <Grid size={28} color="#4f46e5" />
            </div>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div
            style={{
              ...styles.userInfo,
              backgroundColor: "#f9fafb",
            }}
          >
            <div style={styles.avatar}>
              {user.name?.charAt(0).toUpperCase() || <User size={20} />}
            </div>
            {!isCollapsed && (
              <div style={styles.userDetails}>
                <span
                  style={{
                    ...styles.userName,
                    color: "#111827",
                  }}
                >
                  {user.name || "User"}
                </span>
                <span style={styles.userEmail}>
                  {user.email || "user@example.com"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.activeNavLink : {}),
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  color: isActive ? "#4f46e5" : "#4b5563",
                })}
                onClick={closeMobileSidebar}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <span style={styles.navLabel}>{item.label}</span>
                )}
                {isCollapsed && (
                  <span
                    style={{
                      ...styles.tooltip,
                      backgroundColor: "#1f2937",
                      color: "#ffffff",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div style={styles.bottomSection}>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              ...styles.logoutButton,
              justifyContent: isCollapsed ? "center" : "flex-start",
              color: "#dc2626",
            }}
          >
            <LogOut size={20} />
            {!isCollapsed && <span style={styles.navLabel}>Logout</span>}
            {isCollapsed && (
              <span
                style={{
                  ...styles.tooltip,
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                }}
              >
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Shift */}
      {!isMobile && (
        <div
          style={{
            marginLeft: sidebarWidth,
            transition: "margin-left 0.3s ease",
          }}
        />
      )}
    </>
  );
}

const styles = {
  // Menu Button for Mobile
  menuButton: {
    position: "fixed",
    top: "16px",
    left: "16px",
    zIndex: 1000,
    padding: "10px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.3)",
    transition: "background-color 0.2s",

    ":hover": {
      backgroundColor: "#4338ca",
    },
  },

  // Overlay for Mobile
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 998,
    animation: "fadeIn 0.3s ease",
  },

  // Sidebar Container
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    transition:
      "width 0.3s ease, transform 0.3s ease, background-color 0.3s ease",
    zIndex: 999,
    overflow: "hidden",
  },

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 16px 16px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  logoCollapsed: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  collapseButton: {
    padding: "6px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4b5563",
    transition: "all 0.2s",

    ":hover": {
      backgroundColor: "#e5e7eb",
      color: "#111827",
    },
  },

  // User Info
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    margin: "8px 16px 16px",
    borderRadius: "12px",
    transition: "background-color 0.3s ease",
  },
  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#4f46e5",
    color: "white",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "600",
    flexShrink: 0,
  },
  userDetails: {
    flex: 1,
    overflow: "hidden",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "2px",
  },
  userEmail: {
    fontSize: "11px",
    color: "#6b7280",
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  // Navigation
  nav: {
    flex: 1,
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    overflowY: "auto",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    position: "relative",
    border: "none",
    background: "none",
    width: "100%",
    cursor: "pointer",

    ":hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  activeNavLink: {
    backgroundColor: "#eef2ff",
    fontWeight: "600",
  },
  navLabel: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  // Tooltip for collapsed state
  tooltip: {
    position: "absolute",
    left: "100%",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    marginLeft: "8px",
    zIndex: 1000,
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },

  // Bottom Section
  bottomSection: {
    borderTop: "1px solid #e5e7eb",
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bottomNav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "8px",
  },

  // Theme Button
  themeButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s",

    ":hover": {
      opacity: 0.9,
    },
  },

  // Logout Button
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s",
    marginTop: "4px",

    ":hover": {
      backgroundColor: "#fef2f2",
    },
  },
};

// Add global styles
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* Tooltip hover effect */
  .nav-link:hover .tooltip,
  .logout-button:hover .tooltip {
    opacity: 1;
  }
  
  /* Scrollbar styling */
  .sidebar-nav::-webkit-scrollbar {
    width: 4px;
  }
  
  .sidebar-nav::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .sidebar-nav::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  .sidebar-nav::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Dark mode styles */
  body.dark-mode {
    background-color: #111827;
    color: #f9fafb;
  }
  
  body.dark-mode .nav-link:hover {
    background-color: #374151 !important;
  }
  
  body.dark-mode .active-nav-link {
    background-color: #1e293b !important;
  }
  
  body.dark-mode .logout-button:hover {
    background-color: #451a1a !important;
  }
  
  /* Mobile styles */
  @media (max-width: 768px) {
    .sidebar {
      box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
    }
  }
  
  /* Hover effects */
  .collapse-button:hover {
    background-color: #e5e7eb !important;
  }
  
  .menu-button:hover {
    background-color: #4338ca !important;
  }
`;
document.head.appendChild(style);
