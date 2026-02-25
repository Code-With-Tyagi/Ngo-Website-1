import User from "../models/user.model.js";
import Ngo from "../models/ngo.model.js";
import Volunteer from "../models/volunteer.model.js";
import Contact from "../models/contact.model.js";

// ─── Dashboard Stats ───
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalNgos,
            pendingNgos,
            verifiedNgos,
            totalVolunteers,
            pendingVolunteers,
            totalContacts,
            newContacts,
            recentUsers,
            recentNgos,
            recentVolunteers,
            recentContacts
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: "admin" } }),
            Ngo.countDocuments(),
            Ngo.countDocuments({ isVerified: false }),
            Ngo.countDocuments({ isVerified: true }),
            Volunteer.countDocuments(),
            Volunteer.countDocuments({ status: "Pending" }),
            Contact.countDocuments(),
            Contact.countDocuments({ status: "New" }),
            User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 }).limit(5).select("name email role createdAt").lean(),
            Ngo.find().sort({ createdAt: -1 }).limit(5).select("ngoName email isVerified createdAt").lean(),
            Volunteer.find().sort({ createdAt: -1 }).limit(5).select("fullName email status createdAt").lean(),
            Contact.find().sort({ createdAt: -1 }).limit(5).select("name email subject status createdAt").lean()
        ]);

        return res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalNgos,
                    pendingNgos,
                    verifiedNgos,
                    totalVolunteers,
                    pendingVolunteers,
                    totalContacts,
                    newContacts
                },
                recent: {
                    users: recentUsers,
                    ngos: recentNgos,
                    volunteers: recentVolunteers,
                    contacts: recentContacts
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── NGO Management ───
export const getAllNgos = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status === "verified") filter.isVerified = true;
        else if (status === "pending") filter.isVerified = false;

        if (search) {
            filter.$or = [
                { ngoName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { regNumber: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [ngos, total] = await Promise.all([
            Ngo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Ngo.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: ngos,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNgoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        if (typeof isVerified !== "boolean") {
            return res.status(400).json({ success: false, message: "isVerified must be a boolean" });
        }

        const ngo = await Ngo.findByIdAndUpdate(
            id,
            { $set: { isVerified } },
            { new: true }
        );

        if (!ngo) {
            return res.status(404).json({ success: false, message: "NGO not found" });
        }

        return res.status(200).json({
            success: true,
            message: `NGO ${isVerified ? "approved" : "rejected"} successfully`,
            data: ngo
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteNgo = async (req, res) => {
    try {
        const ngo = await Ngo.findByIdAndDelete(req.params.id);
        if (!ngo) {
            return res.status(404).json({ success: false, message: "NGO not found" });
        }
        return res.status(200).json({ success: true, message: "NGO deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Volunteer Management ───
export const getAllVolunteers = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [volunteers, total] = await Promise.all([
            Volunteer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Volunteer.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: volunteers,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateVolunteerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be Pending, Approved, or Rejected" });
        }

        const volunteer = await Volunteer.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );

        if (!volunteer) {
            return res.status(404).json({ success: false, message: "Volunteer not found" });
        }

        return res.status(200).json({
            success: true,
            message: `Volunteer ${status.toLowerCase()} successfully`,
            data: volunteer
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: "Volunteer not found" });
        }
        return res.status(200).json({ success: true, message: "Volunteer deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Contact Management ───
export const getAllContacts = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status && ["New", "In Progress", "Resolved", "Spam"].includes(status)) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [contacts, total] = await Promise.all([
            Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Contact.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["New", "In Progress", "Resolved", "Spam"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid contact status" });
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        return res.status(200).json({
            success: true,
            message: `Contact marked as ${status}`,
            data: contact
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }
        return res.status(200).json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── User Management ───
export const getAllUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const filter = { role: { $ne: "admin" } };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select("name email role emailVerified aadhaarVerified authProvider createdAt")
                .lean(),
            User.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
