import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={{maxWidth: 900, margin: '0 auto', padding: 24}}>
      <h1>Student Dropout Risk Dashboard</h1>
      {selectedId ? (
        <ProfilePage studentId={selectedId} onBack={() => setSelectedId(null)} />
      ) : (
        <Dashboard onSelectProfile={setSelectedId} />
      )}
    </div>
  );
}

export default App;