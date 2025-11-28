import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createPost, getAllPosts, getPostById, updatePost, deletePost,
  getPostsByCategory, getPostsByTag, searchPosts
} from "../controllers/postController";
import upload from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post management
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts with pagination
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: List of posts returned successfully
 */
router.get("/", asyncHandler(getAllPosts));

/**
 * @swagger
 * /api/posts/search:
 *   get:
 *     summary: Search posts by keyword
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results returned
 */
router.get("/search", asyncHandler(searchPosts));

/**
 * @swagger
 * /api/posts/category/{category}:
 *   get:
 *     summary: Get posts by category
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *     responses:
 *       200:
 *         description: Posts filtered by category
 */
router.get("/category/:category", asyncHandler(getPostsByCategory));

/**
 * @swagger
 * /api/posts/tag/{tag}:
 *   get:
 *     summary: Get posts by tag
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *     responses:
 *       200:
 *         description: Posts filtered by tag
 */
router.get("/tag/:tag", asyncHandler(getPostsByTag));

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post (auto-create category if missing)
 *     tags: [Posts]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               excerpt: { type: string }
 *               category: { type: string }
 *               tags: { type: string }
 *               author: { type: string }
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post("/", upload.single("coverImage"), asyncHandler(createPost));

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a single post
 *       404:
 *         description: Post not found
 */
router.get("/:id", asyncHandler(getPostById));

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               category: { type: string }
 *               tags: { type: string }
 *               author: { type: string }
 *               excerpt: { type: string }
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put("/:id", asyncHandler(updatePost));

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete("/:id", asyncHandler(deletePost));

export default router;
