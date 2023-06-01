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
describe('Integration Test - ShortUrl', () => {
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
    it('should return 400 if the longUrl is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/shorturl/create').send({
            longUrl: 'invalidUrl',
        });
        expect(response.status).toBe(400);
        expect(response.body).toBe('Invalid Url Provided....');
    }));
    it('should return 400 if the longUrl is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/shorturl/create').send({});
        expect(response.status).toBe(400);
        expect(response.body).toBe('Invalid Url Provided....');
    }));
    it('should return 200 if the longUrl is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/shorturl/create').send({
            longUrl: 'https://www.google.com',
            customedUrl: 'google',
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
        expect(response.body).toHaveProperty('data');
    }));
    it('should return 200 if the longUrl is valid and customedUrl is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/shorturl/create').send({
            longUrl: 'https://www.google.com',
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
        expect(response.body).toHaveProperty('data');
    }));
    it('should return 200 if the longUrl is valid and customedUrl is not provided and user is not in the database', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/shorturl/create').send({
            longUrl: 'https://www.google.com',
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
        expect(response.body).toHaveProperty('data');
    }));
    it('should return 200 if the longUrl is valid and customedUrl is not provided and user is in the database', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/shorturl/create').send({
            longUrl: 'https://www.google.com',
        }).set('user-agent', 'Test User Agent');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
        expect(response.body).toHaveProperty('data');
    }));
    it("should redirect to the longUrl if the shortUrl is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const shortCodeID = 'google';
        const response = yield (0, supertest_1.default)(app_1.default).get(`/api/v1/shorturl/${shortCodeID}`);
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('https://www.google.com');
    }));
    it("should return 404 if the shortUrl is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const shortCodeID = 'invalidShortUrl';
        const response = yield (0, supertest_1.default)(app_1.default).get(`/api/v1/shorturl/${shortCodeID}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Url not found');
    }));
    // it("should get the qrcode for a short URL", async () => {
    //     const shortCodeID = 'google';
    //     const response = await request(app).get(`/api/v1/shorturl/qrcode/${shortCodeID}`);
    //     expect(response.status).toBe(200);
    //     expect(response.header['content-type']).toBe('image/png');
    // }
    // );
});
//# sourceMappingURL=shortUrl.test.js.map