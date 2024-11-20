import express from "express";

import Policy from "../controllers/policy";

import { authMiddleware } from "../utils";

const router = express.Router();

router.get("/", Policy.get);
router.post("/", authMiddleware, Policy.create);
router.get("/:id", Policy.getPolicy);
router.post("/:id/upvote", authMiddleware, Policy.upvote);

export default router;
