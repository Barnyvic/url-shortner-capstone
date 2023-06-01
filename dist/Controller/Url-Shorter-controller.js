"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShortUrls = exports.getShortUrlQRCode = exports.getShortUrl = exports.createShortUrl = void 0;
const shortUrlModel_1 = __importDefault(require("../model/shortUrlModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const shortid_1 = __importDefault(require("shortid"));
const valid_url_1 = __importDefault(require("valid-url"));
const response_1 = require("../utils/response");
const redis_1 = __importDefault(require("../Config/redis"));
const qrcode_1 = __importDefault(require("qrcode"));
const createShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get the long longurl and customed url from the request body
        const { longUrl, customedUrl } = req.body;
        const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
        let generatedShortUrl;
        //check if the longUrl is valid
        if (!valid_url_1.default.isUri(longUrl)) {
            return res.status(400).json('Invalid Url Provided....');
        }
        //get userId from the cookie
        const userId = req.cookies.userId;
        if (userId) {
            //find the user with the userId
            const user = yield userModel_1.default.findById(userId);
            if (user) {
                generatedShortUrl = yield shortUrlModel_1.default.create({
                    longUrl,
                    shortUrl: customedUrl || shortid_1.default.generate(),
                    userId: user._id,
                });
            }
            else {
                res.clearCookie('userId');
                const newUser = yield userModel_1.default.create({
                    cookieId: shortid_1.default.generate(),
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                generatedShortUrl = yield shortUrlModel_1.default.create({
                    longUrl,
                    shortUrl: customedUrl || shortid_1.default.generate(),
                    userId: newUser._id,
                });
                res.cookie('userId', newUser._id, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                    httpOnly: true,
                });
            }
        }
        else {
            const newUser = yield userModel_1.default.create({
                cookieId: shortid_1.default.generate(),
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            generatedShortUrl = yield shortUrlModel_1.default.create({
                longUrl,
                shortUrl: customedUrl || shortid_1.default.generate(),
                userId: newUser._id,
            });
            res.cookie('userId', newUser._id, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                httpOnly: true,
            });
        }
        //set the shortUrl in redis
        redis_1.default.setEx(generatedShortUrl.shortUrl, 3600, longUrl);
        return (0, response_1.successResponse)(res, 201, 'Url Created Successfully.', baseUrl + '/' + generatedShortUrl.shortUrl);
    }
    catch (error) {
        (0, response_1.handleError)(req, error);
        return (0, response_1.errorResponse)(res, 500, 'Server error.');
    }
});
exports.createShortUrl = createShortUrl;
const getShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.cookies.userId;
    const { shortCodeID } = req.params;
    // Check if the shortened URL exists in the cache
    const response = yield redis_1.default.get(shortCodeID);
    // const shortUrl = await ShortUrl.findOne({
    //         shortUrl: shortCodeID,
    //         userId: user,
    //     });
    //     if (shortUrl == null || !shortUrl)
    //         return successResponse(res, 404, 'Url not found');
    //     shortUrl.clicks++;
    //     shortUrl.save();
    //     res.redirect(shortUrl.longUrl);
    if (response !== null) {
        return res.redirect(response);
    }
    else {
        const shortUrl = yield shortUrlModel_1.default.findOne({
            shortUrl: shortCodeID,
            userId: user,
        });
        if (shortUrl == null || !shortUrl)
            return (0, response_1.successResponse)(res, 404, 'Url not found');
        shortUrl.clicks++;
        shortUrl.save();
        res.redirect(shortUrl.longUrl);
    }
});
exports.getShortUrl = getShortUrl;
const getShortUrlQRCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.cookies.userId;
    const { shortCodeID } = req.params;
    // Check if the shortened URL exists in the cache
    const shortUrl = yield shortUrlModel_1.default.findOne({
        shortUrl: shortCodeID,
        userId: user,
    });
    if (shortUrl == null || !shortUrl)
        return (0, response_1.successResponse)(res, 404, 'Url not found');
    const qrCode = yield qrcode_1.default.toDataURL(shortUrl.longUrl);
    shortUrl.clicks++;
    shortUrl.save();
    return (0, response_1.successResponse)(res, 200, 'QR Code', qrCode);
});
exports.getShortUrlQRCode = getShortUrlQRCode;
//get all the shortUrls created by the user
const getAllShortUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.cookies.userId;
        const shortUrls = yield shortUrlModel_1.default.find({ userId }).populate('userId');
        return (0, response_1.successResponse)(res, 200, 'Short Urls', shortUrls);
    }
    catch (error) {
        (0, response_1.handleError)(req, error);
        return (0, response_1.errorResponse)(res, 500, 'Server error.');
    }
});
exports.getAllShortUrls = getAllShortUrls;
//# sourceMappingURL=Url-Shorter-controller.js.map