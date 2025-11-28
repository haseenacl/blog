import { Request, Response } from "express";
import Comment from "../models/comment";
import Post from "../models/post";

// Create comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, name, email, comment } = req.body;

    if (!postId || !name || !email || !comment) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const newComment = await Comment.create({ postId, name, email, comment });

    res.status(201).json({
      message: "Comment added successfully",
      newComment
    });

  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// Get comments by Post ID
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json({ total: comments.length, comments });

  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

// Delete comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    res.json({ message: "Comment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};
