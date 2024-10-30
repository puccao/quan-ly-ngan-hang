const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/', billController.listBills); // Danh sách hóa đơn
router.post('/pay/:id', billController.payBill); // Thanh toán hóa đơn
router.post('/delete/:id', billController.deleteBill); // Xóa hóa đơn

module.exports = router;
