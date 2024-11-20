import express from "express";

import Auth from "../controllers/auth";

const router = express.Router();

router.post("/signup", Auth.signup);
router.post("/signin", Auth.signin);
router.get("/user", Auth.user);

export default router;
