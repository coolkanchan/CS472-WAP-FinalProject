"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const policy_1 = __importDefault(require("../controllers/policy"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get("/", policy_1.default.get);
router.post("/", utils_1.authMiddleware, policy_1.default.create);
router.get("/:id", policy_1.default.getPolicy);
router.post("/:id/vote", utils_1.authMiddleware, policy_1.default.vote);
exports.default = router;
