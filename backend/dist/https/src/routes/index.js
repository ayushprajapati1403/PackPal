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
exports.router = void 0;
const express_1 = require("express");
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const types_1 = require("../types");
const index_1 = __importDefault(require("../../../db/src/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const eventRoutes_1 = require("./eventRoutes");
const catagoriesRoutes_1 = require("./catagoriesRoutes");
const itemsRoutes_1 = require("./itemsRoutes");
const assignmentsRoutes_1 = require("./assignmentsRoutes");
const CommentRoutes_1 = require("./CommentRoutes");
const notificationRoutes_1 = require("./notificationRoutes");
exports.router = (0, express_1.Router)();
exports.router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check the user
    const parsedData = types_1.SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "validation failed" });
        return;
    }
    try {
        // Check if email already exists
        const existingUser = yield index_1.default.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        });
        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        // Check if username already exists
        const existingUsername = yield index_1.default.user.findFirst({
            where: {
                username: parsedData.data.username
            }
        });
        if (existingUsername) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(parsedData.data.password, 10);
        const user = yield index_1.default.user.create({
            data: {
                email: parsedData.data.email,
                fullname: parsedData.data.fullname,
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "owner" ? "User" : "User",
            }
        });
        res.json({
            userId: user.id,
            message: "User created successfully"
        });
    }
    catch (e) {
        console.error("Database Error:", e);
        res.status(500).json({ message: "Failed to create user" });
    }
}));
exports.router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Signin validation failed:", parsedData.error);
        res.status(400).json({ message: "Validation failed" });
        return;
    }
    try {
        console.log("Signin attempt for username:", parsedData.data.username);
        const user = yield index_1.default.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        });
        if (!user) {
            res.status(403).json({ message: "User not found" });
            console.log("User not found");
            return;
        }
        const isValid = yield bcrypt_1.default.compare(parsedData.data.password, user.password);
        if (!isValid) {
            res.status(403).json({ message: "Invalid Password" });
            console.log("Invalid Password");
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role
        }, config_1.JWT_PASSWORD);
        res.json({
            token: token
        });
    }
    catch (e) {
        res.status(403).json({ message: "Internal Server Error" });
    }
}));
exports.router.use("/events", eventRoutes_1.eventRoutes);
exports.router.use("/categories", catagoriesRoutes_1.categoryRoutes);
exports.router.use("/items", itemsRoutes_1.itemRoutes);
exports.router.use("/assignments", assignmentsRoutes_1.assignmentRoutes);
exports.router.use("/comments", CommentRoutes_1.commentRoutes);
exports.router.use("/notifications", notificationRoutes_1.notificationRoutes);
