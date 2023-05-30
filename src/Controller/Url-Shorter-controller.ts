import ShortUrl from '../model/shortUrlModel';
import User from '../model/userModel';
import shortid from 'shortid';
import { Request, Response } from 'express';
import validUrl from 'valid-url';
import { errorResponse, handleError, successResponse } from '../utils/response';
import client from '../Config/redis';
import qrcode from 'qrcode';

export const createShortUrl = async (req: Request, res: Response) => {
    try {
        //get the long longurl and customed url from the request body
        const { longUrl, customedUrl } = req.body as {
            longUrl: string;
            customedUrl: string;
        };

        const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

        let generatedShortUrl;

        //check if the longUrl is valid
        if (!validUrl.isUri(longUrl)) {
            return res.status(400).json('Invalid Url Provided....');
        }

        //get userId from the cookie
        const userId = req.cookies.userId;

        if (userId) {
            //find the user with the userId
            const user = await User.findById(userId);

            if (user) {
                generatedShortUrl = await ShortUrl.create({
                    longUrl,
                    shortUrl: customedUrl || shortid.generate(),
                    userId: user._id,
                });
            } else {
                res.clearCookie('userId');
                const newUser = await User.create({
                    cookieId: shortid.generate(),
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                generatedShortUrl = await ShortUrl.create({
                    longUrl,
                    shortUrl: customedUrl || shortid.generate(),
                    userId: newUser._id,
                });
                res.cookie('userId', newUser._id, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                    httpOnly: true,
                });
            }
        } else {
            const newUser = await User.create({
                cookieId: shortid.generate(),
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            generatedShortUrl = await ShortUrl.create({
                longUrl,
                shortUrl: customedUrl || shortid.generate(),
                userId: newUser._id,
            });
            res.cookie('userId', newUser._id, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                httpOnly: true,
            });
        }

        //set the shortUrl in redis
        client.setEx(generatedShortUrl.shortUrl, 3600, longUrl);

        return successResponse(
            res,
            201,
            'Url Created Successfully.',
            baseUrl + '/' + generatedShortUrl.shortUrl
        );
    } catch (error) {
        handleError(req, error);
        return errorResponse(res, 500, 'Server error.');
    }
};

export const getShortUrl = async (req: Request, res: Response) => {
    const user = req.cookies.userId;
    const { shortCodeID } = req.params;


    // Check if the shortened URL exists in the cache
    const response = await client.get(shortCodeID);

    if (response !== null) {
        return res.redirect(response);
    } else {
        const shortUrl = await ShortUrl.findOne({
            shortUrl: shortCodeID,
            userId: user,
        });
        if (shortUrl == null || !shortUrl)
            return successResponse(res, 404, 'Url not found');
        shortUrl.clicks++;
        shortUrl.save();
        res.redirect(shortUrl.longUrl);
    }
};

export const getShortUrlQRCode = async (req: Request, res: Response) => {
    const user = req.cookies.userId;
    const { shortCodeID } = req.params;

    // Check if the shortened URL exists in the cache

    const shortUrl = await ShortUrl.findOne({
        shortUrl: shortCodeID,
        userId: user,
    });
    if (shortUrl == null || !shortUrl)
        return successResponse(res, 404, 'Url not found');

    const qrCode = await qrcode.toDataURL(shortUrl.longUrl);
    shortUrl.clicks++;
    shortUrl.save();
    return successResponse(res, 200, 'QR Code', qrCode);
};

//get all the shortUrls created by the user
export const getAllShortUrls = async (req: Request, res: Response) => {
    try {
        const userId = req.cookies.userId;
        const shortUrls = await ShortUrl.find({ userId }).populate('userId');
        return successResponse(res, 200, 'Short Urls', shortUrls);
    } catch (error) {
        handleError(req, error);
        return errorResponse(res, 500, 'Server error.');
    }
};
