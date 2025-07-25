import React, { useEffect, useState } from 'react';
import { getStudents } from '../services/api';
import RiskLevelBadge from './RiskLevelBadge';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export default function StudentList({ onSelect, refresh }) {
  const [students, setStudents] = useState([]);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getStudents()
      .then(data => setStudents(data))
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false));
  }, [refresh]);

  const filtered = riskFilter === 'ALL'
    ? students
    : students.filter(s => s.riskLevel === riskFilter);

  const sorted = [...filtered].sort((a, b) => {
    const ra = (a.riskLevel || '').toUpperCase();
    const rb = (b.riskLevel || '').toUpperCase();
    if (sortOrder === 'asc') return ra.localeCompare(rb);
    return rb.localeCompare(ra);
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <label>Lọc theo risk level: </label>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
          <option value='ALL'>All</option>
          <option value='LOW'>Low</option>
          <option value='MEDIUM'>Medium</option>
          <option value='HIGH'>High</option>
        </select>
        <label>Sắp xếp risk level: </label>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value='asc'>A-Z</option>
          <option value='desc'>Z-A</option>
        </select>
      </div>
      <table border="1" cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Student ID</th><th>Name</th><th>Risk Level</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(s => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.student_name}</td>
              <td><RiskLevelBadge level={s.riskLevel} /></td>
              <td><button onClick={() => onSelect(s.student_id)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 