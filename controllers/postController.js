const Post = require('../models/post');

exports.getAllpost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.render('post/postList', { posts });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
}

exports.showAddPostForm = (req, res) => {
    res.render('post/addPost');
}

exports.addPost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const newPost = new Post({
            title,
            content,
        });

        await newPost.save();
        res.redirect('/postList')
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
}