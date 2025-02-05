const connection = require('../../dbconfig/config');
const crypto = require('../security/crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const shared = require('../security/shared');

//upload
// const { Server } = require('socket.io');
// var express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:4200", // Replace with your Angular app's URL
//         methods: ["GET", "POST"],
//         allowedHeaders: ['Content-Type', 'Authorization']
//     },
// });
 

// const uploadFile = async (req, res) => {
//     const totalBytes = parseInt(req.headers['content-length'], 10);
//     let uploadedBytes = 0;

//     req.on('data', (chunk) => {
//         uploadedBytes += chunk.length;
//         const progress = Math.round((uploadedBytes / totalBytes) * 100);
//         req.io.emit('uploadProgress', { progress });
//     });
  


//     req.on('end', () => {
//         const uploadedFiles = req.files.map((file) => ({
//             filename: file.filename,
//             originalname: file.originalname,
//             path: file.path,
//             size: file.size,
//         }));
//         console.log("Aaas")

//         req.io.emit('uploadComplete', { message: "Upload complete", files: uploadedFiles });
//         res.status(200).json({ message: 'Files uploaded successfully', files: uploadedFiles });
//     });

//     req.on('error', (error) => {
//         console.error("Upload error:", error);
//         res.status(500).json({ error: 'File upload failed' });
//     });
    

// }
// const uploadFile = async (req, res) => {
//     const totalBytes = parseInt(req.headers['content-length'], 10); // Total bytes to be uploaded
//     console.log(totalBytes)
//     let uploadedBytes = 0;
//     var updateProgress = (bytesReceived) => {
//         uploadedBytes += bytesReceived;
//         console.log(`Upload Progress: ${progress}%`);
//         const progress = Math.round((uploadedBytes / totalBytes) * 100);
//         io.emit('uploadProgress', { progress }); // Emit upload progress to client

//     };
//     console.log(updateProgress)
//     req.on('data', (chunk) => updateProgress(chunk.length));
//     req.on('end', () => {
//         io.emit('uploadProgress', { progress: 100 });  // Emit 100% on end
//         console.log("end")
//     });
//     const files = req.files;
//     const uploadedFiles = files.map(file => ({
//         filename: file.filename,
//         originalname: file.originalname,
//         path: file.path,
//     }));
//     // io.emit('uploadProgress', { progress: uploadedFiles });  // Emit 100% on end
//     // });

//     // if (err) {
//     //     console.error('Upload error:', err);
//     //     return res.status(500).json({ message: 'Upload failed', error: err.message });
//     // }
//     // const fileDetails = req.files.map((file) => ({
//     //     filename: file.filename,
//     //     originalname: file.originalname,
//     //     mimetype: file.mimetype,
//     //     path: file.path,
//     //     size: file.size,
//     // }));
//     // console.log('Uploaded files:', fileDetails);
//     res.status(200).json({
//         message: 'Files uploaded successfully',
//         // files: fileDetails,
//     });
// };
// Helper functions for formatting
function formatSpeed(bytesPerSecond) {
    if (bytesPerSecond > 1024 * 1024) {
        return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
    } else if (bytesPerSecond > 1024) {
        return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
    }
    return `${Math.round(bytesPerSecond)} B/s`;
}

function formatRemainingTime(speed, remainingBytes) {
    if (speed === 0) return 'Calculating...';
    const seconds = remainingBytes / speed;
    if (seconds < 60) {
        return `${Math.round(seconds)}s`;
    }
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploaded_files';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const folderPath = path.join(process.cwd(), 'uploaded_files');
        const uniqueFilePath = getUniqueFilename(folderPath, file.originalname);
        const uniqueFileName = path.basename(uniqueFilePath);
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage });


// // Enhanced upload middleware with progress tracking
// const uploadWithProgress = (req, res, next) => {
//     const fileId = req.headers['x-file-id'];
//     const uploadStart = Date.now();
//     let uploadedBytes = 0;
//     let fileSize = parseInt(req.headers['content-length']);

//     req.on('data', (chunk) => {
//         uploadedBytes += chunk.length;
//         const progress = Math.round((uploadedBytes / fileSize) * 100);
//         const elapsedTime = Date.now() - uploadStart;
//         const speed = (uploadedBytes / elapsedTime) * 1000; // bytes per second

//         req.io.emit('uploadProgress', {
//             fileId,
//             progress,
//             uploadedBytes,
//             totalBytes: fileSize,
//             speed: formatSpeed(speed),
//             remainingTime: formatRemainingTime(speed, fileSize - uploadedBytes)
//         });
//     });

//     upload.array('files', 10)(req, res, next);
// };

// Modified upload handler
// const uploadFile = async (req, res) => {
//     try {
//         const files = req.files;
//         if (!files || files.length === 0) {
//             return res.status(400).json({ error: 'No files uploaded' });
//         }

//         const uploadedFiles = files.map(file => ({
//             filename: file.filename,
//             originalname: file.originalname,
//             path: file.path,
//             size: file.size
//         }));

//         // Emit completion event
//         req.io.emit('uploadComplete', {
//             files: uploadedFiles
//         });

//         return res.json({
//             message: 'Files uploaded successfully',
//             uploadedFiles
//         });
//     } catch (error) {
//         console.error('Upload error:', error);
//         return res.status(500).json({ error: 'File upload failed' });
//     }
// };

// list of controllers

const getAllUsers = (req, res, next) => {
    con
    var query = "Select * from user";
    connection.query(query, (err, result) => {
        if (!err) {
            return result
        } else {
            return res.json({
                Message: "Error sql"
            })
        }
    })
};
const getAllFiles = (req, res) => {
    const folderPath = path.join(process.cwd(), 'uploaded_files');

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read the folder' });
        }
        const fileDetails = files.map(file => {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            const mimeType = mime.lookup(file);
            const ftype = shared.detectMimeType(mimeType)
            var d = new Date(stats.mtime);
            time = d.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })
            date = d.toLocaleString('default', { year: 'numeric', day: '2-digit', month: 'long' })

            return {
                name: file,
                size: stats.size,
                type: ftype,
                time: time,
                date: date,
            };
        });
        return res.json({
            files: fileDetails,
        });
    });
};

// const downloadFile = async (req, res) => {
//     console.log("download")
//     const folderPath = path.join(process.cwd(), 'uploaded_files/');
//     const data = req.body;
//     console.log(data)

//     const filePath = path.join(folderPath, data.name);
//     console.log(filePath)
//     res.download(filePath, data.name, (err) => {
//         if (err) {
//             console.error("Error while downloading file:", err);
//             return res.status(500).send("Could not download the file.");
//         }
//     });
//     return res.json({
//         message: 'Files uploaded successfully',

//     });
// };
const downloadFile = async (req, res) => {
    const folderPath = path.join(process.cwd(), 'uploaded_files'); // Path to uploaded files
    const fileName = req.params.filename; // Extract filename from URL
    const file = path.join(folderPath, fileName); // Build full path

    res.download(file, (err) => {
        if (err) {
            return res.status(500).send("Could not download the file.");
        }
        // Success is implied if there's no error, no need for additional response
    });
};


// const uploadFile = async (req, res) => {
//     const files = req.files;
//     const uploadedFiles = files.map(file => ({
//         filename: file.filename,
//         originalname: file.originalname,
//         path: file.path,
//     }));

//     return res.json({
//         message: 'Files uploaded successfully',
//         uploadedFiles,
//     });
// }

// const uploadFile = async (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }

//     // Emit file upload event to clients
//     req.io.emit('fileUploaded', {
//         fileName: req.file.filename,
//         filePath: `/uploads/${req.file.filename}`,
//     });

//     res.status(200).send({
//         message: 'File uploaded successfully.',
//         filePath: `/uploads/${req.file.filename}`,
//     });
// };

const deleteFile = async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ error: 'File name is required' });
    }
    const folderPath = path.join(process.cwd(), 'uploaded_files');
    const filePath = path.join(folderPath, data.name);
    fs.exists(filePath, (exists) => {
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to delete file' });
            }
            res.json({ message: 'File deleted successfully' });
        });
    });
}
const viewFile = (req, res) => {
    const folderPath = path.join(process.cwd(), 'uploaded_files');
    const data = req.body;
    const filePath = path.join(folderPath, data.name);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(data.name)}"`);
    res.setHeader('Content-Type', mimeType);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', (error) => {
        res.status(500).json({ error: 'Error streaming the file' });
    });

};



module.exports = {
    getAllUsers,
    // uploadFile,
    getAllFiles,
    deleteFile,
    viewFile,
    downloadFile,
    // uploadWithProgress
}