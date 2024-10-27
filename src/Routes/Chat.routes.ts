import express from "express";

import {
  attachmentsMulter,
  multerUpload,
} from "../middleware/multer.middle.ts";
import { isAuthenticated } from "../middleware/auth.middle.ts";
import {
  addMembers,
  deleteGroup,
  getChatDetails,
  leaveGroup,
  myChats,
  myGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  uploadAttachment,
} from "../Controller/Chat/Chat.controller.ts";

const router = express.Router();

router.use(isAuthenticated);
router.post("/newgrpchat", newGroupChat);
router.get("/mychat", myChats);
router.get("/mygroups", myGroup);
router.put("/addmembers", addMembers);
router.put("/removemembers", removeMembers);
router.delete("/leavegroup/:id", leaveGroup);

router.post("/uploadattachment", attachmentsMulter, uploadAttachment);
router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteGroup);
export default router;
