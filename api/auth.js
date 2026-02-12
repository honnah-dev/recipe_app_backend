import express from "express";
const router = express.Router();

import { createUser, getUserByEmailAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "email", "password"]), async (req, res) => {
    const { username, email, password } = req.body;
    const user = await createUser(username, email, password);

    const token = createToken({ id: user.id });
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });

router
  .route("/login")
  .post(requireBody(["email", "password"]), async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) return res.status(401).send("Invalid email or password.");

    const token = createToken({ id: user.id });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });

export default router;