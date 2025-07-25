const express = require('express');
const fs = require('fs');
const path = require('path');
const { processStudentRiskAssessment } = require('../Student');

const router = express.Router();

// Đọc dữ liệu từ file student.json
function getStudentData() {
  const dataPath = path.join(__dirname, '../student.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

const updateStudentRiskLevel = (studentId, riskLevel) => {
  const dataPath = path.join(__dirname, '../student.json');
  const students = getStudentData();
  const idx = students.findIndex(s => s.student_id === studentId);
  if (idx !== -1) {
    students[idx].riskLevel = riskLevel;
    fs.writeFileSync(dataPath, JSON.stringify(students, null, 2), 'utf-8');
  }
};

// GET /api/students/risk - Danh sách risk assessment
router.get('/risk', (req, res) => {
  const students = getStudentData();
  const results = processStudentRiskAssessment(students);
  res.json(results);
});

// GET /api/students/risk/:id - Risk assessment cho 1 học sinh
router.get('/risk/:id', (req, res) => {
  const students = getStudentData();
  const results = processStudentRiskAssessment(students);
  const student = results.find(s => s.studentId === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  // Lưu riskLevel vào student profile
  updateStudentRiskLevel(student.studentId, student.riskLevel);
  res.json(student);
});

// POST /api/students/risk - Đánh giá risk từ body (json)
router.post('/risk', (req, res) => {
  const students = req.body;
  const results = processStudentRiskAssessment(students);
  res.json(results);
});

// POST /api/students/calculate-risk - Tính riskLevel cho 1 student hoặc mảng student và lưu vào student.json
router.post('/calculate-risk', (req, res) => {
  let students = req.body;
  if (!Array.isArray(students)) students = [students];
  const results = processStudentRiskAssessment(students);

  // Đọc danh sách hiện tại
  const dataPath = path.join(__dirname, '../student.json');
  let currentList = getStudentData();
  let updated = false;

  results.forEach(result => {
    const idx = currentList.findIndex(s => s.student_id === result.studentId);
    if (idx !== -1) {
      // Cập nhật riskLevel
      currentList[idx].riskLevel = result.riskLevel;
      updated = true;
    } else {
      // Thêm mới student (dùng dữ liệu gốc + riskLevel)
      const original = students.find(s => s.student_id === result.studentId);
      if (original) {
        currentList.push({ ...original, riskLevel: result.riskLevel });
        updated = true;
      }
    }
  });
  if (updated) {
    fs.writeFileSync(dataPath, JSON.stringify(currentList, null, 2), 'utf-8');
  }

  res.json(results.length === 1 ? results[0] : results);
});

// GET /api/students - Danh sách tất cả học sinh (gốc)
router.get('/', (req, res) => {
  const students = getStudentData();
  res.json(students);
});

// GET /api/students/profile - Danh sách profile học sinh
router.get('/profile', (req, res) => {
  const students = getStudentData();
  res.json(students);
});

// GET /api/students/profile/:id - Profile của 1 học sinh
router.get('/profile/:id', (req, res) => {
  const students = getStudentData();
  const student = students.find(s => s.student_id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

module.exports = router; 