import { Router } from "express";

import {
  getShortUrl,
  createShortUrl,
  getShortUrlQRCode,
  getAllShortUrls,
} from "../Controller/Url-Shorter-controller";

const router = Router();

router.get("/:shortCodeID", getShortUrl);
router.post("/create", createShortUrl);
router.get("/qrcode/:shortCodeID", getShortUrlQRCode);
// router.get("/user/history", getAllShortUrls);
export default router;
