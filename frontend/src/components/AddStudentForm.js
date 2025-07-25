import React, { useState } from 'react';
import { calculateRisk } from '../services/api';

const defaultProfile = {
  student_id: '',
  student_name: '',
  attendance: [],
  assignments: [],
  contacts: []
};

export default function AddStudentForm({ onAdded }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Simple input for attendance, assignments, contacts (CSV)
  const handleCSV = (field, value) => {
    let arr = value.split(',').map(s => s.trim()).filter(Boolean);
    if (field === 'attendance') {
      arr = arr.map(date => ({ date, status: 'ATTEND' })); // default status
    }
    if (field === 'assignments') {
      arr = arr.map(date => ({ date, name: 'HW', submitted: false }));
    }
    if (field === 'contacts') {
      arr = arr.map(date => ({ date, status: 'FAILED' }));
    }
    setProfile({ ...profile, [field]: arr });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const result = await calculateRisk(profile);
      setMsg(`Đã dự đoán riskLevel: ${result.riskLevel}`);
      if (onAdded) onAdded(result); // callback để thêm vào list
      setProfile(defaultProfile);
    } catch (err) {
      setMsg('Lỗi khi dự đoán!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{border: '1px solid #ccc', padding: 16, marginBottom: 24, borderRadius: 8}}>
      <h3>Thêm học sinh mới & dự đoán risk</h3>
      <div>
        <label>ID: </label>
        <input name="student_id" value={profile.student_id} onChange={handleChange} required />
      </div>
      <div>
        <label>Tên: </label>
        <input name="student_name" value={profile.student_name} onChange={handleChange} required />
      </div>
      <div>
        <label>Attendance (CSV ngày): </label>
        <input onChange={e => handleCSV('attendance', e.target.value)} placeholder="2025-08-01,2025-08-02" />
      </div>
      <div>
        <label>Assignments (CSV ngày): </label>
        <input onChange={e => handleCSV('assignments', e.target.value)} placeholder="2025-08-01,2025-08-08" />
      </div>
      <div>
        <label>Contacts (CSV ngày): </label>
        <input onChange={e => handleCSV('contacts', e.target.value)} placeholder="2025-08-10,2025-08-12" />
      </div>
      <button type="submit" disabled={loading}>Dự đoán & Thêm vào danh sách</button>
      {msg && <div style={{marginTop: 8, color: msg.startsWith('Lỗi') ? 'red' : 'green'}}>{msg}</div>}
    </form>
  );
} 