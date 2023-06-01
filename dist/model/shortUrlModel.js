"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shortUrlSchema = new mongoose_1.default.Schema({
    shortUrl: {
        type: String,
        required: true,
    },
    longUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
});
const ShortUrl = mongoose_1.default.model("ShortUrl", shortUrlSchema);
exports.default = ShortUrl;
//# sourceMappingURL=shortUrlModel.js.map