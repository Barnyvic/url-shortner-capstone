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
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("./database");
const userModel_1 = __importDefault(require("../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
describe('Integration Test - Auth', () => {
    let connection;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        connection = yield (0, database_1.connect)();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.cleanup();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.disconnect();
    }));
    it("should create a new user if all fields are provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
            email: "text@example.com",
            password: "password",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "User created successfully");
        expect(response.body).toHaveProperty("data");
    }));
    it("should return an error if email is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
            password: "password",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }));
    it("should return an error if password is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
            email: "text@example.com",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }));
    it("should return an error if fullName is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
            email: "text@example.com",
            password: "password",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }));
    it("should return an error if email already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = new userModel_1.default({
            email: "text@example.com",
            password: "password",
            fullName: "Existing User",
        });
        yield existingUser.save();
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
            email: "text@example.com",
            password: "password",
            fullName: "Test User",
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "User already exist");
        yield userModel_1.default.findByIdAndDelete(existingUser._id);
    }));
    it("should return error if password is not included in the request body when logging in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: "text@example.com",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }));
    it("should return error if email is not included in the request body when logging in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            password: "password",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }));
    it("should return error if email does not exist when logging in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: "text@example.com",
            password: "password",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "User not  found");
    }));
    it("should return error if password is incorrect when logging in", () => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = new userModel_1.default({
            email: "text@example.com",
            password: "password",
            fullName: "Existing User",
        });
        yield existingUser.save();
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send({
            email: "text@example.com",
            password: "wrongpassword",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid Password");
        yield userModel_1.default.findByIdAndDelete(existingUser._id);
    }));
    it("should return a token if all fields are provided when logging in", () => __awaiter(void 0, void 0, void 0, function* () {
        const password = yield bcrypt_1.default.hash("password", 10);
        const existingUser = new userModel_1.default({
            email: "text@example.com",
            password: password,
            fullName: "Existing User",
        });
        yield existingUser.save();
        const logindetails = {
            email: "text@example.com",
            password: "password",
        };
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(logindetails);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Login successful");
        expect(response.body).toHaveProperty("data");
        yield userModel_1.default.findByIdAndDelete(existingUser._id);
    }));
});
//# sourceMappingURL=auth.test.js.map