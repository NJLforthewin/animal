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
exports.deleteBattery = exports.updateBattery = exports.createBattery = exports.getBatteryById = exports.getAllBatteries = void 0;
const db_1 = __importDefault(require("../../db/db"));
// TODO: integrate with IoT device data stream
const getAllBatteries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(`[BATTERY] getAllBatteries called by user: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.userId}`);
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const [rows] = yield db_1.default.query('SELECT * FROM battery WHERE user_id = ?', [userId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAllBatteries = getAllBatteries;
const getBatteryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    console.log(`[BATTERY] getBatteryById called by user: ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.userId}, batteryId: ${req.params.id}`);
    try {
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM battery WHERE battery_id = ? AND user_id = ?', [id, userId]);
        const batteries = rows;
        if (batteries.length === 0)
            return res.status(404).json({ message: 'Battery not found' });
        res.json(batteries[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getBatteryById = getBatteryById;
const createBattery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    console.log(`[BATTERY] createBattery called by user: ${(_e = req.user) === null || _e === void 0 ? void 0 : _e.userId}`);
    try {
        const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const battery = Object.assign(Object.assign({}, req.body), { user_id: userId });
        const [result] = yield db_1.default.query('INSERT INTO battery SET ?', [battery]);
        const insertResult = result;
        res.status(201).json(Object.assign({ battery_id: insertResult.insertId }, battery));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.createBattery = createBattery;
const updateBattery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    console.log(`[BATTERY] updateBattery called by user: ${(_g = req.user) === null || _g === void 0 ? void 0 : _g.userId}, batteryId: ${req.params.id}`);
    try {
        const userId = (_h = req.user) === null || _h === void 0 ? void 0 : _h.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const battery = req.body;
        const [result] = yield db_1.default.query('UPDATE battery SET ? WHERE battery_id = ? AND user_id = ?', [battery, id, userId]);
        const updateResult = result;
        if (updateResult.affectedRows === 0)
            return res.status(404).json({ message: 'Battery not found' });
        res.json(Object.assign({ battery_id: id }, battery));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.updateBattery = updateBattery;
const deleteBattery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    console.log(`[BATTERY] deleteBattery called by user: ${(_j = req.user) === null || _j === void 0 ? void 0 : _j.userId}, batteryId: ${req.params.id}`);
    try {
        const userId = (_k = req.user) === null || _k === void 0 ? void 0 : _k.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const [result] = yield db_1.default.query('DELETE FROM battery WHERE battery_id = ? AND user_id = ?', [id, userId]);
        const deleteResult = result;
        if (deleteResult.affectedRows === 0)
            return res.status(404).json({ message: 'Battery not found' });
        res.json({ message: 'Battery deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.deleteBattery = deleteBattery;
