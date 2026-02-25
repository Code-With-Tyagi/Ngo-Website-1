import Gallery from "../models/gallery.model.js";
import fs from "fs";
import path from "path";

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * Get all images (public)
 * GET /api/gallery/images
 */
export const getImages = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    const query = { type: "image", isActive: true };
    if (category && category !== "all") {
      query.category = category;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [images, total] = await Promise.all([
      Gallery.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-uploadedBy"),
      Gallery.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      images,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ success: false, message: "Failed to fetch images" });
  }
};

/**
 * Get all videos (public)
 * GET /api/gallery/videos
 */
export const getVideos = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    const query = { type: "video", isActive: true };
    if (category && category !== "all") {
      query.category = category;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [videos, total] = await Promise.all([
      Gallery.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-uploadedBy"),
      Gallery.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      videos,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ success: false, message: "Failed to fetch videos" });
  }
};

/**
 * Get all categories with counts
 * GET /api/gallery/categories
 */
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    const match = { isActive: true };
    if (type) match.type = type;
    
    const categories = await Gallery.aggregate([
      { $match: match },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Get all gallery items (admin)
 * GET /api/admin/gallery
 */
export const getAllGalleryItems = async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [items, total] = await Promise.all([
      Gallery.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("uploadedBy", "name email"),
      Gallery.countDocuments(query)
    ]);
    
    // Get counts by type
    const [imageCount, videoCount] = await Promise.all([
      Gallery.countDocuments({ type: "image" }),
      Gallery.countDocuments({ type: "video" })
    ]);
    
    res.json({
      success: true,
      items,
      counts: { images: imageCount, videos: videoCount },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    res.status(500).json({ success: false, message: "Failed to fetch gallery items" });
  }
};

/**
 * Add new image (admin)
 * POST /api/admin/gallery/image
 */
export const addImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }
    
    if (!title || !title.trim()) {
      // Delete uploaded file if title is missing
      if (req.file.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    
    const image = new Gallery({
      type: "image",
      title: title.trim(),
      description: description?.trim() || "",
      url: `/uploads/gallery/${req.file.filename}`,
      category: category || "Other",
      uploadedBy: req.user._id
    });
    
    await image.save();
    
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image
    });
  } catch (error) {
    console.error("Error adding image:", error);
    // Clean up uploaded file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
};

/**
 * Add new video (admin)
 * POST /api/admin/gallery/video
 */
export const addVideo = async (req, res) => {
  try {
    const { title, description, url, category } = req.body;
    
    if (!title || !title.trim()) {
      // Delete uploaded thumbnail if title is missing
      if (req.file?.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    
    if (!url || !url.trim()) {
      // Delete uploaded thumbnail if URL is missing
      if (req.file?.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Video URL is required" });
    }
    
    // Validate YouTube/Vimeo URL
    const videoUrl = url.trim();
    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");
    
    if (!isYouTube && !isVimeo) {
      // Delete uploaded thumbnail if URL is invalid
      if (req.file?.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: "Only YouTube and Vimeo URLs are supported" 
      });
    }
    
    // Use uploaded thumbnail or fallback to YouTube auto-thumbnail
    let thumbnailPath = "";
    if (req.file) {
      thumbnailPath = `/uploads/gallery/${req.file.filename}`;
    } else if (isYouTube) {
      // Fallback to YouTube auto-thumbnail if no file uploaded
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        thumbnailPath = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    
    const video = new Gallery({
      type: "video",
      title: title.trim(),
      description: description?.trim() || "",
      url: videoUrl,
      thumbnail: thumbnailPath,
      category: category || "Other",
      uploadedBy: req.user._id
    });
    
    await video.save();
    
    res.status(201).json({
      success: true,
      message: "Video added successfully",
      video
    });
  } catch (error) {
    console.error("Error adding video:", error);
    // Clean up uploaded file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: "Failed to add video" });
  }
};

/**
 * Update gallery item (admin)
 * PUT /api/admin/gallery/:id
 */
export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, isActive, order } = req.body;
    
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    
    if (title !== undefined) item.title = title.trim();
    if (description !== undefined) item.description = description.trim();
    if (category !== undefined) item.category = category;
    if (isActive !== undefined) item.isActive = isActive;
    if (order !== undefined) item.order = order;
    
    await item.save();
    
    res.json({
      success: true,
      message: "Item updated successfully",
      item
    });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res.status(500).json({ success: false, message: "Failed to update item" });
  }
};

/**
 * Delete gallery item (admin)
 * DELETE /api/admin/gallery/:id
 */
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    
    // If it's an image, delete the file from disk
    if (item.type === "image" && item.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), item.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // If video has uploaded thumbnail, delete it
    if (item.type === "video" && item.thumbnail && item.thumbnail.startsWith("/uploads/")) {
      const thumbPath = path.join(process.cwd(), item.thumbnail);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }
    
    await Gallery.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: `${item.type === "image" ? "Image" : "Video"} deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({ success: false, message: "Failed to delete item" });
  }
};

/**
 * Bulk delete gallery items (admin)
 * POST /api/admin/gallery/bulk-delete
 */
export const bulkDeleteGalleryItems = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No items selected" });
    }
    
    // Get items to delete files
    const items = await Gallery.find({ _id: { $in: ids } });
    
    // Delete image files and thumbnails
    for (const item of items) {
      // Delete image files
      if (item.type === "image" && item.url.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), item.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      // Delete video thumbnails
      if (item.type === "video" && item.thumbnail && item.thumbnail.startsWith("/uploads/")) {
        const thumbPath = path.join(process.cwd(), item.thumbnail);
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      }
    }
    
    await Gallery.deleteMany({ _id: { $in: ids } });
    
    res.json({
      success: true,
      message: `${ids.length} item(s) deleted successfully`
    });
  } catch (error) {
    console.error("Error bulk deleting gallery items:", error);
    res.status(500).json({ success: false, message: "Failed to delete items" });
  }
};

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}
