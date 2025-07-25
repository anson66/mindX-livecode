// Core xử lý thông tin học sinh - Backend Processing
function processStudentRiskAssessment(studentData, config = {}) {
    // Cấu hình các ngưỡng có thể thay đổi
    const {
        absentRateThreshold = 25,          // Ngưỡng tỷ lệ vắng mặt (%)
        completionRateThreshold = 50,      // Ngưỡng tỷ lệ hoàn thành bài tập (%)
        failedContactsThreshold = 2,       // Ngưỡng số lần liên lạc thất bại
        lowRiskRange = [0, 1],            // Khoảng điểm cho LOW risk [min, max]
        mediumRiskScore = 2,              // Điểm cho MEDIUM risk
        highRiskScore = 3                 // Điểm bắt đầu HIGH risk
    } = config;
    
    console.log("=== STUDENT RISK ASSESSMENT RESULTS ===");
    console.log(`Configuration: Absent≥${absentRateThreshold}%, Completion<${completionRateThreshold}%, FailedContacts≥${failedContactsThreshold}`);
    console.log(`Risk Levels: LOW(${lowRiskRange[0]}-${lowRiskRange[1]}), MEDIUM(${mediumRiskScore}), HIGH(${highRiskScore}+)\n`);
    console.log("Student ID\tScore\tRisk Level\tNote (optional)");
    console.log("--------------------------------------------------------");
    
    const results = [];
    
    studentData.forEach(student => {
        let score = 0;
        let notes = [];
        
        // Tính tỷ lệ vắng mặt (absent rate)
        const totalDays = student.attendance.length;
        const absentDays = student.attendance.filter(day => day.status === "ABSENT").length;
        const absentRate = (absentDays / totalDays) * 100;
        
        // Kiểm tra điều kiện attendance >= ngưỡng vắng mặt
        if (absentRate >= absentRateThreshold) {
            score += 1;
            notes.push("attendance");
        }
        
        // Tính tỷ lệ hoàn thành bài tập
        const totalAssignments = student.assignments.length;
        const completedAssignments = student.assignments.filter(hw => hw.submitted === true).length;
        const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
        
        // Kiểm tra điều kiện assignments < ngưỡng hoàn thành
        if (completionRate < completionRateThreshold) {
            score += 1;
            notes.push("assignments");
        }
        
        // Đếm số lần liên hệ không phản hồi
        const failedContacts = student.contacts.filter(contact => contact.status === "FAILED").length;
        
        // Kiểm tra điều kiện >= ngưỡng lần không phản hồi
        if (failedContacts >= failedContactsThreshold) {
            score += 1;
            notes.push("communication risk factors");
        }
        
        // Xác định mức độ rủi ro dựa trên cấu hình
        let riskLevel;
        if (score >= lowRiskRange[0] && score <= lowRiskRange[1]) {
            riskLevel = "LOW";
        } else if (score === mediumRiskScore) {
            riskLevel = "MEDIUM";
        } else if (score >= highRiskScore) {
            riskLevel = "HIGH";
        } else {
            // Fallback cho trường hợp không khớp
            riskLevel = "UNKNOWN";
        }
        
        // Tạo note string
        let noteString;
        if (notes.length === 0) {
            noteString = "No signs of disengagement detected";
        } else {
            noteString = notes.join(", ");
        }
        
        // Lưu kết quả
        const result = {
            studentId: student.student_id,
            score: score,
            riskLevel: riskLevel,
            note: noteString,
            // Thông tin chi tiết để debug
            details: {
                absentRate: absentRate.toFixed(1) + "%",
                completionRate: completionRate.toFixed(1) + "%",
                failedContacts: failedContacts
            }
        };
        
        results.push(result);
        
        // In ra console
        console.log(`${result.studentId}\t\t${result.score}\t${result.riskLevel}\t\t${result.note}`);
    });
    
    console.log("\n=== DETAILED BREAKDOWN ===");
    results.forEach(result => {
        console.log(`\n${result.studentId}:`);
        console.log(`  - Absent Rate: ${result.details.absentRate}`);
        console.log(`  - Assignment Completion: ${result.details.completionRate}`);
        console.log(`  - Failed Contacts: ${result.details.failedContacts}`);
        console.log(`  - Risk Score: ${result.score}`);
        console.log(`  - Risk Level: ${result.riskLevel}`);
        console.log(`  - Notes: ${result.note}`);
    });
    
    return results;
}

// Sample data để test
const sampleStudentData = [
    {
        "student_id": "STDA",
        "student_name": "Student A",
        "attendance": [
            { "date": "2025-06-01", "status": "ATTEND" },
            { "date": "2025-06-02", "status": "ATTEND" },
            { "date": "2025-06-03", "status": "ABSENT" },
            { "date": "2025-06-04", "status": "ATTEND" },
            { "date": "2025-06-05", "status": "ATTEND" },
            { "date": "2025-06-06", "status": "ATTEND" },
            { "date": "2025-06-07", "status": "ATTEND" },
            { "date": "2025-06-08", "status": "ATTEND" },
            { "date": "2025-06-09", "status": "ATTEND" },
            { "date": "2025-06-10", "status": "ATTEND" },
            { "date": "2025-06-11", "status": "ATTEND" },
            { "date": "2025-06-12", "status": "ATTEND" },
            { "date": "2025-06-13", "status": "ATTEND" },
            { "date": "2025-06-14", "status": "ATTEND" },
            { "date": "2025-06-15", "status": "ATTEND" },
            { "date": "2025-06-16", "status": "ATTEND" }
        ],
        "assignments": [
            { "date": "2025-06-01", "name": "HW 1", "submitted": true },
            { "date": "2025-06-08", "name": "HW 2", "submitted": true }
        ],
        "contacts": []
    },
    {
        "student_id": "STDB",
        "student_name": "Student B",
        "attendance": [
            { "date": "2025-06-01", "status": "ATTEND" },
            { "date": "2025-06-02", "status": "ABSENT" },
            { "date": "2025-06-03", "status": "ATTEND" },
            { "date": "2025-06-04", "status": "ABSENT" },
            { "date": "2025-06-05", "status": "ATTEND" },
            { "date": "2025-06-06", "status": "ABSENT" },
            { "date": "2025-06-07", "status": "ATTEND" },
            { "date": "2025-06-08", "status": "ABSENT" },
            { "date": "2025-06-09", "status": "ATTEND" },
            { "date": "2025-06-10", "status": "ATTEND" },
            { "date": "2025-06-11", "status": "ATTEND" },
            { "date": "2025-06-12", "status": "ABSENT" },
            { "date": "2025-06-13", "status": "ABSENT" },
            { "date": "2025-06-14", "status": "ABSENT" },
            { "date": "2025-06-15", "status": "ATTEND" },
            { "date": "2025-06-16", "status": "ATTEND" }
        ],
        "assignments": [
            { "date": "2025-06-01", "name": "HW 1", "submitted": true },
            { "date": "2025-06-08", "name": "HW 2", "submitted": false }
        ],
        "contacts": [
            { "date": "2025-06-20", "status": "FAILED" },
            { "date": "2025-06-22", "status": "FAILED" }
        ]
    },
    {
        "student_id": "STDC",
        "student_name": "Student C",
        "attendance": [
            { "date": "2025-06-01", "status": "ABSENT" },
            { "date": "2025-06-02", "status": "ATTEND" },
            { "date": "2025-06-03", "status": "ATTEND" },
            { "date": "2025-06-04", "status": "ABSENT" },
            { "date": "2025-06-05", "status": "ATTEND" },
            { "date": "2025-06-06", "status": "ATTEND" },
            { "date": "2025-06-07", "status": "ATTEND" },
            { "date": "2025-06-08", "status": "ABSENT" },
            { "date": "2025-06-09", "status": "ATTEND" },
            { "date": "2025-06-10", "status": "ABSENT" },
            { "date": "2025-06-11", "status": "ATTEND" },
            { "date": "2025-06-12", "status": "ABSENT" },
            { "date": "2025-06-13", "status": "ATTEND" },
            { "date": "2025-06-14", "status": "ATTEND" },
            { "date": "2025-06-15", "status": "ATTEND" },
            { "date": "2025-06-16", "status": "ATTEND" }
        ],
        "assignments": [
            { "date": "2025-06-01", "name": "HW 1", "submitted": false },
            { "date": "2025-06-08", "name": "HW 2", "submitted": false }
        ],
        "contacts": [
            { "date": "2025-06-20", "status": "FAILED" },
            { "date": "2025-06-22", "status": "FAILED" },
            { "date": "2025-06-24", "status": "FAILED" }
        ]
    }
];

// Chạy test với sample data và cấu hình mặc định
console.log("Testing with sample data (default config):");
processStudentRiskAssessment(sampleStudentData);

console.log("\n" + "=".repeat(80) + "\n");

// Chạy test với cấu hình tùy chỉnh
console.log("Testing with custom config:");
const customConfig = {
    absentRateThreshold: 30,
    completionRateThreshold: 60,
    failedContactsThreshold: 1,
    lowRiskRange: [0, 1],
    mediumRiskScore: 2,
    highRiskScore: 3
};
processStudentRiskAssessment(sampleStudentData, customConfig);

// Function để sử dụng với file JSON thực tế
function processFromFile(jsonData, config = {}) {
    try {
        const studentData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        return processStudentRiskAssessment(studentData, config);
    } catch (error) {
        console.error("Error processing JSON data:", error.message);
        return null;
    }
}

// Hàm tiện ích để tạo cấu hình nhanh
function createConfig(absentRate = 25, completionRate = 50, failedContacts = 2) {
    return {
        absentRateThreshold: absentRate,
        completionRateThreshold: completionRate,
        failedContactsThreshold: failedContacts,
        lowRiskRange: [0, 1],
        mediumRiskScore: 2,
        highRiskScore: 3
    };
}

// Ví dụ sử dụng các cấu hình khác nhau:
console.log("\n" + "=".repeat(80) + "\n");
console.log("Testing with strict config (higher thresholds):");
const strictConfig = createConfig(20, 70, 1);
processStudentRiskAssessment(sampleStudentData, strictConfig);

// Export functions để sử dụng trong môi trường khác
module.exports = { processStudentRiskAssessment };