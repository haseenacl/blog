import express from "express";
import { createComment, getCommentsByPost, deleteComment } from "../controllers/commentController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentInput:
 *       type: object
 *       required:
 *         - postId
 *         - user
 *         - email
 *         - text
 *       properties:
 *         postId:
 *           type: string
 *           description: ID of the blog post
 *         user:
 *           type: string
 *           description: Name of the commenter
 *         email:
 *           type: string
 *           description: Email of the commenter
 *         text:
 *           type: string
 *           description: Comment content
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request
 */
router.post("/comments", createComment);

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *       404:
 *         description: No comments found for this post
 */
router.get("/comments/:postId", getCommentsByPost);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete("/comments/:id", deleteComment);

export default router;
