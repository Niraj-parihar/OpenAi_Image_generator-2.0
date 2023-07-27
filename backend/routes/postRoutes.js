import express from "express";
import * as dotenv from "dotenv";
import Post from "../models/post.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

const router = new express.Router();

//cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//GET ALL POSTS
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

//Create A post
router.route("/").post(async (req, res) => {
  try {

    //coming from frontend
    const { name, prompt, photo } = req.body;
    //uploading the photo and getting the url from cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);
    //creating a new post into our database
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

export default router;
