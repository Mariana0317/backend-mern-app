import express from "express";

import { getPostsBySearch, getPosts, getPost, createPost, updatePost, deletePost, likePost } from "../controllers/posts.js";

const router = express.Router();
import auth from "../middleware/auth.js"; //importamos middleware

router.get('/search', getPostsBySearch)
router.get("/", getPosts);
router.get('/:id', getPost)
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/likePost', likePost);

export default router;
