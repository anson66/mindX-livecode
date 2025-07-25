const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api/students';
const STUDENT_ID = 'STDB';
const STUDENT_JSON_PATH = path.join(__dirname, 'student.json');
const NEW_STUDENT_PATH = path.join(__dirname, 'new_student.json');

async function testRiskAndProfile() {
  try {
    // 1. Gọi risk API cho student
    const riskRes = await axios.get(`${BASE_URL}/risk/${STUDENT_ID}`);
    console.log('Risk API result:', riskRes.data);

    // 2. Gọi profile API cho student
    const profileRes = await axios.get(`${BASE_URL}/profile/${STUDENT_ID}`);
    console.log('Profile API result:', profileRes.data);

    // 3. Đọc file student.json để kiểm tra riskLevel đã được cập nhật chưa
    let students = JSON.parse(fs.readFileSync(STUDENT_JSON_PATH, 'utf-8'));
    let student = students.find(s => s.student_id === STUDENT_ID);
    console.log('RiskLevel in student.json:', student ? student.riskLevel : 'Not found');

    // 4. Kiểm tra riskLevel có khớp không
    if (student && student.riskLevel === riskRes.data.riskLevel) {
      console.log('✅ RiskLevel updated correctly in student.json');
    } else {
      console.log('❌ RiskLevel NOT updated correctly!');
    }

    // 5. Test API calculate-risk với new_student.json
    const newStudents = JSON.parse(fs.readFileSync(NEW_STUDENT_PATH, 'utf-8'));
    const calcRes = await axios.post(`${BASE_URL}/calculate-risk`, newStudents);
    console.log('Calculate-risk API result:', calcRes.data);

    // 6. Kiểm tra riskLevel đã được lưu vào student.json cho NEW001 chưa
    students = JSON.parse(fs.readFileSync(STUDENT_JSON_PATH, 'utf-8'));
    const newStudent = students.find(s => s.student_id === 'NEW001');
    console.log('RiskLevel for NEW001 in student.json:', newStudent ? newStudent.riskLevel : 'Not found');
    if (newStudent && newStudent.riskLevel === calcRes.data[0].riskLevel) {
      console.log('✅ RiskLevel for NEW001 updated correctly in student.json');
    } else {
      console.log('❌ RiskLevel for NEW001 NOT updated correctly!');
    }
  } catch (err) {
    console.error('Test failed:', err.response ? err.response.data : err.message);
  }
}

testRiskAndProfile(); 