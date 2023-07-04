const PostModel = require('../models/post.js')

module.exports = {
    getAll: async (req, res) => {
        try {
            const posts = await PostModel.find().populate('user').exec();
            res.json(posts)
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed to get'
            })
        }
    },
    getOne: async (req, res) => {
        try {
            const postId = req.params.id;

            const post = await PostModel.findOneAndUpdate(
                {
                    _id: postId,
                },
                {
                    $inc: { viewsCount: 1 },
                },
                {
                    returnDocument: 'after',
                },
            )
            res.json(post)
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed to get'
            })
        }
    },
    create: async (req, res) => {
        try {
            const newPost = await new PostModel({
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }).save();

            res.json(newPost)
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed to create'
            })
        }
    },
    remove: async (req, res) => {
        try {
            const postId = req.params.id;

            await PostModel.findOneAndDelete({
                _id: postId,
            })
            res.json('Deleted')
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed to delete'
            })
        }
    },
    update: async (req, res) => {
        try {
            const postId = req.params.id;
            await PostModel.updateOne(
                {
                    _id: postId,
                },
                {
                    title: req.body.title,
                    text: req.body.text,
                    imageUrl: req.body.imageUrl,
                    tags: req.body.tags,
                }
            )
            res.json("Updated")
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Failed to delete'
            })
        }
    }
}