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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const response_1 = require("../utils/response");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]; // Bearer <token>
            if (authorization) {
                const decoded = jsonwebtoken_1.default.verify(authorization, process.env.JWT_SECRET);
                const user = yield userModel_1.default.findById(decoded.id);
                if (!user) {
                    return (0, response_1.errorResponse)(res, 404, "user not found");
                }
                req.user = user;
                next();
            }
            else {
                return (0, response_1.errorResponse)(res, 401, "Unauthorized access");
            }
        }
    }
    catch (error) {
        (0, response_1.handleError)(req, error);
        return (0, response_1.errorResponse)(res, 500, 'Server error.');
    }
});
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map