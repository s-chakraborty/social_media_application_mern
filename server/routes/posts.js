import { getFeedPosts,getUserPosts, likePost, createPost,deleteUserPost} from "../controllers/posts.js"
import verifyToken from "../middleware/auth.js";
import upload from "../storage/fileStorage.js";
import express from "express";

const router = express.Router();

// 🟩🟩🟩 Read Operation 
// * routs + middleware + endpoints logical function call

// get all post form database
router.get("/", verifyToken, getFeedPosts);

// only relevant post of the specific user
router.get("/:userId/posts", verifyToken, getUserPosts);


// ✅✅✅ create post with image uploaded system
router.post("/", verifyToken, upload.single("picture"), createPost);


// 🟨🟨🟨 Update Operation 
router.patch("/:id/like", verifyToken, likePost);


// 🟥🟥🟥 Delete Operation
router.delete("/:postId", verifyToken, deleteUserPost);


export default router;