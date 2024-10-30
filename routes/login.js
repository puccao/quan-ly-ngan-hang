const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// Hiển thị trang đăng nhập
router.get('/', (req, res) => {
    res.render('login/login');
});

// Xử lý đăng nhập
router.post('/', async (req, res) => {
    const { username, password } = req.body; // Lấy username và password từ form
    const employee = await Employee.findOne({ username, password }); // Tìm employee

    if (employee) {
        req.session.employeeId = employee._id; // Lưu ID của employee vào session
        res.redirect('/'); // Chuyển hướng đến trang chính
    } else {
        res.redirect('/login'); // Nếu không tìm thấy, quay lại trang login
    }
});

module.exports = router;
