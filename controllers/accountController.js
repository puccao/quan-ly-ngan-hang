const Account = require('../models/account');
const Customer = require('../models/customer');

exports.listAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate('customerId'); 
        res.render('accounts/accountList', { accounts });
    } catch (error) {
        console.error(error);
        res.status(500).send("Có lỗi xảy ra trong quá trình lấy danh sách tài khoản.");
    }
};

exports.editAccountForm = async (req, res) => {
    const account = await Account.findById(req.params.id).populate('customerId');
    res.render('accounts/editAccount', { account });
};

exports.editAccount = async (req, res) => {
    await Account.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/accounts');
};

exports.deleteAccount = async (req, res) => {
    await Account.findByIdAndDelete(req.params.id);
    res.redirect('/accounts');
};

exports.depositForm = async (req, res) => {
    const account = await Account.findById(req.params.id);
    res.render('accounts/deposit', { account });
};

exports.deposit = async (req, res) => {
    const account = await Account.findById(req.params.id);
    account.balance += parseFloat(req.body.amount); // Nạp tiền vào tài khoản
    await account.save();
    res.redirect('/accounts');
};

exports.withdrawForm = async (req, res) => {
    const account = await Account.findById(req.params.id);
    res.render('accounts/withdraw', { account });
};

exports.withdraw = async (req, res) => {
    const account = await Account.findById(req.params.id);
    const amount = parseFloat(req.body.amount);
    if (account.balance >= amount) {
        account.balance -= amount; // Rút tiền khỏi tài khoản
        await account.save();
    } else {
        req.flash('error', 'Số dư không đủ để thực hiện giao dịch!');
    }
    res.redirect('/accounts');
};

exports.transferForm = async (req, res) => {
    const accountId = req.params.id; // ID của tài khoản gửi
    const account = await Account.findById(accountId).populate('customerId'); // Tìm tài khoản gửi

    const allAccounts = await Account.find().populate('customerId'); // Lấy tất cả tài khoản

    if (!account) {
        return res.status(404).send('Tài khoản không tồn tại');
    }

    res.render('accounts/transfer', { account, allAccounts }); 
};


exports.transfer = async (req, res) => {
    console.log('Body:', req.body); // Kiểm tra dữ liệu nhận được
    const sourceAccountId = req.params.id; // ID của tài khoản gửi
    const targetAccountId = req.body.targetAccountId; // ID của tài khoản nhận
    const amount = parseFloat(req.body.amount); // Số tiền cần chuyển

    // Tìm tài khoản gửi và tài khoản nhận
    const sourceAccount = await Account.findById(sourceAccountId);
    const targetAccount = await Account.findById(targetAccountId);

    // Kiểm tra tài khoản gửi và nhận
    if (!sourceAccount || !targetAccount) {
        return res.status(404).send('Tài khoản không tồn tại');
    }

    // Kiểm tra số dư
    if (sourceAccount.balance < amount) {
        return res.status(400).send('Số tiền chuyển vượt quá số dư');
    }

    // Cập nhật số dư tài khoản
    sourceAccount.balance -= amount; // Trừ số tiền từ tài khoản gửi
    targetAccount.balance += amount; // Cộng số tiền vào tài khoản nhận

    // Lưu lại thay đổi
    await sourceAccount.save();
    await targetAccount.save();

    res.redirect('/accounts'); 
};

