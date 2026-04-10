import { useState } from "react";

function Practice({ setPage }) {
  const [topic, setTopic] = useState("Arrays");
  const [difficulty, setDifficulty] = useState("Easy");
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select");

  const getQuestion = async () => {
    setLoading(true);
    setResult(null);
    setCode("");
    try {
      const response = await fetch("http://localhost:5000/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty }),
      });
      const data = await response.json();
      if (response.ok) {
        setQuestion(data.question);
        setQuestionId(data.question_id);
        setStep("solve");
      } else {
        alert("Error getting question. Try again.");
      }
    } catch (err) {
      alert("Cannot connect to server.");
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!code.trim()) {
      alert("Please write your code first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          question,
          question_id: questionId,
          user_id: localStorage.getItem("user_id"),
          topic,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setStep("result");
      } else {
        alert("Error evaluating. Try again.");
      }
    } catch (err) {
      alert("Cannot connect to server.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Practice Session</h2>
        <button style={styles.backBtn} onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>

        {/* STEP 1 — Select topic */}
        {step === "select" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Choose your topic</h3>

            <label style={styles.label}>Topic</label>
            <select
              style={styles.select}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option>Arrays</option>
              <option>Strings</option>
              <option>Recursion</option>
              <option>Linked Lists</option>
              <option>SQL</option>
              <option>OOPs</option>
              <option>Sorting</option>
              <option>Hashmaps</option>
            </select>

            <label style={styles.label}>Difficulty</label>
            <select
              style={styles.select}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <button
              style={styles.primaryBtn}
              onClick={getQuestion}
              disabled={loading}
            >
              {loading ? "Generating question..." : "Get Question"}
            </button>
          </div>
        )}

        {/* STEP 2 — Solve */}
        {step === "solve" && (
          <div style={styles.card}>
            <div style={styles.questionBox}>
              <h3 style={styles.cardTitle}>Your Question</h3>
              <p style={styles.questionText}>{question}</p>
            </div>

            <h3 style={styles.cardTitle}>Write your answer</h3>
            <textarea
              style={styles.codeEditor}
              placeholder="Write your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
            />

            <div style={styles.btnRow}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setStep("select")}
              >
                Change Topic
              </button>
              <button
                style={styles.primaryBtn}
                onClick={submitAnswer}
                disabled={loading}
              >
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Result */}
        {step === "result" && result && (
          <div style={styles.card}>
            <div style={styles.scoreBox}>
              <p style={styles.scoreNumber}>{result.score}</p>
              <p style={styles.scoreLabel}>out of 100</p>
            </div>

            <div style={styles.feedbackBox}>
              <h3 style={styles.cardTitle}>Feedback</h3>
              <pre style={styles.feedbackText}>{result.feedback}</pre>
            </div>

            <div style={styles.btnRow}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setPage("dashboard")}
              >
                Go to Dashboard
              </button>
              <button
                style={styles.primaryBtn}
                onClick={() => {
                  setStep("select");
                  setQuestion("");
                  setCode("");
                  setResult(null);
                }}
              >
                Practice Again
              </button>
            </div>
          </div>
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
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  content: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "0 20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: 0,
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#444",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  primaryBtn: {
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },
  secondaryBtn: {
    padding: "12px 24px",
    backgroundColor: "white",
    color: "#4f46e5",
    border: "1px solid #4f46e5",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },
  questionBox: {
    backgroundColor: "#f0f4ff",
    borderRadius: "8px",
    padding: "20px",
    borderLeft: "4px solid #4f46e5",
  },
  questionText: {
    fontSize: "15px",
    color: "#333",
    lineHeight: "1.7",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  codeEditor: {
    fontFamily: "monospace",
    fontSize: "14px",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.6",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  scoreBox: {
    textAlign: "center",
    padding: "24px",
    backgroundColor: "#f0f4ff",
    borderRadius: "12px",
  },
  scoreNumber: {
    fontSize: "64px",
    fontWeight: "700",
    color: "#4f46e5",
    margin: 0,
  },
  scoreLabel: {
    fontSize: "16px",
    color: "#666",
    margin: 0,
  },
  feedbackBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
  },
  feedbackText: {
    fontSize: "13px",
    color: "#444",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    margin: 0,
    fontFamily: "sans-serif",
  },
};

export default Practice;