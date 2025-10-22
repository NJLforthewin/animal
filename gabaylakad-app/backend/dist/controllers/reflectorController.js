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
exports.deleteReflector = exports.updateReflector = exports.createReflector = exports.getReflectorById = exports.getAllReflectors = void 0;
const db_1 = __importDefault(require("../../db/db"));
// TODO: integrate with IoT device data stream
const getAllReflectors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM reflector');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAllReflectors = getAllReflectors;
const getReflectorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM reflector WHERE reflector_id = ?', [id]);
        const reflectors = rows;
        if (reflectors.length === 0)
            return res.status(404).json({ message: 'Reflector not found' });
        res.json(reflectors[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getReflectorById = getReflectorById;
const createReflector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reflector = req.body;
        const [result] = yield db_1.default.query('INSERT INTO reflector SET ?', [reflector]);
        const insertResult = result;
        res.status(201).json(Object.assign({ reflector_id: insertResult.insertId }, reflector));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.createReflector = createReflector;
const updateReflector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const reflector = req.body;
        const [result] = yield db_1.default.query('UPDATE reflector SET ? WHERE reflector_id = ?', [reflector, id]);
        const updateResult = result;
        if (updateResult.affectedRows === 0)
            return res.status(404).json({ message: 'Reflector not found' });
        res.json(Object.assign({ reflector_id: id }, reflector));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.updateReflector = updateReflector;
const deleteReflector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [result] = yield db_1.default.query('DELETE FROM reflector WHERE reflector_id = ?', [id]);
        const deleteResult = result;
        if (deleteResult.affectedRows === 0)
            return res.status(404).json({ message: 'Reflector not found' });
        res.json({ message: 'Reflector deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.deleteReflector = deleteReflector;
