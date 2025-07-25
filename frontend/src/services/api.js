import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/students';

export async function getStudents() {
  const res = await axios.get(`${API_BASE}`);
  return res.data;
}

export async function getStudentProfile(studentId) {
  const res = await axios.get(`${API_BASE}/profile/${studentId}`);
  return res.data;
}

export async function getRiskList() {
  const res = await axios.get(`${API_BASE}/risk`);
  return res.data;
}

export async function calculateRisk(students, config) {
  // config là optional, nếu có thì gửi kèm
  const url = `${API_BASE}/calculate-risk`;
  const res = await axios.post(url, students, config ? { params: config } : {});
  return res.data;
}