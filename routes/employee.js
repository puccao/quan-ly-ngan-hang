const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Hiển thị danh sách nhân viên
router.get('/', employeeController.listEmployees);

// Thêm nhân viên
router.get('/add', employeeController.addEmployeeForm);
router.post('/add', employeeController.addEmployee);

// Sửa nhân viên
router.get('/edit/:id', employeeController.editEmployeeForm);
router.post('/edit/:id', employeeController.editEmployee);

// Xóa nhân viên
router.get('/delete/:id', employeeController.deleteEmployee);
router.post('/delete/:id', employeeController.deleteEmployee);

module.exports = router;
