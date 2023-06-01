"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Url_Shorter_controller_1 = require("../Controller/Url-Shorter-controller");
const router = (0, express_1.Router)();
router.get("/:shortCodeID", Url_Shorter_controller_1.getShortUrl);
router.post("/create", Url_Shorter_controller_1.createShortUrl);
router.get("/qrcode/:shortCodeID", Url_Shorter_controller_1.getShortUrlQRCode);
router.get("/user/history", Url_Shorter_controller_1.getAllShortUrls);
exports.default = router;
//# sourceMappingURL=shortUrl.router.js.map