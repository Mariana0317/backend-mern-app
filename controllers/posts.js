import express from "express";
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

const router = express.Router();

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    console.log(postMessages);

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i"); //queremos obtener todos los resultados que coincidan con el termino ingresado en la busqueda. lo convertimo a una expresion regular por que es mas facil para mongodb

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    }); //encuentra todas las publicacione que coincidan con uno de esos dos criterios, el primero es el titulo que lo escribimos en el frontend, y el segundo es una etiqueta en el array de etiquetas que coincida con nuestra busqueda, si es elcaso queremos mostrar esas publicaciones

    res.json({ data: posts }); //lo enviamos al frontend
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();
    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatePost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );

  res.json(updatePost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post delete succefully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticaded" }); //esto pregunta si el usuario esta autenticado y si no esta autenticado muestra un mensaje

  if (!mongoose.Types.ObjectId.isValid(id))
    //aqui chequeamos la publicacion que quiere dar like
    return res.status(404).send("No post with that id");

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId)); //

  if (index === -1) {
    //si el id del usuario no se encuentra arriba de esta linea este va a ser un like
    post.likes.push(req.userId);
  } else {
    //aqui borramos el like si la habia dado like entonces es un dislike
    post.likes = post.likes.filter((id) => id !== String(req.userId)); //y esto va a obtener un array de todos los likes ademas del usuario actual.
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost); //aqui obtenemos la publicacion acutalizada con el like o el dislike
};
