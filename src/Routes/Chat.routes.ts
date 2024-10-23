import express from "express";

import { multerUpload } from "../middleware/multer.middle.ts";
import { isAuthenticated } from "../middleware/auth.middle.ts";
import { newGroupChat } from "../Controller/Chat/Chat.controller.ts";

const router = express.Router();



router.use(isAuthenticated);
router.post("/newgrpchat", newGroupChat);

export default router;
