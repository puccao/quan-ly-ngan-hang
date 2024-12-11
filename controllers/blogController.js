const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render('blog/blogList', { blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).send('Error loading blog posts');
    }
};

exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({ title, content });
        await newBlog.save();
        res.redirect('/blog');
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).send('Error creating blog post');
    }
};

// Lấy thông tin bài viết để chỉnh sửa
exports.getEditBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.render('blog/editBlog', { blog });
    } catch (error) {
        console.error('Error fetching blog for edit:', error);
        res.status(500).send('Error loading blog for edit');
    }
};

// Cập nhật bài viết
exports.updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        await Blog.findByIdAndUpdate(req.params.id, { title, content });
        res.redirect('/blog');
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).send('Error updating blog');
    }
};

// Xóa bài viết
exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/blog');
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).send('Error deleting blog');
    }
};
