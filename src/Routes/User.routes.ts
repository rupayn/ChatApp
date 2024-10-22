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

router.use(isAuthenticated);


export default router;
