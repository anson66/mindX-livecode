const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api/students/calculate-risk';
const NEW_STUDENT_PATH = path.join(__dirname, 'new_student.json');

async function testCalculateRisk() {
  try {
    const students = JSON.parse(fs.readFileSync(NEW_STUDENT_PATH, 'utf-8'));
    const res = await axios.post(BASE_URL, students);
    console.log('API calculate-risk result:', res.data);
  } catch (err) {
    console.error('Test failed:', err.response ? err.response.data : err.message);
  }
}

testCalculateRisk(); 