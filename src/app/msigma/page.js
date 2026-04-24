"use client";

import { useEffect, useState } from "react";

export default function PowerElectronicsHub() {
  const data = [
    {
      title: "Fault Analysis",
      icon: "⚡",
      color: "#ef4444",
      videos: [
        "https://iframe.mediadelivery.net/embed/473225/3b027047-0f7d-4565-98f0-1751fc6705a3",
        "https://iframe.mediadelivery.net/embed/473225/1fe36b50-cf37-4317-8049-c6ca06362bd5",
        "https://iframe.mediadelivery.net/embed/473225/eee996d1-2553-4934-ab61-5fc1470a1b4c",
        "https://iframe.mediadelivery.net/embed/473225/3ac0e5dc-f2d1-4acc-be2c-5db05401f6b4",
        "https://iframe.mediadelivery.net/embed/473225/cc3c2acb-5fd6-4111-b458-277ba73be58c",
        "https://iframe.mediadelivery.net/embed/473225/afc16267-b4fe-4ad2-b03f-d8573569249f",
        "https://iframe.mediadelivery.net/embed/473225/77acf7a1-318e-43b6-a512-d96a74353799",
      ],
    },
    {
      title: "Load Flow Studies",
      icon: "🔌",
      color: "#3b82f6",
      videos: [
        "https://iframe.mediadelivery.net/embed/473225/fb8fa944-781b-45cc-9542-84084bc05a0b",
        "https://iframe.mediadelivery.net/embed/473225/86f06edd-a55d-45c2-826c-0c4f2af90f1b",
        "https://iframe.mediadelivery.net/embed/473225/a5f72738-970a-4d26-a680-26e1064789af",
        "https://iframe.mediadelivery.net/embed/473225/9399cc4f-3422-4084-b20f-31bc63f61207",
        "https://iframe.mediadelivery.net/embed/473222/265c9d42-25c0-48bf-b373-2f9e22fdb92b",
        "https://iframe.mediadelivery.net/embed/473225/16a0b936-b34d-4c23-bdf6-f571d9e41df6",
      ],
    },
    {
      title: "Power System Stability",
      icon: "🎯",
      color: "#10b981",
      videos: [
        "https://iframe.mediadelivery.net/embed/473222/d137e121-b698-46f8-8cc9-1bbff3ba34cb",
        "https://iframe.mediadelivery.net/embed/473225/582b61af-41db-4db9-be05-d880d254a2a7",
        "https://iframe.mediadelivery.net/embed/473225/ee5c4173-48f6-4c9f-82f1-f55aa62c4b37",
      ],
    },
    {
      title: "AGC & AVR",
      icon: "⚙️",
      color: "#f59e0b",
      videos: [
        "https://iframe.mediadelivery.net/embed/473225/e3009640-8feb-4b6c-b58e-fc184aa4575e",
        "https://iframe.mediadelivery.net/embed/473225/0fca8711-612b-4a5d-8b66-120b7f4da6b9",
      ],
    },
    {
      title: "Economic Load Dispatch & Unit Commitment",
      icon: "💡",
      color: "#8b5cf6",
      videos: [
        "https://iframe.mediadelivery.net/embed/473225/9d763d80-8ddb-45f2-a654-d295f8ae4789",
        "https://iframe.mediadelivery.net/embed/473225/9b3aaa63-b74d-4c6f-88b4-713a92deb003",
        "https://iframe.mediadelivery.net/embed/473225/27f0df16-4a8c-4265-b902-4950a4074357",
      ],
    },
  ];

  const [viewed, setViewed] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load from localStorage (with fallback to in-memory state)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viewedVideos");
      if (saved) setViewed(JSON.parse(saved));
    } catch (e) {
      console.log("Using in-memory storage");
    }
  }, []);

  // Save to localStorage (with fallback)
  useEffect(() => {
    try {
      localStorage.setItem("viewedVideos", JSON.stringify(viewed));
    } catch (e) {
      console.log("Storing in memory only");
    }
  }, [viewed]);

  const openVideo = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setViewed((prev) => ({ ...prev, [url]: true }));
  };

  const toggleViewed = (url) => {
    setViewed((prev) => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  const getProgress = (videos) => {
    const watched = videos.filter((v) => viewed[v]).length;
    return { watched, total: videos.length };
  };

  const totalStats = data.reduce(
    (acc, section) => {
      const p = getProgress(section.videos);
      return { watched: acc.watched + p.watched, total: acc.total + p.total };
    },
    { watched: 0, total: 0 }
  );

  const filteredData = data.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.root}>
      {/* Animated background */}
      <div style={styles.bgGradient} />
      <div style={styles.bgBlobs}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <div style={styles.blob3} />
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>⚡</div>
            <div>
              <h1 style={styles.mainTitle}>Power System 2</h1>
              <p style={styles.subtitle}>Master advanced power systems engineering</p>
            </div>
          </div>

          <div style={styles.statsBox}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{totalStats.watched}</span>
              <span style={styles.statLabel}>Watched</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{totalStats.total}</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {Math.round((totalStats.watched / totalStats.total) * 100)}%
              </span>
              <span style={styles.statLabel}>Complete</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.searchIcon}>🔍</span>
      </div>

      {/* Main Grid */}
      <main style={styles.mainContent}>
        <div style={styles.cardsGrid}>
          {filteredData.map((section, idx) => {
            const progress = getProgress(section.videos);
            const progressPercent = (progress.watched / progress.total) * 100;
            const isExpanded = activeSection === idx;

            return (
              <div
                key={idx}
                style={{
                  ...styles.sectionCard,
                  ...(isExpanded && styles.sectionCardExpanded),
                }}
              >
                {/* Card Header */}
                <div
                  style={styles.cardHeader}
                  onClick={() => setActiveSection(isExpanded ? null : idx)}
                >
                  <div style={styles.headerLeft}>
                    <div
                      style={{
                        ...styles.iconBox,
                        backgroundColor: section.color + "20",
                        borderColor: section.color,
                      }}
                    >
                      <span style={styles.iconText}>{section.icon}</span>
                    </div>
                    <div style={styles.titleGroup}>
                      <h2 style={styles.sectionTitle}>{section.title}</h2>
                      <p style={styles.videoCount}>
                        {progress.total} videos
                      </p>
                    </div>
                  </div>

                  <div style={styles.headerRight}>
                    <div style={styles.progressRing}>
                      <svg
                        width="60"
                        height="60"
                        style={styles.svg}
                        viewBox="0 0 60 60"
                      >
                        <circle
                          cx="30"
                          cy="30"
                          r="25"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="30"
                          cy="30"
                          r="25"
                          fill="none"
                          stroke={section.color}
                          strokeWidth="3"
                          strokeDasharray={`${2 * Math.PI * 25}`}
                          strokeDashoffset={`${
                            2 * Math.PI * 25 * (1 - progressPercent / 100)
                          }`}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 0.3s" }}
                        />
                      </svg>
                      <div style={styles.progressText}>
                        {Math.round(progressPercent)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar under header */}
                <div style={styles.progressBarContainer}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${progressPercent}%`,
                      backgroundColor: section.color,
                    }}
                  />
                </div>

                {/* Video List - Expandable */}
                {isExpanded && (
                  <div style={styles.videoListContainer}>
                    {section.videos.map((video, vidIdx) => {
                      const isViewed = viewed[video];

                      return (
                        <div
                          key={vidIdx}
                          style={{
                            ...styles.videoItem,
                            animationDelay: `${vidIdx * 0.05}s`,
                          }}
                        >
                          <div style={styles.videoItemContent}>
                            <div style={styles.videoNumber}>
                              {vidIdx + 1}
                            </div>
                            <button
                              onClick={() => openVideo(video)}
                              style={{
                                ...styles.playButton,
                                backgroundColor: isViewed
                                  ? section.color + "30"
                                  : "rgba(255,255,255,0.05)",
                                borderColor: isViewed
                                  ? section.color
                                  : "rgba(255,255,255,0.1)",
                              }}
                            >
                              <span style={styles.playIcon}>▶</span>
                              <span style={styles.playText}>
                                Video {vidIdx + 1}
                              </span>
                              {isViewed && (
                                <span style={styles.watchedBadge}>✓</span>
                              )}
                            </button>
                          </div>

                          <button
                            onClick={() => toggleViewed(video)}
                            style={{
                              ...styles.toggleButton,
                              backgroundColor: isViewed
                                ? section.color
                                : "rgba(255,255,255,0.05)",
                              borderColor: isViewed
                                ? section.color
                                : "rgba(255,255,255,0.1)",
                            }}
                          >
                            {isViewed ? "✔" : "○"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div style={styles.noResults}>
            <span style={styles.noResultsIcon}>🔎</span>
            <p style={styles.noResultsText}>No topics found</p>
            <button
              onClick={() => setSearchTerm("")}
              style={styles.resetButton}
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Keep learning, keep growing! 🚀</p>
      </footer>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300;400;600;700;800&display=swap');

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes blobMove {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  @keyframes expandIn {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 1000px;
    }
  }
`;

const styles = {
  root: {
    position: "relative",
    minHeight: "100vh",
    backgroundColor: "#0a0e27",
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
    overflow: "hidden",
  },

  bgGradient: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1428 100%)",
    zIndex: -2,
  },

  bgBlobs: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },

  blob1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(239, 68, 68, 0.15), transparent)",
    borderRadius: "50%",
    top: "-10%",
    right: "-5%",
    animation: "blobMove 15s ease-in-out infinite",
  },

  blob2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent)",
    borderRadius: "50%",
    bottom: "-5%",
    left: "-2%",
    animation: "blobMove 20s ease-in-out infinite 2s",
  },

  blob3: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background:
      "radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)",
    borderRadius: "50%",
    top: "50%",
    right: "10%",
    animation: "blobMove 18s ease-in-out infinite 4s",
  },

  header: {
    position: "relative",
    padding: "40px 20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(10, 14, 39, 0.4)",
    animation: "slideIn 0.8s ease-out",
  },

  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  logo: {
    fontSize: "48px",
    animation: "float 3s ease-in-out infinite",
  },

  mainTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  subtitle: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.6)",
    margin: "4px 0 0 0",
    fontWeight: "300",
  },

  statsBox: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
    padding: "16px 28px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },

  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },

  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#3b82f6",
  },

  statLabel: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statDivider: {
    width: "1px",
    height: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  searchContainer: {
    maxWidth: "1400px",
    margin: "30px auto",
    padding: "0 20px",
    position: "relative",
    animation: "slideIn 0.8s ease-out 0.1s both",
  },

  searchInput: {
    width: "100%",
    padding: "14px 18px 14px 44px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },

  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  mainContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
    animation: "slideIn 0.8s ease-out 0.2s both",
  },

  sectionCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    backdropFilter: "blur(20px)",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },

  sectionCardExpanded: {
    gridColumn: "1 / -1",
    background: "rgba(255, 255, 255, 0.06)",
  },

  cardHeader: {
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },

  headerLeft: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  iconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid",
    transition: "all 0.3s ease",
  },

  iconText: {
    fontSize: "28px",
  },

  titleGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  sectionTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "700",
  },

  videoCount: {
    margin: "0",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.6)",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
  },

  progressRing: {
    position: "relative",
    width: "60px",
    height: "60px",
  },

  svg: {
    transform: "rotate(-90deg)",
  },

  progressText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "13px",
    fontWeight: "700",
  },

  progressBarContainer: {
    height: "3px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    transition: "width 0.3s ease",
  },

  videoListContainer: {
    padding: "20px 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "12px",
    animation: "expandIn 0.4s ease-out",
  },

  videoItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    animation: "slideIn 0.4s ease-out",
  },

  videoItemContent: {
    flex: 1,
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  videoNumber: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },

  playButton: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1.5px solid",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.2s ease",
    position: "relative",
  },

  playIcon: {
    fontSize: "12px",
  },

  playText: {
    flex: 1,
    textAlign: "left",
  },

  watchedBadge: {
    fontSize: "13px",
    color: "#10b981",
  },

  toggleButton: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    border: "1.5px solid",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  noResults: {
    textAlign: "center",
    padding: "60px 20px",
    animation: "slideIn 0.4s ease-out",
  },

  noResultsIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px",
  },

  noResultsText: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.6)",
    margin: "0 0 16px 0",
  },

  resetButton: {
    padding: "10px 20px",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.5)",
    borderRadius: "8px",
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.2s ease",
  },

  footer: {
    textAlign: "center",
    padding: "40px 20px",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "14px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    marginTop: "40px",
  },
};