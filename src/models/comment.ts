import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  postId: string;
  name: string;
  email?: string;
  comment: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
