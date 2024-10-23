import express from "express";

import { multerUpload } from "../middleware/multer.middle.ts";
import { isAuthenticated } from "../middleware/auth.middle.ts";
import { myChats, myGroup, newGroupChat } from "../Controller/Chat/Chat.controller.ts";

const router = express.Router();



router.use(isAuthenticated);
router.post("/newgrpchat", newGroupChat);
router.get("/mychat", myChats);
router.get("/mygroups",myGroup)

export default router;
