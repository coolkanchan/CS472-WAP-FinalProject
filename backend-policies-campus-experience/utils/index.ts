import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { IUser } from "../types/IUser";
import { IPolicy } from "../types/IPolicy";
import { RequestHandler } from "express";

export const authMiddleware: RequestHandler<unknown, { error: string }> = (
  req,
  res,
  next
) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IUser;

    req.user = decoded;

    next();
  } catch (err) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
};

const userFilePath = path.join(__dirname, "usersData.json");
const policiesFilePath = path.join(__dirname, "policiesData.json");

const checkAndCreatePoliciesFile = async (): Promise<void> => {
  try {
    await fs.access(policiesFilePath);
  } catch {
    await fs.writeFile(policiesFilePath, "[]");
  }
};

const checkAndCreateFile = async (): Promise<void> => {
  try {
    await fs.access(userFilePath);
  } catch {
    await fs.writeFile(userFilePath, "[]");
  }
};

export const fetchUsers = async (): Promise<IUser[]> => {
  await checkAndCreateFile();
  const fileContent = await fs.readFile(userFilePath, "utf-8");
  return JSON.parse(fileContent);
};

const saveUsers = async (users: IUser[]): Promise<void> => {
  await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
};

export const createNewUser = async (user: IUser): Promise<void> => {
  const users = await fetchUsers();
  const userExists = users.some(
    (existingUser) => existingUser.email === user.email
  );

  if (userExists) {
    throw new Error("User with this email already exists.");
  }

  users.push(user);
  await saveUsers(users);
};

export const validateAndAuthenticateUser = async (
  email: string,
  password: string
) => {
  const users = await fetchUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  const data = await fs.readFile(userFilePath, "utf-8");
  const users: IUser[] = JSON.parse(data);

  const user = users.find((user) => user.id === Number(id));

  return user || null;
};

export const fetchPolicies = async (): Promise<IPolicy[]> => {
  await checkAndCreatePoliciesFile();
  const fileContent = await fs.readFile(policiesFilePath, "utf-8");
  return JSON.parse(fileContent);
};

const savePolicies = async (policies: IPolicy[]): Promise<void> => {
  await fs.writeFile(policiesFilePath, JSON.stringify(policies, null, 2));
};

export const createPolicy = async (
  policyData: Omit<IPolicy, "id">
): Promise<IPolicy> => {
  const policies = await fetchPolicies();

  const newPolicy: IPolicy = {
    id: Date.now(),
    ...policyData,
  };

  policies.push(newPolicy);
  await savePolicies(policies);

  return newPolicy;
};

export const updatePolicy = async (
  policyId: number,
  updates: Partial<IPolicy>
): Promise<IPolicy | null> => {
  const policies = await fetchPolicies();

  const index = policies.findIndex((policy) => policy.id === policyId);
  if (index === -1) {
    return null;
  }

  const updatedPolicy = {
    ...policies[index],
    ...updates,
  };

  policies[index] = updatedPolicy;

  await savePolicies(policies);

  return updatedPolicy;
};
