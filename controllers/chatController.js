// controllers/chatController.js
exports.chatView = (req, res) => {
    const { senderId, receiverId } = req.params;
    res.render('chat', { senderId, receiverId });
};
