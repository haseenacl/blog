import { Schema, model, Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
  },
  { timestamps: true }
);

// Case-insensitive unique index
CategorySchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

export default model<CategoryDocument>("Category", CategorySchema);
