import { RequestHandler } from "express";

import { IPolicy } from "../../types/IPolicy";

import { createPolicy } from "../../utils";

const create: RequestHandler<
  unknown,
  IPolicy | { error: string },
  { title: string; description: string; category: string }
> = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    res.status(400).json({
      error: "Missing required fields: title, description, or category",
    });
    return;
  }

  const user = req.user;
  if (!user || !user.name) {
    res
      .status(401)
      .json({ error: "Unauthorized: User information is missing" });
    return;
  }

  try {
    const newPolicy = await createPolicy({
      title,
      description,
      owner: user.name,
      category,
      date: new Date().toISOString(),
      votes: [],
    });

    res.status(201).json(newPolicy);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export default create;
