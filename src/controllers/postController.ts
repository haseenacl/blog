import { Request, Response } from "express";
import Post from "../models/post";
import Category from "../models/category";
import mongoose from "mongoose";

/// Create Post (auto-create category if new)
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, excerpt, category, tags, author } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({ message: "Title, content and category are required" });
      return;
    }

    const tagsArr = Array.isArray(tags)
      ? tags
      : tags ? tags.split(",").map((t: string) => t.trim()) : [];

    let coverImagePath = "";
    if (req.file) {
      coverImagePath = `/uploads/${req.file.filename}`;
    }

    // Ensure category exists or create
    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      category: existingCategory._id,
      tags: tagsArr,
      coverImage: coverImagePath,
      author
    });

    res.status(201).json({ message: "Post created successfully", post });

  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};


// Get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category", "name"),
    Post.countDocuments()
  ]);

  res.json({ total, page, limit, posts });
};


// Get post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id).populate("category", "name");
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  res.json(post);
};


// Update post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body;

  if (updates.tags && !Array.isArray(updates.tags)) {
    updates.tags = updates.tags.split(",").map((t: string) => t.trim());
  }

  const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true })
    .populate("category", "name");

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  res.json(post);
};


// Delete post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  res.json({ message: "Post deleted successfully" });
};


// ❗ FIXED: Get posts by category
export const getPostsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;

    const foundCategory = await Category.findOne({ name: category });

    if (!foundCategory) {
      res.json([]); // return empty array instead of error
      return;
    }

    const posts = await Post.find({ category: foundCategory._id })
      .sort({ createdAt: -1 })
      .populate("category", "name");

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: "Error fetching posts by category", error });
  }
};


// Get posts by tag
export const getPostsByTag = async (req: Request, res: Response): Promise<void> => {
  const { tag } = req.params;
  const posts = await Post.find({ tags: tag })
    .sort({ createdAt: -1 })
    .populate("category", "name");

  res.json(posts);
};


// Search posts
export const searchPosts = async (req: Request, res: Response): Promise<void> => {
  const keyword = String(req.query.keyword || "");
  const regex = new RegExp(keyword, "i");

  const posts = await Post.find({
    $or: [{ title: regex }, { content: regex }]
  }).sort({ createdAt: -1 });

  res.json({ total: posts.length, posts });
};
