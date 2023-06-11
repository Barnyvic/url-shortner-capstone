"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Url_Shorter_controller_1 = require("../Controller/Url-Shorter-controller");
const authController_1 = require("../Controller/authController");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
router.get("/:shortCodeID", Url_Shorter_controller_1.getShortUrl);
router.post("/create", verifyToken_1.default, Url_Shorter_controller_1.createShortUrl);
router.get("/qr/:shortCodeID", verifyToken_1.default, Url_Shorter_controller_1.getShortUrlQRCode);
router.get("/user/history", verifyToken_1.default, Url_Shorter_controller_1.getUserHistory);
router.post("/auth/register", authController_1.register);
router.post("/auth/login", authController_1.login);
exports.default = router;
//# sourceMappingURL=shortUrl.router.js.map