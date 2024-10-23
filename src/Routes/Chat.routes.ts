import express from "express";

import { multerUpload } from "../middleware/multer.middle.ts";
import { isAuthenticated } from "../middleware/auth.middle.ts";
import { addMembers, myChats, myGroup, newGroupChat, removeMembers } from "../Controller/Chat/Chat.controller.ts";

const router = express.Router();



router.use(isAuthenticated);
router.post("/newgrpchat", newGroupChat);
router.get("/mychat", myChats);
router.get("/mygroups",myGroup)
router.put("/addmembers",addMembers)
router.put("/removemembers",removeMembers)

export default router;
