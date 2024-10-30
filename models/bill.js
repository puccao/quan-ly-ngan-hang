const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    serviceType: String,
    billAmount: Number,
    status: { type: String, default: 'Pending' } // Có thể là 'Pending', 'Paid'
});

module.exports = mongoose.model('Bill', billSchema);
