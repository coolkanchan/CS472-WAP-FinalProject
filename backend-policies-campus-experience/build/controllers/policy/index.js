"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = __importDefault(require("./create"));
const get_1 = __importDefault(require("./get"));
const vote_1 = __importDefault(require("./vote"));
const getPolicy_1 = __importDefault(require("./getPolicy"));
const policyController = {
    get: get_1.default,
    getPolicy: getPolicy_1.default,
    create: create_1.default,
    vote: vote_1.default,
};
exports.default = policyController;
