const express = require('express');
const postController = require('../controllers/postController');

const router = express.router();

router.get('/', postController.showAddPostForm);

router.get('/add', postController.showAddPostForm);
router.post('/add', postController.addPost);

module.exports = router;