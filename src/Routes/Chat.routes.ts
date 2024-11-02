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
  getMessages,
  leaveGroup,
  myChats,
  myGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  uploadAttachment,
} from "../Controller/Chat/Chat.controller.ts";
import { addMemberValidator, chatIdValidator, leaveGroupValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from "../utils/validator.ts";

const router = express.Router();

router.use(isAuthenticated);
router.post("/newgrpchat",newGroupValidator(),validateHandler, newGroupChat);
router.get("/mychat", myChats);
router.get("/mygroups", myGroup);
router.put("/addmembers",addMemberValidator(),validateHandler, addMembers);
router.put("/removemembers", removeMemberValidator(),validateHandler, removeMembers);
router.delete("/leavegroup/:id",leaveGroupValidator(),validateHandler, leaveGroup);

router.post("/uploadattachment", attachmentsMulter,sendAttachmentsValidator(),validateHandler, uploadAttachment);

router.get("/getmessages/:id",chatIdValidator(),validateHandler, getMessages);

router
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteGroup);


export default router;
