const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serviceType: { type: String, required: true }, 
});

module.exports = mongoose.model('Supplier', supplierSchema);
