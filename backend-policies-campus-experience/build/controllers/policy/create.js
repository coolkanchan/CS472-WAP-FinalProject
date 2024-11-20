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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
        res.status(400).json({
            error: "Missing required fields: title, description, or category",
        });
        return;
    }
    const user = req.user;
    if (!user || !user.name) {
        res
            .status(401)
            .json({ error: "Unauthorized: User information is missing" });
        return;
    }
    try {
        const newPolicy = yield (0, utils_1.createPolicy)({
            title,
            description,
            owner: user.name,
            category,
            date: new Date().toISOString(),
            votes: [],
        });
        res.status(201).json(newPolicy);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = create;
