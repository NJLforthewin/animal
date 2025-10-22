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
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM battery');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAllBatteries = getAllBatteries;
const getBatteryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM battery WHERE battery_id = ?', [id]);
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
    try {
        const battery = req.body;
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
    try {
        const { id } = req.params;
        const battery = req.body;
        const [result] = yield db_1.default.query('UPDATE battery SET ? WHERE battery_id = ?', [battery, id]);
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
    try {
        const { id } = req.params;
        const [result] = yield db_1.default.query('DELETE FROM battery WHERE battery_id = ?', [id]);
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
