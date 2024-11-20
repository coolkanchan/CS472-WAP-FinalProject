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
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../../utils");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        res.status(400).json({ error: "Email, name, and password are required." });
    }
    try {
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = {
            id: Date.now(),
            email,
            name,
            password: encryptedPassword,
        };
        yield (0, utils_1.createNewUser)(newUser);
        const authResponse = (yield (0, utils_1.validateAndAuthenticateUser)(email, password));
        res.status(201).json(authResponse);
    }
    catch (error) {
        const errorMessage = error.message || "Something went wrong.";
        res.status(500).json({ error: errorMessage });
    }
});
exports.default = signUp;
