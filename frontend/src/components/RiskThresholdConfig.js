import React, { useState } from 'react';

export default function RiskThresholdConfig({ config, onChange }) {
  const [localConfig, setLocalConfig] = useState(config || {
    absentRateThreshold: 25,
    completionRateThreshold: 50,
    failedContactsThreshold: 2
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setLocalConfig(cfg => ({ ...cfg, [name]: Number(value) }));
  };

  const handleApply = () => {
    if (onChange) onChange(localConfig);
  };

  return (
    <div style={{margin: '16px 0', padding: 12, border: '1px solid #ccc', borderRadius: 8}}>
      <h4>Cấu hình ngưỡng risk</h4>
      <div>
        <label>Tỉ lệ vắng mặt (%): </label>
        <input type="number" name="absentRateThreshold" value={localConfig.absentRateThreshold} onChange={handleChange} min={0} max={100} />
      </div>
      <div>
        <label>Tỉ lệ hoàn thành bài tập (%): </label>
        <input type="number" name="completionRateThreshold" value={localConfig.completionRateThreshold} onChange={handleChange} min={0} max={100} />
      </div>
      <div>
        <label>Số lần liên hệ thất bại: </label>
        <input type="number" name="failedContactsThreshold" value={localConfig.failedContactsThreshold} onChange={handleChange} min={0} />
      </div>
      <button style={{marginTop: 8}} onClick={handleApply}>Áp dụng</button>
    </div>
  );
} 