import ShortUrl from '../model/shortUrlModel';
import User from '../model/userModel';
import shortid from 'shortid';
import { Request, Response } from 'express';
import validUrl from 'valid-url';
import { IRequest, errorResponse, handleError, successResponse } from '../utils/response';
import client from '../Config/redis';
import qrcode from 'qrcode';

/**
 * @swagger
 * /api/v1/shorturl:
 *   post:
 *     summary: Create a short URL
 *     tags: [ShortURL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *               customedUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *       400:
 *         description: Invalid long URL
 *       500:
 *         description: Server error
 */

export const createShortUrl = async (req:  IRequest, res: Response) => {
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
            return errorResponse(res, 400, 'Invalid long url.');
        }

        //get userId from the cookie
        const userId = req.user._id

        if (userId) {
            //find the user with the userId
            const user = await User.findById(userId);

            if (user) {
                generatedShortUrl = await ShortUrl.create({
                    longUrl,
                    shortUrl: customedUrl ? customedUrl : shortid.generate(),
                    userId: user._id,
                });
            } else {
                generatedShortUrl = await ShortUrl.create({
                    longUrl,
                    shortUrl: customedUrl ? customedUrl : shortid.generate(),
                    userId: user._id,
                });
            }
        } else {
            generatedShortUrl = await ShortUrl.create({
                longUrl,
                shortUrl: customedUrl ? customedUrl : shortid.generate(),
                userId: userId,
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

/**
 * @swagger
 * /api/v1/shorturl/{shortCodeID}:
 *   get:
 *     summary: Redirect to the long URL associated with the short code
 *     tags: [ShortURL]
 *     parameters:
 *       - in: path
 *         name: shortCodeID
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code for the URL
 *     responses:
 *       302:
 *         description: Redirect to the long URL
 *       404:
 *         description: URL not found
 */

export const getShortUrl = async (req: Request, res: Response) => {
    const { shortCodeID } = req.params;


    // Check if the shortened URL exists in the cache
    const response = await client.get(shortCodeID);

    if (response !== null) {
        return res.redirect(response);
    } else {
        const shortUrl = await ShortUrl.findOne({
            shortUrl: shortCodeID,
        });
        if (shortUrl == null || !shortUrl)
            return successResponse(res, 404, 'Url not found');
        shortUrl.clicks++;
        shortUrl.save();
        res.redirect(shortUrl.longUrl);
    }
};

/**
 * @swagger
 * /api/v1/shorturl/{shortCodeID}/qrcode:
 *   get:
 *     summary: Get the QR code for the short URL
 *     tags: [ShortURL]
 *     parameters:
 *       - in: path
 *         name: shortCodeID
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code for the URL
 *     responses:
 *       200:
 *         description: QR code image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *       404:
 *         description: URL not found
 */

export const getShortUrlQRCode = async (req: Request, res: Response) => {
    const { shortCodeID } = req.params;

    // Check if the shortened URL exists in the cache
    const shortUrl = await ShortUrl.findOne({
        shortUrl: shortCodeID,
    });
    if (shortUrl == null || !shortUrl)
        return successResponse(res, 404, 'Url not found');

    const qrCode = await qrcode.toDataURL(shortUrl.longUrl);
    shortUrl.clicks++;
    shortUrl.save();
    return successResponse(res, 200, 'QR Code', qrCode);
};

/**
 * @swagger
 * /api/v1/shorturl/history:
 *   get:
 *     summary: Get the history of short URLs created by the user
 *     tags: [ShortURL]
 *     responses:
 *       200:
 *         description: Short URLs history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrls:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShortURL'
 *       404:
 *         description: No short URLs found
 *       500:
 *         description: Server error
 */

//get all the shortUrls created by the user
export const getUserHistory = async (req: IRequest, res: Response) => {
    try {
        const userId =      req.user._id
        const shortUrls = await ShortUrl.find({ userId }).populate('userId',{
            fullName: 1,
            ipAddress: 1,
            userAgent: 1,
        });


        if(!shortUrls || shortUrls.length === 0) return successResponse(res, 404, 'No short urls found' 
        );

        return successResponse(res, 200, 'Short Urls', shortUrls);
    } catch (error) {
        handleError(req, error);
        return errorResponse(res, 500, 'Server error.');
    }
};
