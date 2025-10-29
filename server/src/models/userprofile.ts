import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
}, { timestamps: true });

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

export default UserProfile;
