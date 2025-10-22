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
exports.deleteAlert = exports.updateAlert = exports.createAlert = exports.getAlertById = exports.getAllAlerts = void 0;
const db_1 = __importDefault(require("../../db/db"));
// TODO: integrate with IoT device data stream
const getAllAlerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM alert');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAllAlerts = getAllAlerts;
const getAlertById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM alert WHERE alert_id = ?', [id]);
        const alerts = rows;
        if (alerts.length === 0)
            return res.status(404).json({ message: 'Alert not found' });
        res.json(alerts[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAlertById = getAlertById;
const createAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alert = req.body;
        const [result] = yield db_1.default.query('INSERT INTO alert SET ?', [alert]);
        const insertResult = result;
        res.status(201).json(Object.assign({ alert_id: insertResult.insertId }, alert));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.createAlert = createAlert;
const updateAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const alert = req.body;
        const [result] = yield db_1.default.query('UPDATE alert SET ? WHERE alert_id = ?', [alert, id]);
        const updateResult = result;
        if (updateResult.affectedRows === 0)
            return res.status(404).json({ message: 'Alert not found' });
        res.json(Object.assign({ alert_id: id }, alert));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.updateAlert = updateAlert;
const deleteAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [result] = yield db_1.default.query('DELETE FROM alert WHERE alert_id = ?', [id]);
        const deleteResult = result;
        if (deleteResult.affectedRows === 0)
            return res.status(404).json({ message: 'Alert not found' });
        res.json({ message: 'Alert deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.deleteAlert = deleteAlert;
