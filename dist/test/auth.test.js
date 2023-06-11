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
        const response = yield (0, supertest_1.default)(app_1.default).post("/api/v1/auth/register").send({
            email: "text@example.com",
            password: "password",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "User created successfully");
        expect(response.body).toHaveProperty("data");
    }));
});
//# sourceMappingURL=auth.test.js.map