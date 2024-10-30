const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Danh sách khách hàng
router.get('/', customerController.listCustomers);

// Form thêm khách hàng
router.get('/add', customerController.addCustomerForm);

// Thêm khách hàng
router.post('/add', customerController.addCustomer);

// Form chỉnh sửa khách hàng
router.get('/edit/:id', customerController.editCustomerForm);

// Chỉnh sửa khách hàng
router.post('/edit/:id', customerController.editCustomer);

// Xóa khách 
router.get('/delete/:id', customerController.deleteCustomer);
router.post('/delete/:id', customerController.deleteCustomer);

module.exports = router;
