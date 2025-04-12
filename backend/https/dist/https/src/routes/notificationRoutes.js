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
exports.notificationRoutes = void 0;
// 7. notificationRoutes.ts
const express_1 = require("express");
const types_1 = require("../types");
const index_1 = __importDefault(require("../../../db/src/index"));
exports.notificationRoutes = (0, express_1.Router)();
exports.notificationRoutes.post("/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = types_1.NotificationSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid notification data" });
    const { message, userId, eventId } = parsed.data;
    const notification = yield index_1.default.notification.create({ data: { message, userId, eventId } });
    res.json({ message: "Notification sent", notification });
}));
exports.notificationRoutes.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const notifications = yield index_1.default.notification.findMany({ where: { userId } });
    res.json({ notifications });
}));
