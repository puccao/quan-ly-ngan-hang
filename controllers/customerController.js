const Customer = require('../models/customer');
const Account = require('../models/account');

// Lấy danh sách khách hàng
exports.listCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('account'); // Sử dụng populate để lấy thông tin tài khoản
        res.render('customers/customerList', { customers });
    } catch (error) {
        console.error(error);
        res.status(500).send('Đã có lỗi xảy ra.');
    }
};

// Form thêm khách hàng
exports.addCustomerForm = (req, res) => {
    res.render('customers/addCustomer');
};

// Thêm khách hàng
exports.addCustomer = async (req, res) => {
    const { name, phoneNumber, idCard } = req.body;

    // Tạo khách hàng mới
    const newCustomer = await Customer.create({ name, phoneNumber, idCard });

    // Tạo số tài khoản ngẫu nhiên
    const accountNumber = `ACC${Math.floor(100000 + Math.random() * 900000)}`; // Tạo số tài khoản ngẫu nhiên

    // Tạo tài khoản mới cho khách hàng
    const newAccount = await Account.create({ accountNumber: accountNumber, balance: 0, customer: newCustomer._id });

    // Cập nhật thông tin tài khoản vào khách hàng
    newCustomer.account = newAccount._id; // Gán tài khoản cho khách hàng
    await newCustomer.save(); // Lưu lại khách hàng với thông tin tài khoản

    res.redirect('/customers');
};

// Form chỉnh sửa khách hàng
exports.editCustomerForm = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    res.render('customers/editCustomer', { customer });
};

// Chỉnh sửa khách hàng
exports.editCustomer = async (req, res) => {
    await Customer.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/customers');
};

// Xóa khách hàng
exports.deleteCustomer = async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id);
    res.redirect('/customers');
};
