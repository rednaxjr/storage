const express = require('express')
const router = express.Router();
const userController = require("../controllers/user.controller")
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const getUniqueFilename = (filePath, originalName) => {
    let name = path.parse(originalName).name;
    let ext = path.extname(originalName);
    let counter = 1;
    let newFilePath = path.join(filePath, originalName);
    while (fs.existsSync(newFilePath)) {
        newFilePath = path.join(filePath, `${name}_(${counter})${ext}`);
        counter++;
    }
    return newFilePath;
};
const storage = multer.diskStorage({
    destination:
        function (req, file, cb) {
            cb(null, './uploaded_files',);
        },
    filename: (req, file, cb) => {
        const folderPath = path.join(process.cwd(), 'uploaded_files');
        const uniqueFilePath = getUniqueFilename(folderPath, file.originalname);
        const uniqueFileName = path.basename(uniqueFilePath);
        cb(null, uniqueFileName);
    }
});
const upload = multer({
    storage
})
router.get('/getAllFiles', userController.getAllFiles);

router.get('/', userController.getAllUsers);

router.post('/uploadFile', upload.array('files', 10), userController.uploadFile);

router.post('/deleteFile', userController.deleteFile);
router.post('/viewFile', userController.viewFile);
router.get('/downloadFile/:filename', userController.downloadFile);

module.exports = router;