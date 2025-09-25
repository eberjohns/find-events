import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { token } = useAuth();
  const [pendingColleges, setPendingColleges] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allColleges, setAllColleges] = useState([]);
  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('http://127.0.0.1:8000/admin/colleges/pending/', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/colleges/', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
    ])
      .then(([colleges, users, allColleges]) => {
        setPendingColleges(colleges);
        setUsers(users);
        setAllColleges(allColleges);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load admin data.');
        setLoading(false);
      });
  }, [token]);

  const approveCollege = async (collegeId) => {
    await fetch(`http://127.0.0.1:8000/admin/colleges/${collegeId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingColleges(pendingColleges.filter(c => c.id !== collegeId));
    // Refresh allColleges after approval
    fetch('http://127.0.0.1:8000/colleges/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAllColleges);
  };

  const assignRep = async (userId, collegeId) => {
    await fetch(`http://127.0.0.1:8000/admin/users/${userId}/assign-rep`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ college_id: collegeId }),
    });
    // Optionally update UI
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Pending Colleges</h3>
      <ul>
        {pendingColleges.map(college => (
          <li key={college.id}>
            {college.name} ({college.location})
            <button onClick={() => approveCollege(college.id)}>Approve</button>
          </li>
        ))}
      </ul>
      <h3>All Colleges</h3>
      <ul>
        {allColleges.map(college => (
          <li key={college.id}>
            {college.name} ({college.location}) - {college.is_approved ? 'Approved' : 'Pending'}
          </li>
        ))}
      </ul>
      <h3>Assign Rep Role</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email} (role: {user.role})
            <select id={`college-${user.id}`} defaultValue="">
              <option value="" disabled>Select college</option>
              {allColleges.map(college => (
                <option key={college.id} value={college.id}>
                  {college.name} ({college.location})
                </option>
              ))}
            </select>
            <button onClick={() => {
              const collegeId = document.getElementById(`college-${user.id}`).value;
              if (collegeId) assignRep(user.id, collegeId);
            }}>Assign Rep</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;