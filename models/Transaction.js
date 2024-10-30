const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Success' } // 'Success', 'Failed', 'Pending'
}, {
    timestamps: true // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('Transaction', transactionSchema);
