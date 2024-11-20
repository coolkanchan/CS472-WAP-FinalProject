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
const vote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId) {
            res.status(401).json({ error: "Unauthorized: User not logged in" });
            return;
        }
        const policyId = parseInt(id, 10);
        if (isNaN(policyId)) {
            res.status(400).json({ error: "Invalid policy ID format" });
            return;
        }
        const policies = yield (0, utils_1.fetchPolicies)();
        const policy = policies.find((policy) => policy.id === policyId);
        if (!policy) {
            res.status(404).json({ error: "Policy not found" });
            return;
        }
        if ((_b = policy.votes) === null || _b === void 0 ? void 0 : _b.includes(userId)) {
            res.status(400).json({ error: "You have already voted for this policy" });
            return;
        }
        const updatedPolicy = yield (0, utils_1.updatePolicy)(policy.id, {
            votes: [...(policy.votes || []), userId],
        });
        if (!updatedPolicy) {
            res.status(500).json({ error: "Failed to update policy" });
            return;
        }
        res.status(200).json({ message: "Vote counted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = vote;
