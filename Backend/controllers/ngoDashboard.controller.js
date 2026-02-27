import Ngo from "../models/ngo.model.js";
import Gallery from "../models/gallery.model.js";
import Volunteer from "../models/volunteer.model.js";
import User from "../models/user.model.js";

// ═══════════════════════════════════════════════════════════════════════════
// NGO DASHBOARD CONTROLLER
// All endpoints require authenticated NGO owner/manager
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get NGO Dashboard Stats
 * GET /api/ngo/dashboard
 */
export const getDashboardStats = async (req, res) => {
    try {
        const ngoId = req.ngo._id;

        // Fetch stats in parallel
        const [
            galleryTotal,
            galleryPending,
            galleryApproved,
            volunteersTotal,
            volunteersPending,
            recentGallery,
            recentVolunteers
        ] = await Promise.all([
            Gallery.countDocuments({ ngoId }),
            Gallery.countDocuments({ ngoId, approvalStatus: "pending" }),
            Gallery.countDocuments({ ngoId, approvalStatus: "approved" }),
            Volunteer.countDocuments({ ngoId }),
            Volunteer.countDocuments({ ngoId, status: "Pending" }),
            Gallery.find({ ngoId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("title type category approvalStatus createdAt url"),
            Volunteer.find({ ngoId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("fullName email status skills createdAt")
        ]);

        return res.status(200).json({
            success: true,
            data: {
                ngo: {
                    _id: req.ngo._id,
                    ngoName: req.ngo.ngoName,
                    email: req.ngo.email,
                    isVerified: req.ngo.isVerified,
                    createdAt: req.ngo.createdAt,
                    regNumber: req.ngo.regNumber,
                    phone: req.ngo.phone,
                    state: req.ngo.state,
                    address: req.ngo.address,
                    website: req.ngo.website,
                    description: req.ngo.description,
                    socialMedia: req.ngo.socialMedia,
                    documents: req.ngo.documents
                },
                stats: {
                    gallery: {
                        total: galleryTotal,
                        pending: galleryPending,
                        approved: galleryApproved
                    },
                    volunteers: {
                        total: volunteersTotal,
                        pending: volunteersPending
                    },
                    donations: {
                        total: 0,  // Future: Implement when payment is ready
                        amount: 0
                    }
                },
                recent: {
                    gallery: recentGallery,
                    volunteers: recentVolunteers
                }
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats"
        });
    }
};

/**
 * Get NGO Profile
 * GET /api/ngo/profile
 */
export const getNgoProfile = async (req, res) => {
    try {
        const ngo = await Ngo.findById(req.ngo._id)
            .populate("ownerId", "name email")
            .populate("teamMembers.userId", "name email");

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: ngo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch NGO profile"
        });
    }
};

/**
 * Update NGO Profile
 * PUT /api/ngo/profile
 */
export const updateNgoProfile = async (req, res) => {
    try {
        const allowedFields = [
            "description",
            "address",
            "phone",
            "whatsapp",
            "website",
            "socialMedia",
            "contactName",
            "contactRole"
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const ngo = await Ngo.findByIdAndUpdate(
            req.ngo._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: ngo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update profile"
        });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get NGO's Gallery Items
 * GET /api/ngo/gallery
 */
export const getNgoGallery = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 20 } = req.query;
        const ngoId = req.ngo._id;

        const filter = { ngoId };
        if (type && ["image", "video"].includes(type)) {
            filter.type = type;
        }
        if (status && ["pending", "approved", "rejected"].includes(status)) {
            filter.approvalStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [items, total] = await Promise.all([
            Gallery.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Gallery.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: items,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch gallery"
        });
    }
};

/**
 * Upload to NGO Gallery
 * POST /api/ngo/gallery
 */
export const uploadToGallery = async (req, res) => {
    try {
        const { title, description, category, type } = req.body;
        const ngoId = req.ngo._id;

        // For images, get from uploaded file
        let url = req.body.url || "";
        if (req.file) {
            url = req.file.filename;
        }

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Image/Video URL is required"
            });
        }

        const galleryItem = await Gallery.create({
            type: type || "image",
            title,
            description: description || "",
            url,
            category: category || "Other",
            ngoId,
            uploadedBy: req.user._id,
            approvalStatus: "pending",  // NGO uploads need admin approval
            isActive: false  // Not visible until approved
        });

        // Update NGO gallery count
        await Ngo.findByIdAndUpdate(ngoId, {
            $inc: { "stats.totalGalleryItems": 1 }
        });

        return res.status(201).json({
            success: true,
            message: "Uploaded successfully. Pending admin approval.",
            data: galleryItem
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to upload"
        });
    }
};

/**
 * Delete Gallery Item
 * DELETE /api/ngo/gallery/:id
 */
export const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const ngoId = req.ngo._id;

        const item = await Gallery.findOne({ _id: id, ngoId });
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Gallery item not found"
            });
        }

        await Gallery.findByIdAndDelete(id);

        // Update NGO gallery count
        await Ngo.findByIdAndUpdate(ngoId, {
            $inc: { "stats.totalGalleryItems": -1 }
        });

        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete"
        });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// VOLUNTEER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get NGO's Volunteer Applications
 * GET /api/ngo/volunteers
 */
export const getNgoVolunteers = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const ngoId = req.ngo._id;

        const filter = { ngoId };
        if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [volunteers, total] = await Promise.all([
            Volunteer.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate("user", "name email avatar"),
            Volunteer.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: volunteers,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch volunteers"
        });
    }
};

/**
 * Update Volunteer Status
 * PUT /api/ngo/volunteers/:id
 */
export const updateVolunteerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const ngoId = req.ngo._id;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'Approved' or 'Rejected'"
            });
        }

        const volunteer = await Volunteer.findOne({ _id: id, ngoId });
        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: "Volunteer not found"
            });
        }

        volunteer.status = status;
        await volunteer.save();

        // Update NGO volunteer count if approving
        if (status === "Approved") {
            await Ngo.findByIdAndUpdate(ngoId, {
                $inc: { "stats.totalVolunteers": 1 }
            });
        }

        return res.status(200).json({
            success: true,
            message: `Volunteer ${status.toLowerCase()} successfully`,
            data: volunteer
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update volunteer status"
        });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// NGO STATUS CHECK (for pending page)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get NGO Status (works for pending NGOs too)
 * GET /api/ngo/status
 */
export const getNgoStatus = async (req, res) => {
    try {
        const user = req.user;
        
        // Check if user has ngoId
        if (user.ngoId && req.ngo) {
            return res.status(200).json({
                success: true,
                status: req.ngo.isVerified ? "approved" : "pending",
                data: {
                    _id: req.ngo._id,
                    ngoName: req.ngo.ngoName,
                    email: req.ngo.email,
                    isVerified: req.ngo.isVerified,
                    createdAt: req.ngo.createdAt,
                    regNumber: req.ngo.regNumber,
                    phone: req.ngo.phone,
                    state: req.ngo.state,
                    address: req.ngo.address,
                    website: req.ngo.website,
                    description: req.ngo.description,
                    socialMedia: req.ngo.socialMedia,
                    documents: req.ngo.documents
                }
            });
        }

        // Check if user has a pending NGO by email
        const pendingNgo = await Ngo.findOne({ 
            email: user.email.toLowerCase() 
        });

        if (pendingNgo) {
            return res.status(200).json({
                success: true,
                status: pendingNgo.isVerified ? "approved" : "pending",
                data: {
                    _id: pendingNgo._id,
                    ngoName: pendingNgo.ngoName,
                    email: pendingNgo.email,
                    isVerified: pendingNgo.isVerified,
                    createdAt: pendingNgo.createdAt,
                    regNumber: pendingNgo.regNumber,
                    phone: pendingNgo.phone,
                    state: pendingNgo.state,
                    address: pendingNgo.address,
                    website: pendingNgo.website,
                    description: pendingNgo.description,
                    socialMedia: pendingNgo.socialMedia,
                    documents: pendingNgo.documents
                }
            });
        }

        // No NGO found
        return res.status(200).json({
            success: true,
            status: "none",
            data: null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch NGO status"
        });
    }
};

export default {
    getDashboardStats,
    getNgoProfile,
    updateNgoProfile,
    getNgoGallery,
    uploadToGallery,
    deleteGalleryItem,
    getNgoVolunteers,
    updateVolunteerStatus,
    getNgoStatus
};
