import React, { useState } from "react";
import StarBorder from "../components/StarBorder"; // Import the new component

// Updated to use the StarBorder component for its buttons
const AdminView = ({ view, form, setForm, addAlumni, searchAlumni, college, setCollege, loading }) => {
  switch (view) {
    case 'add':
      return (
        <div>
          <h2>Add New Alumni</h2>
          <form onSubmit={addAlumni} style={styles.form}>
            {Object.keys(form).map((key) => (
              <input
                key={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={styles.input}
                required
              />
            ))}
            <StarBorder type="submit" disabled={loading}>
              {loading ? "Saving..." : "Add Alumni"}
            </StarBorder>
          </form>
        </div>
      );
    case 'search':
      return (
        <div>
          <h2>Search & View Alumni</h2>
          <div style={styles.searchControls}>
            <input type="text" placeholder="Enter college name" value={college} onChange={(e) => setCollege(e.target.value)} style={styles.input} />
            <StarBorder onClick={searchAlumni} disabled={loading}>Search</StarBorder>
          </div>
        </div>
      );
    case 'all':
       return <h2>View All Alumni</h2>;
    default:
      return <h2>Welcome, Admin!</h2>;
  }
};

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('add');
  const [alumni, setAlumni] = useState([]);
  const [college, setCollege] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", designation: "", collegeName: "", specialization: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 5;

  const apiCall = async (url, options = {}) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(await res.text() || "An error occurred");
      return res.json();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAlumni = (page = 0) => {
    setActiveView('all');
    const url = `http://localhost:8080/api/alumni/all?page=${page}&size=${PAGE_SIZE}`;
    apiCall(url).then(data => {
      setAlumni(data.content || []);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
      if (data.totalElements === 0) setMessage("No alumni found.");
    }).catch(() => {
      setAlumni([]);
      setTotalPages(0);
    });
  };

  const searchAlumni = () => {
    if (!college) return setMessage("Please enter a college name.");
    apiCall(`http://localhost:8080/api/alumni/search/${college}`).then(data => {
      setAlumni(data);
      if (data.length === 0) setMessage("No alumni found for this college.");
    }).catch(() => setAlumni([]));
  };

  const addAlumni = async (e) => {
    e.preventDefault();
    try {
      const newAlumnus = await apiCall("http://localhost:8080/api/alumni/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setMessage("✅ Alumni added successfully");
      setAlumni(prev => [newAlumnus, ...prev]);
      setForm({ name: "", email: "", company: "", designation: "", collegeName: "", specialization: "" });
    } catch (err) { /* Handled by apiCall */ }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navItems = [
    { label: 'Add Alumni', view: 'add' },
    { label: 'Search Alumni', view: 'search' },
    { label: 'View All Alumni', onClick: () => fetchAllAlumni(0), view: 'all' },
  ];

  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.sidebar}>
        <h3>Admin Menu</h3>
        <ul style={styles.navList}>
          {navItems.map((item) => (
            <li key={item.view} style={{width: '100%', marginBottom: '10px'}}>
              <StarBorder
                as="div"
                onClick={item.onClick || (() => { setActiveView(item.view); setAlumni([]); setMessage(''); setTotalPages(0); })}
                color={activeView === item.view ? "#4A5568" : "white"}
                style={{ width: '100%' }}
              >
                {item.label}
              </StarBorder>
            </li>
          ))}
        </ul>
        <StarBorder onClick={handleLogout} color="#dc3545">Logout</StarBorder>
      </nav>
      <main style={styles.mainContent}>
        <AdminView view={activeView} {...{ alumni, form, setForm, addAlumni, searchAlumni, college, setCollege, loading }} />
        {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green', marginTop: '20px' }}>{message}</p>}
        {alumni.length > 0 && (
          <div style={styles.resultsSection}>
            <ul style={styles.resultsList}>
              {alumni.map((a, idx) => (
                <li key={idx} style={styles.resultItem}>
                  <strong>{a.name}</strong> ({a.email})<br />
                  <em>{a.designation} at {a.company}</em><br />
                  <small>Alumnus of {a.collegeName} ({a.specialization})</small>
                </li>
              ))}
            </ul>
            {activeView === 'all' && totalPages > 1 && (
              <div style={styles.paginationControls}>
                <StarBorder onClick={() => fetchAllAlumni(currentPage - 1)} disabled={currentPage === 0 || loading}>
                  Previous
                </StarBorder>
                <span style={styles.pageInfo}>Page {currentPage + 1} of {totalPages}</span>
                <StarBorder onClick={() => fetchAllAlumni(currentPage + 1)} disabled={currentPage >= totalPages - 1 || loading}>
                  Next
                </StarBorder>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  dashboardContainer: { display: 'flex', minHeight: 'calc(100vh - 70px)', background: 'transparent' },
  sidebar: { width: '250px', background: 'rgba(30, 41, 59, 0.95)', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', alignItems: 'center' },
  navList: { listStyle: 'none', padding: '0', margin: '20px 0', flexGrow: 1, width: '100%' },
  mainContent: { flex: 1, padding: '40px', background: 'rgba(243, 244, 246, 0.9)', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', background: 'white', padding: '20px', borderRadius: '8px' },
  input: { padding: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' },
  searchControls: { display: 'flex', gap: '10px', alignItems: 'center', background: 'white', padding: '20px', borderRadius: '8px' },
  resultsSection: { marginTop: '30px' },
  resultsList: { listStyle: 'none', padding: '0' },
  resultItem: { padding: '15px', borderBottom: '1px solid #ddd', background: 'white', borderRadius: '5px', marginBottom: '10px' },
  paginationControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '10px',
    background: 'white',
    borderRadius: '8px',
  },
  pageInfo: {
    fontWeight: 'bold',
    fontSize: '16px',
  }
};

export default AdminDashboard;