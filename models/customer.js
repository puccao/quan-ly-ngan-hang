const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    idCard: {
        type: String,
        required: true
    },
    balance: { type: Number, default: 0 },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account' // Tham chiếu đến mô hình Account
    }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
