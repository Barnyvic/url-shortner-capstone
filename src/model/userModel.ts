import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  cookieId: {
    type: String,
    required: true,
    unique: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
});


const User = mongoose.model("User", userSchema);

export default User;