import mongoose, { ObjectId, Schema } from "mongoose";

interface IShortUrl extends Document {
  shortUrl: string;
  longUrl: string;
  userId: ObjectId;
  clicks: number;
}

const shortUrlSchema = new Schema<IShortUrl>({
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
},{ timestamps: true});


const ShortUrl = mongoose.model<IShortUrl>("ShortUrl", shortUrlSchema);

export default ShortUrl;