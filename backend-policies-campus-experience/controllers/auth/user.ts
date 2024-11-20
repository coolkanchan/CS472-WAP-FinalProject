import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { getUserById } from "../../utils";

import { IUser } from "../../types/IUser";

const user: RequestHandler<
  unknown,
  Omit<IUser, "password"> | { error: string }
> = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };

    const user = await getUserById(decoded.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    res.status(400).json({ error: (err as Error).message });
    return;
  }
};

export default user;
