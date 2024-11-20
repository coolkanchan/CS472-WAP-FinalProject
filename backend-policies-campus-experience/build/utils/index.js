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
exports.updatePolicy = exports.createPolicy = exports.fetchPolicies = exports.getUserById = exports.validateAndAuthenticateUser = exports.createNewUser = exports.fetchUsers = exports.authMiddleware = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ error: "Forbidden" });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const userFilePath = path_1.default.join(__dirname, "usersData.json");
const policiesFilePath = path_1.default.join(__dirname, "policiesData.json");
const checkAndCreatePoliciesFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.access(policiesFilePath);
    }
    catch (_a) {
        yield promises_1.default.writeFile(policiesFilePath, "[]");
    }
});
const checkAndCreateFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.access(userFilePath);
    }
    catch (_a) {
        yield promises_1.default.writeFile(userFilePath, "[]");
    }
});
const fetchUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield checkAndCreateFile();
    const fileContent = yield promises_1.default.readFile(userFilePath, "utf-8");
    return JSON.parse(fileContent);
});
exports.fetchUsers = fetchUsers;
const saveUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    yield promises_1.default.writeFile(userFilePath, JSON.stringify(users, null, 2));
});
const createNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, exports.fetchUsers)();
    const userExists = users.some((existingUser) => existingUser.email === user.email);
    if (userExists) {
        throw new Error("User with this email already exists.");
    }
    users.push(user);
    yield saveUsers(users);
});
exports.createNewUser = createNewUser;
const validateAndAuthenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, exports.fetchUsers)();
    const user = users.find((user) => user.email === email);
    if (!user) {
        throw new Error("Invalid email or password.");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { token };
});
exports.validateAndAuthenticateUser = validateAndAuthenticateUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield promises_1.default.readFile(userFilePath, "utf-8");
    const users = JSON.parse(data);
    const user = users.find((user) => user.id === Number(id));
    return user || null;
});
exports.getUserById = getUserById;
const fetchPolicies = () => __awaiter(void 0, void 0, void 0, function* () {
    yield checkAndCreatePoliciesFile();
    const fileContent = yield promises_1.default.readFile(policiesFilePath, "utf-8");
    return JSON.parse(fileContent);
});
exports.fetchPolicies = fetchPolicies;
const savePolicies = (policies) => __awaiter(void 0, void 0, void 0, function* () {
    yield promises_1.default.writeFile(policiesFilePath, JSON.stringify(policies, null, 2));
});
const createPolicy = (policyData) => __awaiter(void 0, void 0, void 0, function* () {
    const policies = yield (0, exports.fetchPolicies)();
    const newPolicy = Object.assign({ id: Date.now() }, policyData);
    policies.push(newPolicy);
    yield savePolicies(policies);
    return newPolicy;
});
exports.createPolicy = createPolicy;
const updatePolicy = (policyId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const policies = yield (0, exports.fetchPolicies)();
    const index = policies.findIndex((policy) => policy.id === policyId);
    if (index === -1) {
        return null;
    }
    const updatedPolicy = Object.assign(Object.assign({}, policies[index]), updates);
    policies[index] = updatedPolicy;
    yield savePolicies(policies);
    return updatedPolicy;
});
exports.updatePolicy = updatePolicy;
