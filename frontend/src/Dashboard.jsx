import { useState, useEffect } from "react";

function Dashboard({ user, setPage }) {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await fetch(`https://ai-interview-simulator-ycbl.onrender.com/attempts/${localStorage.getItem("user_id")}`);
      const data = await response.json();
      if (response.ok) setAttempts(data.attempts);
    } catch (err) {
      console.log("Error fetching attempts");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setPage("login");
  };

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>AI Interview Simulator</h2>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>
            Hi, {localStorage.getItem("name")}
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{attempts.length}</p>
          <p style={styles.statLabel}>Total Attempts</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{avgScore}</p>
          <p style={styles.statLabel}>Average Score</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>
            {attempts.filter(a => a.score >= 70).length}
          </p>
          <p style={styles.statLabel}>Passed (70+)</p>
        </div>
      </div>

      <div style={styles.practiceSection}>
        <h3 style={styles.sectionTitle}>Ready to practice?</h3>
        <button style={styles.practiceBtn} onClick={() => setPage("practice")}>
          Start Practice Session
        </button>
      </div>

      <div style={styles.attemptsSection}>
        <h3 style={styles.sectionTitle}>Past Attempts</h3>
        {attempts.length === 0 ? (
          <p style={styles.noAttempts}>No attempts yet. Start practicing!</p>
        ) : (
          attempts.map((attempt, index) => (
            <div key={index} style={styles.attemptCard}>
              <div>
                <p style={styles.attemptTopic}>{attempt.topic}</p>
                <p style={styles.attemptDate}>{attempt.attempted_at}</p>
              </div>
              <div style={{
                padding: "6px 16px",
                borderRadius: "20px",
                fontWeight: "700",
                fontSize: "14px",
                backgroundColor: attempt.score >= 70 ? "#d1fae5" : "#fee2e2",
                color: attempt.score >= 70 ? "#065f46" : "#991b1b",
              }}>
                {attempt.score}/100
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
  },
  header: {
    backgroundColor: "#4f46e5",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    margin: 0,
    fontSize: "20px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  welcome: {
    color: "white",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  statsRow: {
    display: "flex",
    gap: "20px",
    padding: "32px",
    justifyContent: "center",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px 40px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    minWidth: "140px",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#4f46e5",
    margin: 0,
  },
  statLabel: {
    fontSize: "13px",
    color: "#666",
    margin: "4px 0 0 0",
  },
  practiceSection: {
    textAlign: "center",
    padding: "0 32px 32px",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#1a1a2e",
    marginBottom: "16px",
  },
  practiceBtn: {
    padding: "14px 40px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  attemptsSection: {
    padding: "0 32px 32px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  noAttempts: {
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
  },
  attemptCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },
  attemptTopic: {
    margin: 0,
    fontWeight: "600",
    fontSize: "15px",
    color: "#1a1a2e",
  },
  attemptDate: {
    margin: 0,
    fontSize: "12px",
    color: "#999",
  },
};

export default Dashboard;