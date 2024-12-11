const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.post('/create', blogController.createBlog);
router.get('/edit/:id', blogController.getEditBlog);
router.post('/edit/:id', blogController.updateBlog); 
router.post('/delete/:id', blogController.deleteBlog);

module.exports = router;
