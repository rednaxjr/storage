const connection = require('../../dbconfig/config')
const crypto = require('../security/crypto')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const shared = require('../security/shared') 
const { Server } = require('socket.io');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploaded_files');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },

});
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
    console.log('Resolved folder path:', folderPath);
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
            console.log(stats)
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

    console.log("Downloading file:", file);

    res.download(file, (err) => {
        if (err) {
            console.error("Error while downloading file:", err);
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

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Emit file upload event to clients
    req.io.emit('fileUploaded', {
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`,
    });

    res.status(200).send({
        message: 'File uploaded successfully.',
        filePath: `/uploads/${req.file.filename}`,
    });
};

const deleteFile = async (req, res) => {
    const data = req.body;
    console.log(data)
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
        console.error('Stream error:', error);
        res.status(500).json({ error: 'Error streaming the file' });
    });

};



module.exports = {
    getAllUsers,
    uploadFile,
    getAllFiles,
    deleteFile,
    viewFile,
    downloadFile
}