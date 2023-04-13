import Post from "../models/Post.js";
import User from "../models/User.js";

// ✅✅✅ Create Operation 
 export const createPost = async (req, res) => {

    try {
        const { userId, description, picturePath } = req.body;

        // get user info from databases
        const user = await User.findById(userId);

        // new Post create...
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });
 
        // save new Post at database...
        await newPost.save();

        // get all Posts from database & return to the frontend...
        const post = await Post.find();

        // successfully created | 201
        res.status(201).json(post);
        
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};


export const deleteUserPost = async (req, res) => {

    const { postId } = req.params;

    try {
        await Post.findByIdAndRemove(postId);
        res.status(200).json({ message: 'Post Deleted Successfully' });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getFeedPosts = async (req, res) => {

    try {
        const allPost = await Post.find();

        // successfully get request | 200
        res.status(200).json(allPost);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {

    try {
        const { userId } = req.params;

        const userPosts = await Post.find({ userId });

        // successfully get request | 200
        res.status(200).json(userPosts);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const likePost = async (req, res) => {

    try {
        const { id } = req.params;
        const { userId } = req.body;

        // grabbing the post information...
        const post = await Post.findById(id);

        // grabbing the user, like it OR not...
        const isLiked = post.likes.get(userId);

        isLiked
            ? post.likes.delete(userId)     // have like | ⛔ can delete like...
            : post.likes.set(userId, true); // not like  | ✅ can add like...

        // 🟨 updating post like property...
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        // & send this updatedPost at the frontend...
        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};