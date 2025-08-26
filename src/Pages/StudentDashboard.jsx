import React, { useState } from "react";
import StarBorder from "../components/StarBorder"; // Import the new component

const StudentDashboard = () => {
  const [college, setCollege] = useState("");
  const [alumni, setAlumni] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // New state for client-side filtering
  const [nameFilter, setNameFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const searchAlumni = async () => {
    if (!college) return setMessage("Please enter a college name.");
    setLoading(true);
    setMessage("");
    setAlumni([]);
    // Reset filters on new search
    setNameFilter("");
    setCompanyFilter("");
    try {
      const res = await fetch(`http://localhost:8080/api/alumni/search/${college}`);
      if (!res.ok) throw new Error(await res.text() || "Failed to search alumni");
      const data = await res.json();
      setAlumni(data);
      if (data.length === 0) setMessage("No alumni found for this college.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Apply case-insensitive filters to the alumni list before rendering
  const filteredAlumni = alumni.filter(a =>
    a.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
    a.company.toLowerCase().includes(companyFilter.toLowerCase())
  );

  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.sidebar}>
        <h3>Student Menu</h3>
        <ul style={styles.navList}>
          {/* Replaced li with StarBorder component */}
          <StarBorder as="div" color="#4A5568" style={{ width: '100%' }}>
            Search for College
          </StarBorder>
        </ul>
        <StarBorder onClick={handleLogout} color="#dc3545">
          Logout
        </StarBorder>
      </nav>
      <main style={styles.mainContent}>
        <h2>Search for Alumni by College</h2>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Enter college name (e.g., NIT JALANDHAR)"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            style={styles.input}
          />
          <StarBorder onClick={searchAlumni} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </StarBorder>
        </div>
        {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green', marginTop: '20px' }}>{message}</p>}
        
        {alumni.length > 0 && (
          <div style={styles.resultsSection}>
            <h4>Filter Results:</h4>
            <div style={styles.filterControls}>
              <input
                type="text"
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                style={{...styles.input, ...styles.filterInput}}
              />
              <input
                type="text"
                placeholder="Filter by company..."
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                style={{...styles.input, ...styles.filterInput}}
              />
            </div>
            <ul style={styles.resultsList}>
              {filteredAlumni.length > 0 ? (
                filteredAlumni.map((a, idx) => (
                  <li key={idx} style={styles.resultItem}>
                    <strong>{a.name}</strong> ({a.email})<br />
                    <em>{a.designation} at {a.company}</em><br />
                    <small>Alumnus of {a.collegeName} ({a.specialization})</small>
                  </li>
                ))
              ) : (
                <p style={{padding: '15px', background: 'white', borderRadius: '5px'}}>No alumni match the current filters.</p>
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  dashboardContainer: { display: 'flex', minHeight: 'calc(100vh - 70px)', background: 'transparent' },
  sidebar: { width: '250px', background: 'rgba(30, 41, 59, 0.95)', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', alignItems: 'center' },
  navList: { listStyle: 'none', padding: '0', margin: '20px 0', flexGrow: 1, width: '100%', display: 'flex', justifyContent: 'center' },
  mainContent: { flex: 1, padding: '40px', background: 'rgba(243, 244, 246, 0.9)', color: '#333' },
  searchBox: { display: 'flex', gap: '10px', alignItems: 'center', background: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' },
  input: { flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' },
  resultsSection: { marginTop: '30px' },
  resultsList: { listStyle: 'none', padding: '0' },
  resultItem: { padding: '15px', borderBottom: '1px solid #ddd', background: 'white', borderRadius: '5px', marginBottom: '10px' },
  filterControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  filterInput: {
    fontSize: '14px',
  }
};

export default StudentDashboard;