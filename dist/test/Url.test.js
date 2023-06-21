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
const JwtHelper_1 = require("../helper/JwtHelper");
describe('Integration Test - Url', () => {
    let token;
    let existingUser;
    it("should create a new url if all fields are provided", () => __awaiter(void 0, void 0, void 0, function* () {
        token = yield (0, JwtHelper_1.generateToken)({
            id: existingUser._id,
            email: existingUser.email,
        });
        console.log(existingUser);
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/create")
            .send({
            longUrl: 'https://example.com',
            customedUrl: 'example',
        })
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Url Created Successfully.");
        expect(response.body).toHaveProperty("data");
    }), 90000);
});
//# sourceMappingURL=Url.test.js.map