// controllers/messageController.js
const Message = require('../models/message');

exports.getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy tin nhắn' });
    }
};
