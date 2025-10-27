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
exports.deleteDevice = exports.updateDevice = exports.createDevice = exports.getDeviceById = exports.getAllDevices = exports.getDeviceBySerial = void 0;
const db_1 = __importDefault(require("../../db/db"));
// Get device by serial number
const getDeviceBySerial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`[DEVICE] getDeviceBySerial called by user: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.userId}, serial: ${req.params.serial_number}`);
    try {
        const { serial_number } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM device WHERE serial_number = ?', [serial_number]);
        const devices = rows;
        if (devices.length === 0)
            return res.status(404).json({ message: 'Device not found' });
        res.json(devices[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getDeviceBySerial = getDeviceBySerial;
// TODO: integrate with IoT device data stream
const getAllDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    console.log(`[DEVICE] getAllDevices called by user: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.userId}`);
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM device');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const [rows] = yield db_1.default.query('SELECT * FROM device WHERE user_id = ?', [userId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAllDevices = getAllDevices;
const getDeviceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    console.log(`[DEVICE] getDeviceById called by user: ${(_d = req.user) === null || _d === void 0 ? void 0 : _d.userId}, deviceId: ${req.params.id}`);
    try {
        const { id } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM device WHERE device_id = ?', [id]);
        const devices = rows;
        if (devices.length === 0)
            return res.status(404).json({ message: 'Device not found' });
        res.json(devices[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
    try {
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM device WHERE device_id = ? AND user_id = ?', [id, userId]);
        const devices = rows;
        if (devices.length === 0)
            return res.status(404).json({ message: 'Device not found' });
        res.json(devices[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getDeviceById = getDeviceById;
const createDevice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    console.log(`[DEVICE] createDevice called by user: ${(_f = req.user) === null || _f === void 0 ? void 0 : _f.userId}`);
    try {
        const device = req.body;
        const [result] = yield db_1.default.query('INSERT INTO device SET ?', [device]);
        const insertResult = result;
        res.status(201).json(Object.assign({ device_id: insertResult.insertId }, device));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
    try {
        const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const device = Object.assign(Object.assign({}, req.body), { user_id: userId });
        const [result] = yield db_1.default.query('INSERT INTO device SET ?', [device]);
        const insertResult = result;
        res.status(201).json(Object.assign({ device_id: insertResult.insertId }, device));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.createDevice = createDevice;
const updateDevice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    console.log(`[DEVICE] updateDevice called by user: ${(_h = req.user) === null || _h === void 0 ? void 0 : _h.userId}, deviceId: ${req.params.id}`);
    try {
        const { id } = req.params;
        const device = req.body;
        const [result] = yield db_1.default.query('UPDATE device SET ? WHERE device_id = ?', [device, id]);
        const updateResult = result;
        if (updateResult.affectedRows === 0)
            return res.status(404).json({ message: 'Device not found' });
        res.json(Object.assign({ device_id: id }, device));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
    try {
        const userId = (_j = req.user) === null || _j === void 0 ? void 0 : _j.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const device = req.body;
        const [result] = yield db_1.default.query('UPDATE device SET ? WHERE device_id = ? AND user_id = ?', [device, id, userId]);
        const updateResult = result;
        if (updateResult.affectedRows === 0)
            return res.status(404).json({ message: 'Device not found' });
        res.json(Object.assign({ device_id: id }, device));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.updateDevice = updateDevice;
const deleteDevice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l;
    console.log(`[DEVICE] deleteDevice called by user: ${(_k = req.user) === null || _k === void 0 ? void 0 : _k.userId}, deviceId: ${req.params.id}`);
    try {
        const userId = (_l = req.user) === null || _l === void 0 ? void 0 : _l.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const [result] = yield db_1.default.query('DELETE FROM device WHERE device_id = ? AND user_id = ?', [id, userId]);
        const deleteResult = result;
        if (deleteResult.affectedRows === 0)
            return res.status(404).json({ message: 'Device not found' });
        res.json({ device_id: id, message: 'Device deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.deleteDevice = deleteDevice;
