import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMYProfile,
  logout,
  renameUser,
  searchUser,
  sendFriendRequest,
  signin,
  signup,
} from "../Controller/Auth/Auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middle.js";
import { noUpload, singleAvatar } from "../middleware/multer.middle.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../utils/validator.js";
const router = express.Router();
router.post("/signup",singleAvatar,registerValidator(),validateHandler, signup);
router.post("/signin",noUpload,loginValidator(),validateHandler, signin);

router.use(isAuthenticated);
router.get("/logout", logout);
router.get("/me", getMYProfile);
router.put("/renameuser",singleAvatar, renameUser);
router.get("/search", searchUser);
router.put("/sendrequest",sendRequestValidator(),validateHandler,sendFriendRequest );
router.put(
  "/acceptrequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);
router.get(
  "/notifications",
  getMyNotifications
);

router.get("/friends",getMyFriends)

export default router;
