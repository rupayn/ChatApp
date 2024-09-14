import express from 'express';
import { logout, signin, signup } from './Controller/Auth/Auth.controller.ts';

const router = express.Router();

router.get("/signin", signin)
router.get("/signup", signup);
router.get("/logout",logout)

export default router;
