const Post = require("../models/postModel");
const mongoose = require("mongoose");

// get all posts
const getAllPosts = async (req, res) => {
  const user_id = req.user._id;
  const posts = await Post.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(posts);
};

// get latest ten posts
const getLatestTenPosts = async (req, res) => {
  const page = req.query.page || 1;
  const postsPerPage = 10;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * postsPerPage)
    .limit(postsPerPage);

  res.status(200).json(posts);
};

// get a single post
const getSinglePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid post!" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ error: "No such post!" });
  }

  res.status(200).json(post);
};

// post a new post
const postNewPost = async (req, res) => {
  const { title, content } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!content) {
    emptyFields.push("content");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields!", emptyFields });
  }

  // add doc to DB
  try {
    const user_id = req.user._id;
    const post = await Post.create({ title, content, user_id });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a single post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid!" });
  }

  const post = await Post.findOneAndDelete({ _id: id });

  if (!post) {
    return res.status(400).json({ error: "No such post!" });
  }

  res.status(200).json(post);
};

// update a single post
const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid post!" });
  }

  const post = await Post.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!post) {
    return res.status(400).json({ error: "No such post!" });
  }

  res.status(200).json(post);
};

module.exports = {
  getAllPosts,
  getLatestTenPosts,
  getSinglePost,
  postNewPost,
  deletePost,
  updatePost,
};
