import express from "express";
import {
  getMYProfile,
  logout,
  searchUser,
  signin,
  signup,
} from "../Controller/Auth/Auth.controller.ts";
import { isAuthenticated } from "../middleware/auth.middle.ts";
import { noUpload, singleAvatar } from "../middleware/multer.middle.ts";
import { loginValidator, registerValidator, validateHandler } from "../utils/validator.ts";
const router = express.Router();
router.post("/signup",singleAvatar,registerValidator(),validateHandler, signup);
router.post("/signin",noUpload,loginValidator(),validateHandler, signin);

router.use(isAuthenticated);
router.get("/logout", logout);
router.get("/me", getMYProfile);
router.get("/search", searchUser);

export default router;
