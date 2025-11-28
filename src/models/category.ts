import { Schema, model, Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default model<CategoryDocument>("Category", CategorySchema);
