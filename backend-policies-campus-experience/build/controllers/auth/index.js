"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signin_1 = __importDefault(require("./signin"));
const signup_1 = __importDefault(require("./signup"));
const user_1 = __importDefault(require("./user"));
const Auth = {
    signin: signin_1.default,
    signup: signup_1.default,
    user: user_1.default,
};
exports.default = Auth;
