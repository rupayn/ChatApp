import express from "express";
import {
  getMYProfile,
  logout,
  searchUser,
  signin,
  signup,
} from "../Controller/Auth/Auth.controller.ts";
import { multerUpload } from "../middleware/multer.middle.ts";
import { isAuthenticated } from "../middleware/auth.middle.ts";
const router = express.Router();
router.post("/signup",signup);
router.post("/signin",signin);

router.use(isAuthenticated);
router.post("/logout",logout);
router.get("/me", getMYProfile);
router.get("/search", searchUser);

export default router;
