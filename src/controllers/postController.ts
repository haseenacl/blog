import { Request, Response } from "express";
import Post from "../models/post";
import Category from "../models/category";
import path from "path";

/// Create Post (auto-create category if new)
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, excerpt, category, tags, author } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({ message: "Title, content and category are required" });
      return;
    }

    // Convert tags string → array
    const tagsArr = Array.isArray(tags)
      ? tags
      : (tags ? tags.split(",").map((t: string) => t.trim()) : []);

    // Image upload handling
    let coverImagePath = "";
    if (req.file) {
      coverImagePath = `/uploads/${req.file.filename}`;
    }

    // Auto-create category if missing
    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      category: existingCategory._id, // save ObjectId instead of string
      tags: tagsArr,
      coverImage: coverImagePath,
      author
    });

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Get all posts (with pagination)
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments()
  ]);

  res.json({ total, page, limit, posts });
  return;
};

// Get post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }
  res.json(post);
  return;
};

// Update post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body;

  if (updates.tags && !Array.isArray(updates.tags)) {
    updates.tags = updates.tags.split(",").map((t: string) => t.trim());
  }

  const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  res.json(post);
  return;
};

// Delete post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  res.json({ message: "Post deleted successfully" });
  return;
};

// Get posts by category
export const getPostsByCategory = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.params;
  const posts = await Post.find({ category }).sort({ createdAt: -1 });
  res.json(posts);
  return;
};

// Get posts by tag
export const getPostsByTag = async (req: Request, res: Response): Promise<void> => {
  const { tag } = req.params;
  const posts = await Post.find({ tags: tag }).sort({ createdAt: -1 });
  res.json(posts);
  return;
};

// Search posts
export const searchPosts = async (req: Request, res: Response): Promise<void> => {
  const keyword = String(req.query.keyword || "");
  if (!keyword) {
    res.json({ total: 0, posts: [] });
    return;
  }

  const regex = new RegExp(keyword, "i");

  const posts = await Post.find({
    $or: [
      { title: regex },
      { content: regex }
    ]
  }).sort({ createdAt: -1 });

  res.json({ total: posts.length, posts });
  return;
};
