const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Trang danh sách nhà cung cấp
router.get('/', supplierController.listSuppliers);

// Thêm nhà cung cấp
router.get('/add', supplierController.addSupplierForm);
router.post('/add', supplierController.addSupplier);

// Xóa nhà cung cấp
router.get('/delete/:id', supplierController.deleteSupplier);
router.post('/delete/:id', supplierController.deleteSupplier);

// Tạo hóa đơn từ nhà cung cấp cho khách hàng
router.get('/:id/createBill', supplierController.createBillForm);
router.post('/:id/createBill', supplierController.createBill);

module.exports = router;
