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
exports.login = exports.register = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const response_1 = require("../utils/response");
const bcrypt_1 = __importDefault(require("bcrypt"));
const comparePassward_1 = require("../helper/comparePassward");
const JwtHelper_1 = require("../helper/JwtHelper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            return (0, response_1.errorResponse)(res, 400, "All fields are required");
        }
        const userExist = yield userModel_1.default.findOne({ email });
        if (userExist) {
            return (0, response_1.errorResponse)(res, 400, "User already exist");
        }
        const user = new userModel_1.default({
            email,
            fullName,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        const salt = yield bcrypt_1.default.genSalt(10);
        user.password = bcrypt_1.default.hashSync(password, salt);
        yield user.save();
        return (0, response_1.successResponse)(res, 201, "User created successfully", user);
    }
    catch (err) {
        (0, response_1.handleError)(req, err);
        return (0, response_1.errorResponse)(res, 500, 'Server error.');
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, response_1.errorResponse)(res, 400, "All fields are required");
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return (0, response_1.errorResponse)(res, 400, "User not  found");
        }
        const isMatch = yield (0, comparePassward_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return (0, response_1.errorResponse)(res, 400, "Invalid Password");
        }
        const payload = {
            id: user._id,
            email: user.email,
        };
        const token = yield (0, JwtHelper_1.generateToken)(payload);
        return (0, response_1.successResponse)(res, 200, "Login successful", token);
    }
    catch (error) {
        (0, response_1.handleError)(req, error);
        return (0, response_1.errorResponse)(res, 500, "Server error.");
    }
});
exports.login = login;
//# sourceMappingURL=authController.js.map