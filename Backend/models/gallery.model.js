import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  // Type: image or video
  type: {
    type: String,
    enum: ["image", "video"],
    required: [true, "Type is required"]
  },
  
  // Title/Caption
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxLength: [200, "Title cannot exceed 200 characters"]
  },
  
  // Description
  description: {
    type: String,
    trim: true,
    default: ""
  },
  
  // URL - For images: uploaded file path, For videos: YouTube/Vimeo URL
  url: {
    type: String,
    required: [true, "URL is required"]
  },
  
  // Thumbnail - For videos, store thumbnail image
  thumbnail: {
    type: String,
    default: ""
  },
  
  // Category/Album
  category: {
    type: String,
    enum: [
      "Food Distribution",
      "Medical Camps",
      "Education Programs",
      "Elder Care",
      "Women Empowerment",
      "Events",
      "Volunteer Activities",
      "Other"
    ],
    default: "Other"
  },
  
  // For ordering
  order: {
    type: Number,
    default: 0
  },
  
  // Visibility
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Who uploaded
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

// Index for faster queries
gallerySchema.index({ type: 1, isActive: 1, createdAt: -1 });
gallerySchema.index({ category: 1 });

export default mongoose.model("Gallery", gallerySchema);
