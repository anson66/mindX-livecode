import React, { useEffect, useState } from 'react';
import { getStudentProfile } from '../services/api';
import RiskLevelBadge from './RiskLevelBadge';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export default function StudentProfile({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    getStudentProfile(studentId)
      .then(data => setStudent(data))
      .catch(() => setError('Không tìm thấy học sinh!'))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!student) return null;

  return (
    <div style={{padding: 20}}>
      <button onClick={onBack}>&larr; Quay lại</button>
      <h2>Thông tin học sinh</h2>
      <p><b>ID:</b> {student.student_id}</p>
      <p><b>Tên:</b> {student.student_name}</p>
      <p><b>Risk Level:</b> <RiskLevelBadge level={student.riskLevel} /></p>
      <h4>Attendance</h4>
      <ul>
        {student.attendance && student.attendance.map((a, i) => (
          <li key={i}>{a.date}: {a.status}</li>
        ))}
      </ul>
      <h4>Assignments</h4>
      <ul>
        {student.assignments && student.assignments.map((a, i) => (
          <li key={i}>{a.date} - {a.name}: {a.submitted ? 'Đã nộp' : 'Chưa nộp'}</li>
        ))}
      </ul>
      <h4>Contacts</h4>
      <ul>
        {student.contacts && student.contacts.map((c, i) => (
          <li key={i}>{c.date}: {c.status}</li>
        ))}
      </ul>
    </div>
  );
} 