import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { fetchUsers } from "../../utils";

const signin: RequestHandler<
  unknown,
  { id: number; token: string } | { error: string },
  { email: string; password: string }
> = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await fetchUsers();

    const user = users.find((user) => user.email === email);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, id: user.id });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export default signin;
