import { useState } from "react";

function Login({ setPage, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        setUser(data);
        setPage("dashboard");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Cannot connect to server. Is Flask running?");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>AI Interview Simulator</h2>
        <p style={styles.subtitle}>Login to practice</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.link}>
          Don't have an account?{" "}
          <span
            style={styles.linkText}
            onClick={() => setPage("register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: 0,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    margin: 0,
    fontSize: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: "13px",
    textAlign: "center",
    margin: 0,
  },
  link: {
    textAlign: "center",
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },
  linkText: {
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Login;