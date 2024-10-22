import express from 'express';
import { logout, signin, signup } from './Controller/Auth/Auth.controller.ts';

const router = express.Router();

// Create new user
router.post("/signup", signup);
router.post("/signin", signin)
router.get("/logout",logout)

export default router;
