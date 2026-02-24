import mongoose from "mongoose";


const fileSchema = new mongoose.Schema({    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["folder", "file"],
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    path: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    // File-specific fields (only used when type="file")
    size: {
      type: Number,
      default: null,
    },
    extension: {
      type: String,
      default: null,
    },
    lastModified: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
fileSchema.index({ parent_id: 1 });
fileSchema.index({ type: 1 });
fileSchema.index({ path: 1 });
fileSchema.index({ name: "text" })
const File = mongoose.model("File", fileSchema);
export default File;