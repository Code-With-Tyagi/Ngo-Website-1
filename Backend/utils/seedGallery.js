import mongoose from "mongoose";
import Gallery from "../models/gallery.model.js";
import "../config/loadEnv.js";
import connectDB from "../config/db.js";

const seedGalleryData = async () => {
  try {
    await connectDB();
    
    // Clear existing gallery data (optional - comment out if you want to keep existing)
    // await Gallery.deleteMany({});
    // console.log("Cleared existing gallery data");

    const galleryItems = [
      // ============ IMAGES ============
      {
        type: "image",
        title: "Food Distribution Drive - Delhi",
        description: "Our volunteers distributing meals to 500+ underprivileged families in South Delhi during the winter relief program.",
        url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
        category: "Food Distribution",
        isActive: true
      },
      {
        type: "image",
        title: "Free Medical Camp - Rural Maharashtra",
        description: "Healthcare professionals providing free checkups and medicines to villagers. Over 300 patients treated in a single day.",
        url: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop",
        category: "Medical Camps",
        isActive: true
      },
      {
        type: "image",
        title: "Education Program for Orphans",
        description: "Children at our learning center receiving education support. We provide books, uniforms, and tuition assistance.",
        url: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop",
        category: "Education Programs",
        isActive: true
      },
      {
        type: "image",
        title: "Elder Care - Old Age Home Visit",
        description: "Our team spending quality time with elderly residents, providing companionship and celebrating festivals together.",
        url: "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&h=600&fit=crop",
        category: "Elder Care",
        isActive: true
      },

      // ============ VIDEOS ============
      // Note: Thumbnails are auto-generated from YouTube URLs
      // You can also upload custom thumbnails via admin panel
      {
        type: "video",
        title: "Our Impact Story 2025",
        description: "Watch how SevaIndia touched 50,000+ lives across 15 districts through various welfare programs.",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        category: "Events",
        isActive: true
      },
      {
        type: "video",
        title: "Volunteer Training Program",
        description: "Inside look at our volunteer training sessions where we prepare dedicated individuals for community service.",
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
        category: "Volunteer Activities",
        isActive: true
      },
      {
        type: "video",
        title: "Women Empowerment Workshop",
        description: "Skill development workshop for rural women teaching stitching, handicrafts and financial literacy.",
        url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
        thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
        category: "Women Empowerment",
        isActive: true
      },
      {
        type: "video",
        title: "Medical Camp Documentary",
        description: "A day in the life of our free medical camp - from setup to serving hundreds of patients.",
        url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
        thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg",
        category: "Medical Camps",
        isActive: true
      }
    ];

    // Insert all items
    const result = await Gallery.insertMany(galleryItems);
    
    console.log("\n✅ Gallery seed data created successfully!");
    console.log(`   📷 Images added: 4`);
    console.log(`   🎥 Videos added: 4`);
    console.log(`   📊 Total items: ${result.length}`);
    console.log("\n🔗 You can now view them at:");
    console.log("   - Images: http://localhost:5173/gallery/images");
    console.log("   - Videos: http://localhost:5173/gallery/videos");
    console.log("   - Admin:  http://localhost:5173/admin/gallery\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding gallery data:", error.message);
    process.exit(1);
  }
};

seedGalleryData();
