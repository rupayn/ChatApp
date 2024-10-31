import multer from "multer"

export const multerUpload=multer({
    limits:{
        fileSize:1024*1024*50 //50MB
    }
})

export const singleAvatar = multerUpload.single("avatar");

export const noUpload=multer().none()

export const attachmentsMulter = multerUpload.array("files", 5);