const express = require('express');
const router = express.Router();

// Route hiển thị trang chọn người chat
router.get('/', (req, res) => {
    res.render('chat/index'); // Render trang chat index
});

module.exports = router;
