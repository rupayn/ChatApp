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

// Create new user
router.post("/signup", multerUpload.single("avatar"), signup);
router.post("/signin", signin);

router.use(isAuthenticated);
router.get("/logout", logout);
router.get("/me", getMYProfile);
router.get("/search", searchUser);

export default router;
