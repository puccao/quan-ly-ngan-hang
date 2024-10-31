const Bill = require('../models/bill');
const Customer = require('../models/customer');
const Account = require('../models/account'); 


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
        // Tìm hóa đơn và kiểm tra sự tồn tại
        const bill = await Bill.findById(id).populate('customerId');
        if (!bill) {
            return res.status(404).send("Không tìm thấy hóa đơn.");
        }

        // Tìm tài khoản của khách hàng
        const account = await Account.findOne({ _id: bill.customerId.account });
        if (!account) {
            console.error('Không tìm thấy tài khoản cho khách hàng:', bill.customerId._id);
            return res.status(404).send("Không tìm thấy tài khoản của khách hàng.");
        }

        // Kiểm tra số dư trước khi trừ tiền
        if (account.balance < bill.billAmount) {
            console.error('Số dư không đủ cho tài khoản:', account._id);
            return res.render('error/InsufficientBalance'); 
        }

        // Trừ tiền vào tài khoản
        account.balance -= bill.billAmount;

        // Cập nhật trạng thái hóa đơn
        await Bill.findByIdAndUpdate(id, { status: 'Paid' });

        // Lưu lại thay đổi tài khoản
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
        res.redirect('/bills'); 
    } catch (error) {
        console.error('Error deleting bill:', error);
        res.status(500).send('Error deleting bill');
    }
};
