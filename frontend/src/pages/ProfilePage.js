import React from 'react';
import StudentProfile from '../components/StudentProfile';

export default function ProfilePage({ studentId, onBack }) {
  if (!studentId) return null;
  return (
    <div>
      <StudentProfile studentId={studentId} onBack={onBack} />
    </div>
  );
} 