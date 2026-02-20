import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Globe,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Shield,
  User,
  Mail,
  Smartphone,
  Volume2,
  Eye,
  Lock,
  ChevronRight,
  Activity,
} from "lucide-react";

export default function Settings() {
  // State for settings
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      taskUpdates: true,
      projectUpdates: true,
    },
    appearance: {
      darkMode: false,
      compactView: false,
      fontSize: "medium", // small, medium, large
    },
    language: "en",
    privacy: {
      showProfile: true,
      activityStatus: true,
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
    },
  });

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setSaved(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      notifications: {
        email: true,
        push: false,
        taskUpdates: true,
        projectUpdates: true,
      },
      appearance: {
        darkMode: false,
        compactView: false,
        fontSize: "medium",
      },
      language: "en",
      privacy: {
        showProfile: true,
        activityStatus: true,
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
      },
    };
    setSettings(defaultSettings);
    setSaved(false);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (settings.appearance.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [settings.appearance.darkMode]);

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "language", label: "Language", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "accessibility", label: "Accessibility", icon: Eye },
  ];

  const fontSizeOptions = {
    small: "12px",
    medium: "14px",
    large: "16px",
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer}>
            <SettingsIcon size={32} color="#4f46e5" />
          </div>
          <div>
            <h1 style={styles.title}>Settings</h1>
            <p style={styles.subtitle}>Manage your application preferences</p>
          </div>
        </div>

        <div style={styles.headerActions}>
          {saved && (
            <div style={styles.saveMessage}>
              <CheckCircle size={16} color="#10b981" />
              <span>Settings saved!</span>
            </div>
          )}
          <button
            style={styles.resetButton}
            onClick={handleResetSettings}
            title="Reset to defaults"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button style={styles.saveButton} onClick={handleSaveSettings}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div style={styles.content}>
        {/* Sidebar Tabs */}
        <div style={styles.sidebar}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab.id ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <ChevronRight size={16} style={styles.tabArrow} />
                )}
              </button>
            );
          })}
        </div>

        {/* Settings Panels */}
        <div style={styles.panel}>
          {/* Notifications Panel */}
          {activeTab === "notifications" && (
            <div style={styles.panelContent}>
              <h2 style={styles.panelTitle}>Notification Settings</h2>
              <p style={styles.panelDescription}>
                Configure how and when you receive notifications
              </p>

              <div style={styles.settingsGroup}>
                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Bell size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Email Notifications</h3>
                      <p style={styles.settingDescription}>
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "email",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Smartphone size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Push Notifications</h3>
                      <p style={styles.settingDescription}>
                        Receive push notifications on your device
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "push",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Mail size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Task Updates</h3>
                      <p style={styles.settingDescription}>
                        Get notified when tasks are updated
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.taskUpdates}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "taskUpdates",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Bell size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Project Updates</h3>
                      <p style={styles.settingDescription}>
                        Get notified about project changes
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.projectUpdates}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "projectUpdates",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Panel */}
          {activeTab === "appearance" && (
            <div style={styles.panelContent}>
              <h2 style={styles.panelTitle}>Appearance Settings</h2>
              <p style={styles.panelDescription}>
                Customize the look and feel of the application
              </p>

              <div style={styles.settingsGroup}>
                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    {settings.appearance.darkMode ? (
                      <Moon size={20} color="#4f46e5" />
                    ) : (
                      <Sun size={20} color="#4f46e5" />
                    )}
                    <div>
                      <h3 style={styles.settingTitle}>Dark Mode</h3>
                      <p style={styles.settingDescription}>
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.appearance.darkMode}
                      onChange={(e) =>
                        handleSettingChange(
                          "appearance",
                          "darkMode",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Eye size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Compact View</h3>
                      <p style={styles.settingDescription}>
                        Reduce spacing for a more compact layout
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.appearance.compactView}
                      onChange={(e) =>
                        handleSettingChange(
                          "appearance",
                          "compactView",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <SettingsIcon size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Font Size</h3>
                      <p style={styles.settingDescription}>
                        Adjust the text size
                      </p>
                    </div>
                  </div>
                  <div style={styles.radioGroup}>
                    {Object.keys(fontSizeOptions).map((size) => (
                      <label key={size} style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="fontSize"
                          value={size}
                          checked={settings.appearance.fontSize === size}
                          onChange={(e) =>
                            handleSettingChange(
                              "appearance",
                              "fontSize",
                              e.target.value,
                            )
                          }
                        />
                        <span style={styles.radioText}>
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Language Panel */}
          {activeTab === "language" && (
            <div style={styles.panelContent}>
              <h2 style={styles.panelTitle}>Language Settings</h2>
              <p style={styles.panelDescription}>
                Choose your preferred language
              </p>

              <div style={styles.settingsGroup}>
                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Globe size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Display Language</h3>
                      <p style={styles.settingDescription}>
                        Select the language for the interface
                      </p>
                    </div>
                  </div>
                  <select
                    style={styles.select}
                    value={settings.language}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                  </select>
                </div>

                <div style={styles.languagePreview}>
                  <p style={styles.previewText}>
                    <strong>Preview:</strong> All text will be displayed in your
                    selected language
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Panel */}
          {activeTab === "privacy" && (
            <div style={styles.panelContent}>
              <h2 style={styles.panelTitle}>Privacy Settings</h2>
              <p style={styles.panelDescription}>
                Control your privacy preferences
              </p>

              <div style={styles.settingsGroup}>
                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <User size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Show Profile</h3>
                      <p style={styles.settingDescription}>
                        Make your profile visible to other users
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showProfile}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "showProfile",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Activity size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Activity Status</h3>
                      <p style={styles.settingDescription}>
                        Show when you're active online
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.activityStatus}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "activityStatus",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.privacyNote}>
                  <Lock size={16} color="#6b7280" />
                  <span>Your data is encrypted and secure</span>
                </div>
              </div>
            </div>
          )}

          {/* Accessibility Panel */}
          {activeTab === "accessibility" && (
            <div style={styles.panelContent}>
              <h2 style={styles.panelTitle}>Accessibility Settings</h2>
              <p style={styles.panelDescription}>
                Make the app work better for your needs
              </p>

              <div style={styles.settingsGroup}>
                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Volume2 size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>Reduce Motion</h3>
                      <p style={styles.settingDescription}>
                        Minimize animations and transitions
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.reduceMotion}
                      onChange={(e) =>
                        handleSettingChange(
                          "accessibility",
                          "reduceMotion",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div style={styles.settingInfo}>
                    <Eye size={20} color="#4f46e5" />
                    <div>
                      <h3 style={styles.settingTitle}>High Contrast</h3>
                      <p style={styles.settingDescription}>
                        Increase contrast for better visibility
                      </p>
                    </div>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.highContrast}
                      onChange={(e) =>
                        handleSettingChange(
                          "accessibility",
                          "highContrast",
                          e.target.checked,
                        )
                      }
                    />
                    <span style={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  // Header
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
    gap: "16px",
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
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  saveMessage: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 12px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    borderRadius: "6px",
    fontSize: "14px",
  },
  resetButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "10px 16px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4b5563",
    cursor: "pointer",
    transition: "all 0.2s",

    ":hover": {
      backgroundColor: "#f9fafb",
      borderColor: "#d1d5db",
    },
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",

    ":hover": {
      backgroundColor: "#4338ca",
    },
  },

  // Content Layout
  content: {
    display: "flex",
    gap: "24px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",

    "@media (maxWidth: 768px)": {
      flexDirection: "column",
    },
  },

  // Sidebar
  sidebar: {
    width: "240px",
    backgroundColor: "#f9fafb",
    borderRight: "1px solid #e5e7eb",
    padding: "16px 0",

    "@media (maxWidth: 768px)": {
      width: "100%",
      borderRight: "none",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      flexWrap: "wrap",
      padding: "12px",
    },
  },
  tabButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px 20px",
    border: "none",
    backgroundColor: "transparent",
    color: "#4b5563",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",

    ":hover": {
      backgroundColor: "#eef2ff",
      color: "#4f46e5",
    },

    "@media (maxWidth: 768px)": {
      width: "auto",
      padding: "8px 16px",
      borderRadius: "6px",
    },
  },
  activeTab: {
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    fontWeight: "600",
  },
  tabArrow: {
    position: "absolute",
    right: "16px",

    "@media (maxWidth: 768px)": {
      display: "none",
    },
  },

  // Panel
  panel: {
    flex: 1,
    padding: "24px",
    minHeight: "500px",
  },
  panelContent: {
    maxWidth: "600px",
  },
  panelTitle: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  panelDescription: {
    margin: "0 0 24px 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  // Settings Group
  settingsGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #e5e7eb",
    flexWrap: "wrap",
    gap: "16px",

    ":last-child": {
      borderBottom: "none",
    },
  },
  settingInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: "250px",
  },
  settingTitle: {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "500",
    color: "#111827",
  },
  settingDescription: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },

  // Toggle Switch
  switch: {
    position: "relative",
    display: "inline-block",
    width: "48px",
    height: "24px",
    flexShrink: 0,
  },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e5e7eb",
    transition: "0.2s",
    borderRadius: "24px",

    ":before": {
      position: "absolute",
      content: '""',
      height: "20px",
      width: "20px",
      left: "2px",
      bottom: "2px",
      backgroundColor: "white",
      transition: "0.2s",
      borderRadius: "50%",
    },
  },

  // Select
  select: {
    padding: "8px 32px 8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "white",
    cursor: "pointer",
    outline: "none",
    minWidth: "200px",

    ":focus": {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },

  // Radio Group
  radioGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
  },
  radioText: {
    fontSize: "14px",
    color: "#4b5563",
  },

  // Language Preview
  languagePreview: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  previewText: {
    margin: 0,
    fontSize: "13px",
    color: "#4b5563",
  },

  // Privacy Note
  privacyNote: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    color: "#6b7280",
    fontSize: "13px",
  },

  // Footer
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  footerText: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "12px",
  },
};

// Add global styles for toggle switch and dark mode
const style = document.createElement("style");
style.textContent = `
  /* Toggle Switch Styles */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .switch input:checked + .slider {
    background-color: #4f46e5;
  }
  
  .switch input:checked + .slider:before {
    transform: translateX(24px);
  }
  
  .switch input:focus + .slider {
    box-shadow: 0 0 1px #4f46e5;
  }
  
  /* Dark Mode Styles */
  body.dark-mode {
    background-color: #111827;
    color: #f9fafb;
  }
  
  body.dark-mode .settings-container {
    background-color: #1f2937;
  }
  
  /* Hover Effects */
  .tab-button:hover {
    background-color: #eef2ff !important;
    color: #4f46e5 !important;
  }
  
  .reset-button:hover {
    background-color: #f9fafb !important;
    border-color: #d1d5db !important;
  }
  
  .save-button:hover {
    background-color: #4338ca !important;
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .sidebar {
      flex-direction: row !important;
      overflow-x: auto;
    }
    
    .tab-button {
      white-space: nowrap;
    }
  }
`;
document.head.appendChild(style);
