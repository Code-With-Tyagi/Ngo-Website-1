import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        trim: true
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique: true,
        lowercase: true,
        trim: true
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    password:{
        type:String,
        required: function () {
            return this.authProvider === "local";
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordTokenHash: {
        type: String,
        default: null
    },
    resetPasswordExpiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

userSchema.index({ resetPasswordTokenHash: 1, resetPasswordExpiresAt: 1 });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

const User=mongoose.model("User",userSchema);
export default User;
