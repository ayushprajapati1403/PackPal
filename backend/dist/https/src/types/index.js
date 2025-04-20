"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = exports.CommentSchema = exports.AssignmentSchema = exports.ItemSchema = exports.CategorySchema = exports.EventSchema = exports.SigninSchema = exports.SignupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignupSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string().min(6),
    type: zod_1.default.enum(['user', 'owner']),
    email: zod_1.default.string().email(),
    fullname: zod_1.default.string()
});
exports.SigninSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string().min(6),
});
exports.EventSchema = zod_1.default.object({
    creatorId: zod_1.default.string(),
    description: zod_1.default.string(),
    eventName: zod_1.default.string(),
    startDate: zod_1.default.string()
});
exports.CategorySchema = zod_1.default.object({
    name: zod_1.default.string(),
    eventId: zod_1.default.string()
});
exports.ItemSchema = zod_1.default.object({
    name: zod_1.default.string(),
    categoryId: zod_1.default.string()
});
exports.AssignmentSchema = zod_1.default.object({
    userId: zod_1.default.string(),
    eventId: zod_1.default.string(),
    level: zod_1.default.enum(['Admin', 'Member', 'Viewer'])
});
exports.CommentSchema = zod_1.default.object({
    text: zod_1.default.string(),
    itemId: zod_1.default.string(),
    userId: zod_1.default.string()
});
exports.NotificationSchema = zod_1.default.object({
    message: zod_1.default.string(),
    userId: zod_1.default.string(),
    eventId: zod_1.default.string()
});
