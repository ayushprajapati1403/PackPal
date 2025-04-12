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
exports.eventRoutes = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const index_1 = __importDefault(require("../../../db/src/index"));
exports.eventRoutes = (0, express_1.Router)();
// Get all events
exports.eventRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield index_1.default.event.findMany({
            include: {
                categories: {
                    include: {
                        items: true
                    }
                },
                assignments: true
            },
        });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch events" });
    }
}));
// Create new event
exports.eventRoutes.post("/add", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = types_1.EventSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid data" });
    const { eventName, description, startDate, creatorId } = parsed.data;
    try {
        const event = yield index_1.default.event.create({
            data: {
                eventName,
                description,
                startDate: new Date(startDate),
                creatorId
            },
            include: {
                categories: {
                    include: {
                        items: true
                    }
                },
                assignments: true
            }
        });
        res.json({ message: "Event created", event });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create event" });
    }
})));
// Get events by creator
exports.eventRoutes.get("/creator/:creatorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = req.params;
    try {
        const events = yield index_1.default.event.findMany({
            where: { creatorId },
            include: {
                categories: {
                    include: {
                        items: true
                    }
                },
                assignments: true
            },
        });
        res.json({ events });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch events" });
    }
}));
// Update event
exports.eventRoutes.put("/:eventId", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const parsed = types_1.EventSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid data" });
    try {
        const event = yield index_1.default.event.update({
            where: { eventId: eventId },
            data: parsed.data,
            include: {
                categories: {
                    include: {
                        items: true
                    }
                },
                assignments: true
            }
        });
        res.json({ message: "Event updated", event });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update event" });
    }
})));
// Delete event
exports.eventRoutes.delete("/:eventId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        yield index_1.default.event.delete({
            where: { eventId: eventId }
        });
        res.json({ message: "Event deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete event" });
    }
}));
// Invite user to event
exports.eventRoutes.post("/:eventId/invite", ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { email, level } = req.body;
    try {
        // Find user by email
        const user = yield index_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Create assignment
        const assignment = yield index_1.default.assignment.create({
            data: {
                eventId,
                userId: user.id,
                level
            }
        });
        res.json({ message: "User invited", assignment });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to invite user" });
    }
})));
