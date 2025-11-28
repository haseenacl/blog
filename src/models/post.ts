import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  author?: string;          // optional because you said no auth for now
  category?: string;
  tags?: string[];          // array of tags
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  author: { type: String }, // store author name or id later
  category: { type: String, index: true },
  tags: [{ type: String, index: true }],
  coverImage: { type: String },
}, { timestamps: true });

export default mongoose.model<IPost>("Post", PostSchema);
