const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.index = async (req, res, next) => {
    try {
        // TODO i have to get the user's friends
        const user = await User.findById(req.params.id)
        const posts = await Post.find({ author: user }).populate('comments');

        res.json({ user, posts });
    } catch (err) {
        return next(err);
    }
};