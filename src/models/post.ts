import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  category?: mongoose.Types.ObjectId | string;
  tags?: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    author: { type: String },
    // category is now an ObjectId reference to Category
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    tags: [{ type: String, index: true }],
    coverImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
