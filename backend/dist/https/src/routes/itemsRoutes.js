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
exports.itemRoutes = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const index_1 = __importDefault(require("../../../db/src/index"));
exports.itemRoutes = (0, express_1.Router)();
exports.itemRoutes.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = types_1.ItemSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid item data" });
    const { name, categoryId } = parsed.data;
    const item = yield index_1.default.item.create({ data: { name, categoryId } });
    res.json({ message: "Item created", item });
}));
exports.itemRoutes.patch("/:id/toggle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const item = yield index_1.default.item.findUnique({ where: { id } });
    if (!item)
        return res.status(404).json({ message: "Item not found" });
    const updated = yield index_1.default.item.update({
        where: { id },
        data: { isPacked: !item.isPacked },
    });
    res.json({ message: "Item updated", updated });
}));
