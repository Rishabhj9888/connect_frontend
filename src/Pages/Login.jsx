import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch (err) { parsed = text; }

      if (res.ok) {
        // handle token if backend returns one
        if (parsed && typeof parsed === "object" && parsed.token) {
          localStorage.setItem("token", parsed.token);
        }
        setMessage(typeof parsed === "object" && parsed.message ? parsed.message : "Login successful ✅");
        window.location.href = "/dashboard";
      } else {
        setMessage(typeof parsed === "object" && parsed.message ? parsed.message : String(parsed || "Login failed"));
      }
    } catch (err) {
      setMessage("Network error: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Login</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", background: "transparent" },
  box: { background: "rgba(255, 255, 255, 0.9)", padding: "30px", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", width: "320px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "5px" },
  button: { padding: "10px", background: "#282c34", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};
export default Login;