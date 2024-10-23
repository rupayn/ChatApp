import express from "express";

import { multerUpload } from "../middleware/multer.middle.ts";
import { isAuthenticated } from "../middleware/auth.middle.ts";

const router = express.Router();



router.use(isAuthenticated);


export default router;
