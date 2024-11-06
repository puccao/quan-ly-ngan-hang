// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Nhân viên hoặc khách hàng
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
