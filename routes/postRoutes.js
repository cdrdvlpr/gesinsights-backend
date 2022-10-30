const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");

const {
  getAllPosts,
  // getLatestTenPosts,
  getSinglePost,
  postNewPost,
  deletePost,
  updatePost,
} = require("../controllers/postController");

// require authorization for all post routes
router.use(requireAuth);

// GET all posts
router.get("/", getAllPosts);

// GET latest ten posts
// router.get("/", getLatestTenPosts);

// GET a single post
router.get("/:id", getSinglePost);

// POST a new post
router.post("/", postNewPost);

// DELETE a single post
router.delete("/:id", deletePost);

// UPDATE a single post
router.patch("/:id", updatePost);

module.exports = router;
