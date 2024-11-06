const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Employee = require('../models/employee');

// Xử lý đăng nhập
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm employee theo username
        const employee = await Employee.findOne({ username });

        if (!employee) {
            return res.status(401).send('Tên đăng nhập không chính xác.');
        }

        // So sánh mật khẩu đã mã hóa với mật khẩu người dùng nhập vào
        const isMatch = await bcrypt.compare(password, employee.password);

        if (!isMatch) {
            return res.status(401).send('Mật khẩu không chính xác.');
        }

        // Lưu ID nhân viên vào session
        req.session.employeeId = employee._id;

        // Chuyển hướng đến trang chính sau khi đăng nhập thành công
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Lỗi server.');
    }
});

module.exports = router;
