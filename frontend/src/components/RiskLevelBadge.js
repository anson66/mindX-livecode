import React from 'react';

const colorMap = {
  LOW: '#4caf50',
  MEDIUM: '#ff9800',
  HIGH: '#f44336',
  UNKNOWN: '#9e9e9e'
};

export default function RiskLevelBadge({ level }) {
  const color = colorMap[level] || colorMap.UNKNOWN;
  return (
    <span style={{
      background: color,
      color: '#fff',
      padding: '2px 10px',
      borderRadius: 12,
      fontWeight: 600
    }}>{level || 'N/A'}</span>
  );
} 