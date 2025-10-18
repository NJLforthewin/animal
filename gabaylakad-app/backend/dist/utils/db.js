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
exports.getClient = exports.query = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const db_config_1 = __importDefault(require("../../db/db.config"));
const pool = promise_1.default.createPool({
    host: db_config_1.default.host,
    user: db_config_1.default.user,
    password: db_config_1.default.password,
    database: db_config_1.default.database,
    port: db_config_1.default.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const query = (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield pool.execute(sql, params);
    return { rows };
});
exports.query = query;
const getClient = () => __awaiter(void 0, void 0, void 0, function* () {
    return pool.getConnection();
});
exports.getClient = getClient;
