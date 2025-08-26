import React, { useState } from "react";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const body = {
      firstName,
      lastName,
      email,
      password,
     collegeName,     
       specialization 
    };

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      // backend may return JSON or plain text
      let parsed;
      try { parsed = JSON.parse(text); } catch (err) { parsed = text; }

      if (res.ok) {
        setMessage(typeof parsed === "object" && parsed.message ? parsed.message : "Registration successful ✅");
        // redirect to login
        window.location.href = "/login";
      } else {
        setMessage(typeof parsed === "object" && parsed.message ? parsed.message : String(parsed || "Registration failed"));
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
        <h2>Register</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input type="text" placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} style={styles.input} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} style={styles.input} required />
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} style={styles.input} minLength={6} required />
          <input type="text" placeholder="College Name" value={collegeName} onChange={(e)=>setCollegeName(e.target.value)} style={styles.input} required />
          <input type="text" placeholder="Specialization" value={specialization} onChange={(e)=>setSpecialization(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button} disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", background: "transparent" },
  box: { background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", width: "360px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "5px" },
  button: { padding: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default Register;