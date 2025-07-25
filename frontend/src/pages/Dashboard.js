import React, { useState } from 'react';
import StudentList from '../components/StudentList';
import RiskThresholdConfig from '../components/RiskThresholdConfig';
import AddStudentForm from '../components/AddStudentForm';

export default function Dashboard({ onSelectProfile }) {
  const [thresholdConfig, setThresholdConfig] = useState({
    absentRateThreshold: 25,
    completionRateThreshold: 50,
    failedContactsThreshold: 2
  });
  const [refresh, setRefresh] = useState(0);

  return (
    <div>
      <h2>Dashboard</h2>
      <AddStudentForm onAdded={() => setRefresh(r => r + 1)} />
      <RiskThresholdConfig config={thresholdConfig} onChange={setThresholdConfig} />
      <StudentList onSelect={onSelectProfile} refresh={refresh} />
    </div>
  );
} 