import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { createNewUser, validateAndAuthenticateUser } from "../../utils";

import { IUser } from "../../types/IUser";

const signUp: RequestHandler<
  unknown,
  { token: string; id: number } | { error: string },
  IUser
> = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ error: "Email, name, and password are required." });
  }

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = {
      id: Date.now(),
      email,
      name,
      password: encryptedPassword,
    };
    await createNewUser(newUser);

    const authResponse = (await validateAndAuthenticateUser(
      email,
      password
    )) as { token: string };

    res.status(201).json({ ...authResponse, id: newUser.id });
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong.";
    res.status(500).json({ error: errorMessage });
  }
};

export default signUp;
