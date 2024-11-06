const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// Route để hiển thị danh sách nhân viên cho admin chọn
router.get('/', async (req, res) => {
    try {
        // Lấy danh sách tất cả nhân viên trừ admin (đảm bảo người dùng đã đăng nhập)
        const employees = await Employee.find({ _id: { $ne: req.session.employeeId } });
        res.render('chat/index', { employees }); // Render trang chat index
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi lấy danh sách nhân viên');
    }
});

// Route chat với nhân viên cụ thể
router.get('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).send('Nhân viên không tồn tại');
        }

        // Tạo chatId duy nhất giữa admin và nhân viên (có thể là sự kết hợp của hai ID)
        const chatId = [req.session.employeeId, employeeId].sort().join('_'); // Chat ID sẽ luôn duy nhất

        res.render('chat/chat', { employee, chatId }); // Render trang chat với nhân viên cụ thể và chatId
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi lấy thông tin nhân viên');
    }
});

module.exports = router;
