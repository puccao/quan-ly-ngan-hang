const Customer = require('../models/customer');
const Account = require('../models/account');

// Lấy danh sách khách hàng
exports.listCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('account'); 
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

    // Tạo số tài khoản ngẫu nhiên
    const accountNumber = `ACC${Math.floor(100000 + Math.random() * 900000)}`; 

    try {
        // Tạo tài khoản mới trước
        const newAccount = await Account.create({ 
            accountNumber: accountNumber, 
            balance: 0 
        });

        // Tạo khách hàng mới và gán ID tài khoản vào khách hàng
        const newCustomer = await Customer.create({ 
            name, 
            phoneNumber, 
            idCard,
            account: newAccount._id 
        });

        // Cập nhật customerId cho tài khoản
        newAccount.customerId = newCustomer._id; // Gán ID khách hàng cho tài khoản
        await newAccount.save(); // Lưu tài khoản với customerId mới

        res.redirect('/customers');
    } catch (error) {
        console.error(error);
        res.status(500).send("Có lỗi xảy ra trong quá trình thêm khách hàng.");
    }
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
