const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Hiển thị danh sách tài khoản
router.get('/', accountController.listAccounts);

// Thêm tài khoản (nếu cần)
// router.get('/add', accountController.addAccountForm);
// router.post('/add', accountController.addAccount);

// Sửa tài khoản
router.get('/edit/:id', accountController.editAccountForm);
router.post('/edit/:id', accountController.editAccount);

// Xóa tài khoản
router.get('/delete/:id', accountController.deleteAccount);
router.post('/delete/:id', accountController.deleteAccount);

// Các chức năng rút tiền, nạp tiền, chuyển tiền
router.get('/deposit/:id', accountController.depositForm);
router.post('/deposit/:id', accountController.deposit);
router.get('/withdraw/:id', accountController.withdrawForm);
router.post('/withdraw/:id', accountController.withdraw);
// Route để hiển thị form chuyển tiền
router.get('/transfer/:id', accountController.transferForm);

// Route để xử lý chuyển tiền
router.post('/transfer/:id', accountController.transfer);
module.exports = router;
