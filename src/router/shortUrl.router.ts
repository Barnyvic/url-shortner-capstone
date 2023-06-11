import { Router } from "express";

import {
  getShortUrl,
  createShortUrl,
  getShortUrlQRCode,
  getAllShortUrls,
} from "../Controller/Url-Shorter-controller";
import { login, register } from "../Controller/authController";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.get("/:shortCodeID", getShortUrl);
router.post("/create",verifyToken ,createShortUrl);
router.get("/qr/:shortCodeID",verifyToken ,getShortUrlQRCode);
router.get("/user/history", verifyToken,getAllShortUrls);
router.post("/auth/register", register)
router.post("/auth/login", login)
export default router;
