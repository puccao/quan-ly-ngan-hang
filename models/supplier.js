const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serviceType: { type: String, required: true }, // Ví dụ: Tiền điện, Tiền nước
});

module.exports = mongoose.model('Supplier', supplierSchema);
