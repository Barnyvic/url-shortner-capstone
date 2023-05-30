import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});


const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;