const express = require('express')
const router = express.Router();
const userController = require("../controllers/user.controller")
const multer = require('multer')
const path = require('path');
const fs = require('fs');

//upload
const { Server } = require('socket.io');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200", // Replace with your Angular app's URL
        methods: ["GET", "POST"],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
});

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


// router.post('/uploadFile', upload.array('files', 10), userController.uploadFile);

router.post('/uploadFile', (req, res) => {
    const totalBytes = parseInt(req.headers['content-length'], 10); // Total bytes to be uploaded
    let uploadedBytes = 0;
    // const updateProgress = (bytesReceived) => {
    //     uploadedBytes += bytesReceived;
    //     const progress = Math.round((uploadedBytes / totalBytes) * 100);
    //     console.log("progress: " + progress)
    //     io.emit('uploadProgress', { progress }); // Emit upload progress to client

    // };
    const data = {
        pop: "asadw",
        asdaw: "asdaw"
    }
    io.emit("try", data);

    upload.array('files')(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({ message: 'Upload failed', error: err.message });
        }
        const fileDetails = req.files.map((file) => ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            path: file.path,
            size: file.size,
        }));

        io.emit("uploadProgress", {
            files: fileDetails,
            message: 'Files uploaded successfully',
        });

        console.log( fileDetails)
        res.status(200).json({
            message: 'Files uploaded successfully',
            files: fileDetails,
        });
    });
});
// router.post('/uploadFile', upload.array('files', 10), userController.uploadFile);


router.post('/deleteFile', userController.deleteFile);
router.post('/viewFile', userController.viewFile);
router.get('/downloadFile/:filename', userController.downloadFile);

module.exports = router;