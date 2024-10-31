const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// Hiển thị trang đăng nhập
router.get('/', (req, res) => {
    res.render('login/login');
});

// Xử lý đăng nhập
router.post('/', async (req, res) => {
    const { username, password } = req.body; 
    const employee = await Employee.findOne({ username, password }); 

    if (employee) {
        req.session.employeeId = employee._id; // Lưu ID của employee vào session
        res.redirect('/'); 
    } else {
        res.redirect('/login'); 
    }
});

module.exports = router;
