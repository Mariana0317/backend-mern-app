import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controllers/posts.js";

const router = express.Router();
import auth from "../middleware/auth.js"; //importamos middleware

router.get("/", getPosts);//aqui no usamos la auth middleware porque cualquier usuario puede ver los post aunque no tenga cuenta pero no peude crear, likear o editar un post ahi si necesita autenticacion
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

export default router;
