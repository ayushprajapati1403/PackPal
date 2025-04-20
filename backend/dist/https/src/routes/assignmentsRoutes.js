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
exports.assignmentRoutes = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const index_1 = __importDefault(require("../../../db/src/index"));
exports.assignmentRoutes = (0, express_1.Router)();
exports.assignmentRoutes.post("/assign", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = types_1.AssignmentSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid assignment data" });
    const { userId, eventId, level } = parsed.data;
    const assignment = yield index_1.default.assignment.create({
        data: {
            userId,
            eventId,
            level: level
        }
    });
    res.json({ message: "User assigned", assignment });
}));
exports.assignmentRoutes.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const assignments = yield index_1.default.assignment.findMany({
        where: { userId },
        include: { event: true, categories: true, items: true },
    });
    res.json({ assignments });
}));
