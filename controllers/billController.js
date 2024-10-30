const Bill = require('../models/bill');
const Customer = require('../models/customer');
const Account = require('../models/account'); // Thay đổi đường dẫn nếu cần


exports.listBills = async (req, res) => {
    try {
        const bills = await Bill.find({})
            .populate('customerId')
            .populate('supplier');
        console.log(bills); // In ra danh sách hóa đơn để kiểm tra
        res.render('bills/billList', { bills });
    } catch (error) {
        console.error('Error retrieving bills:', error);
        res.status(500).send('Error retrieving bills');
    }
};


// Thêm phương thức thanh toán
exports.payBill = async (req, res) => {
    const { id } = req.params;

    try {
        // Cập nhật trạng thái hóa đơn
        await Bill.findByIdAndUpdate(id, { status: 'Paid' });

        // Tìm hóa đơn để lấy thông tin khách hàng
        const bill = await Bill.findById(id).populate('customerId');

        // Tìm tài khoản của khách hàng
        const account = await Account.findOne({ customer: bill.customerId._id });

        // Trừ tiền vào tài khoản
        account.balance -= bill.billAmount;

        // Kiểm tra số dư
        if (account.balance < 0) {
            console.error('Insufficient balance for account:', account._id);
            return res.render('error/InsufficientBalance');
        }

        // Lưu lại thay đổi
        await account.save();

        res.redirect('/bills');
    } catch (error) {
        console.error('Error during bill payment:', error);
        res.status(500).send('Error during bill payment');
    }
};

// Thêm phương thức xóa hóa đơn
exports.deleteBill = async (req, res) => {
    const { id } = req.params;
    try {
        await Bill.findByIdAndDelete(id);
        res.redirect('/bills'); // Chuyển hướng về danh sách hóa đơn
    } catch (error) {
        console.error('Error deleting bill:', error);
        res.status(500).send('Error deleting bill');
    }
};
