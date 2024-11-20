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
const getPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const policyId = parseInt(id, 10);
        if (isNaN(policyId)) {
            res.status(400).json({ error: "Invalid policy ID format" });
            return;
        }
        const policies = yield (0, utils_1.fetchPolicies)();
        const policy = policies.find((p) => p.id === policyId);
        if (!policy) {
            res.status(404).json({ error: "Policy not found" });
            return;
        }
        res.status(200).json(policy);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = getPolicy;
