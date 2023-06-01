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
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
mongoose_1.default.Promise = global.Promise;
class Connection {
    constructor() {
        this.mongoServer = new mongodb_memory_server_1.MongoMemoryServer();
        this.connection = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri();
            const mongooseOpts = {
                serverSelectionTimeoutMS: 1000,
            };
            yield mongoose_1.default.connect(mongoUri, mongooseOpts);
            this.connection = mongoose_1.default.connection;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
            yield this.mongoServer.stop();
        });
    }
    cleanup() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const models = Object.keys(((_a = this.connection) === null || _a === void 0 ? void 0 : _a.models) || {});
            const promises = [];
            models.forEach((model) => {
                var _a;
                promises.push((_a = this.connection) === null || _a === void 0 ? void 0 : _a.models[model].deleteMany({}));
            });
            yield Promise.all(promises);
        });
    }
}
/**
 * Create the initial database connection.
 *
 * @async
 * @return {Promise<Connection>}
 */
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new Connection();
    yield conn.connect();
    return conn;
});
exports.connect = connect;
//# sourceMappingURL=database.js.map