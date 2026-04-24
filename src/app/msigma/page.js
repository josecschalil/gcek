"use client";

import { useEffect, useState } from "react";
import { courses } from "./data";

export default function MsigmaHub() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewed, setViewed] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viewedVideos");
      if (saved) setViewed(JSON.parse(saved));
    } catch (e) {
      console.log("Using in-memory storage");
    }
  }, []);

  // Save to localStorage
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

  const getCourseStats = (course) => {
    return course.sections.reduce(
      (acc, section) => {
        const p = getProgress(section.videos);
        return { watched: acc.watched + p.watched, total: acc.total + p.total };
      },
      { watched: 0, total: 0 }
    );
  };

  // ─── Course Listing View ─────────────────────────────────
  if (!selectedCourse) {
    return (
      <div style={styles.root}>
        <div style={styles.bgGradient} />
        <div style={styles.bgBlobs}>
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={styles.blob3} />
        </div>

        {/* Catalog Header */}
        <header style={styles.catalogHeader}>
          <div style={styles.catalogHeaderInner}>
            <div style={styles.catalogBrand}>
              <div style={styles.catalogLogo}>📚</div>
              <div>
                <h1 style={styles.catalogTitle}>MSigma Courses</h1>
                <p style={styles.catalogSubtitle}>
                  Your curated video course library
                </p>
              </div>
            </div>
            <div style={styles.catalogBadge}>
              <span style={styles.catalogBadgeNumber}>{courses.length}</span>
              <span style={styles.catalogBadgeLabel}>
                {courses.length === 1 ? "Course" : "Courses"}
              </span>
            </div>
          </div>
        </header>

        {/* Course Cards */}
        <main style={styles.catalogMain}>
          <div style={styles.courseGrid}>
            {courses.map((course) => {
              const stats = getCourseStats(course);
              const pct =
                stats.total > 0
                  ? Math.round((stats.watched / stats.total) * 100)
                  : 0;

              return (
                <div
                  key={course.id}
                  id={`course-${course.id}`}
                  style={styles.courseCard}
                  onClick={() => {
                    setSelectedCourse(course);
                    setActiveSection(null);
                    setSearchTerm("");
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-8px) scale(1.02)";
                    e.currentTarget.style.borderColor = course.color + "60";
                    e.currentTarget.style.boxShadow = `0 20px 60px ${course.color}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Gradient accent bar */}
                  <div
                    style={{
                      height: "4px",
                      background: `linear-gradient(90deg, ${course.gradient[0]}, ${course.gradient[1]})`,
                      borderRadius: "16px 16px 0 0",
                    }}
                  />

                  <div style={styles.courseCardBody}>
                    {/* Icon + Title row */}
                    <div style={styles.courseCardTop}>
                      <div
                        style={{
                          ...styles.courseIcon,
                          background: `linear-gradient(135deg, ${course.gradient[0]}25, ${course.gradient[1]}25)`,
                          border: `2px solid ${course.color}40`,
                        }}
                      >
                        <span style={{ fontSize: "36px" }}>{course.icon}</span>
                      </div>
                      <div style={styles.courseCardMeta}>
                        <span style={styles.courseSectionCount}>
                          {course.sections.length}{" "}
                          {course.sections.length === 1
                            ? "section"
                            : "sections"}
                        </span>
                        <span style={styles.courseVideoCount}>
                          {stats.total} videos
                        </span>
                      </div>
                    </div>

                    <h2 style={styles.courseCardTitle}>{course.title}</h2>
                    <p style={styles.courseCardSubtitle}>{course.subtitle}</p>

                    {/* Compact progress */}
                    <div style={styles.courseProgressArea}>
                      <div style={styles.courseProgressBarBg}>
                        <div
                          style={{
                            ...styles.courseProgressBarFill,
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${course.gradient[0]}, ${course.gradient[1]})`,
                          }}
                        />
                      </div>
                      <div style={styles.courseProgressLabels}>
                        <span style={styles.courseProgressPct}>{pct}%</span>
                        <span style={styles.courseProgressDetail}>
                          {stats.watched}/{stats.total} watched
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div
                      style={{
                        ...styles.courseCTA,
                        background: `linear-gradient(135deg, ${course.gradient[0]}20, ${course.gradient[1]}20)`,
                        borderColor: course.color + "40",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>
                        {pct > 0 ? "Continue Learning" : "Start Course"}
                      </span>
                      <span style={{ fontSize: "18px" }}>→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <footer style={styles.footer}>
          <p>Keep learning, keep growing! 🚀</p>
        </footer>

        <style>{keyframes}</style>
      </div>
    );
  }

  // ─── Course Detail View (existing design) ────────────────
  const data = selectedCourse.sections;

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
            {/* Back button */}
            <button
              onClick={() => setSelectedCourse(null)}
              style={styles.backButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.08)";
              }}
            >
              ←
            </button>
            <div style={styles.logo}>{selectedCourse.icon}</div>
            <div>
              <h1
                style={{
                  ...styles.mainTitle,
                  background: `linear-gradient(135deg, ${selectedCourse.gradient[0]}, ${selectedCourse.gradient[1]})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {selectedCourse.title}
              </h1>
              <p style={styles.subtitle}>{selectedCourse.subtitle}</p>
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
                {totalStats.total > 0
                  ? Math.round((totalStats.watched / totalStats.total) * 100)
                  : 0}
                %
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

// ─── Keyframes & Fonts ──────────────────────────────────────
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

  @keyframes cardReveal {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

// ─── Styles ─────────────────────────────────────────────────
const styles = {
  // ── Shared ──
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

  footer: {
    textAlign: "center",
    padding: "40px 20px",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "14px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    marginTop: "40px",
  },

  // ── Catalog Page ──
  catalogHeader: {
    position: "relative",
    padding: "48px 20px 40px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(10, 14, 39, 0.4)",
    animation: "slideIn 0.8s ease-out",
  },

  catalogHeaderInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
  },

  catalogBrand: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  catalogLogo: {
    fontSize: "52px",
    animation: "float 3s ease-in-out infinite",
  },

  catalogTitle: {
    fontSize: "34px",
    fontWeight: "800",
    margin: "0",
    background: "linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  catalogSubtitle: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.55)",
    margin: "6px 0 0 0",
    fontWeight: "300",
    letterSpacing: "0.3px",
  },

  catalogBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "14px 28px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },

  catalogBadgeNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#a78bfa",
  },

  catalogBadgeLabel: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.55)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  catalogMain: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "28px",
    animation: "slideIn 0.8s ease-out 0.15s both",
  },

  courseCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    backdropFilter: "blur(24px)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: "cardReveal 0.6s ease-out both",
  },

  courseCardBody: {
    padding: "28px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  courseCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  courseIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  courseCardMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },

  courseSectionCount: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.55)",
    fontWeight: "500",
  },

  courseVideoCount: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.4)",
  },

  courseCardTitle: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "1.25",
  },

  courseCardSubtitle: {
    margin: "0",
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.5)",
    lineHeight: "1.5",
  },

  courseProgressArea: {
    marginTop: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  courseProgressBarBg: {
    height: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "3px",
    overflow: "hidden",
  },

  courseProgressBarFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.5s ease",
  },

  courseProgressLabels: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  courseProgressPct: {
    fontSize: "13px",
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.85)",
  },

  courseProgressDetail: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.4)",
  },

  courseCTA: {
    marginTop: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid",
    color: "rgba(255, 255, 255, 0.85)",
    transition: "all 0.3s ease",
  },

  // ── Detail Page ──
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
    alignItems: "flex-start",
    gap: "40px",
    flexWrap: "wrap",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  backButton: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.2s ease",
    flexShrink: 0,
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
    marginTop: "8px",
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
    transform: "translateY(-45%)",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
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
};