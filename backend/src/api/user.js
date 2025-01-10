const express = require('express')
const router = express.Router();
const userController = require("../controllers/user.controller")
const multer = require('multer')
const storage = multer.diskStorage({
    destination: 
    function (req, file, cb) {
        cb(null, './uploaded_files',);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({
    storage 
})


router.get('/', userController.getAllUsers);
router.post('/uploadFile', upload.array('files', 10), userController.uploadFile);  

module.exports = router;