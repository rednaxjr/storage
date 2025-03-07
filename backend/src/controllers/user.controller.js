const connection = require('../../dbconfig/config');
const crypto = require('../security/crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const shared = require('../security/shared');
  
 
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
const downloadFile = async (req, res) => {
    const folderPath = path.join(process.cwd(), 'uploaded_files'); 
    const fileName = req.params.filename; 
    const file = path.join(folderPath, fileName); 

    res.download(file, (err) => {
        if (err) {
            return res.status(500).send("Could not download the file.");
        } 
    });
};


const uploadFile = async (req, res) => {
    const files = req.files;
    const uploadedFiles = files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
    }));

    return res.json({
        message: 'Files uploaded successfully',
        uploadedFiles,
    });
} 
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
    uploadFile,
    getAllFiles,
    deleteFile,
    viewFile,
    downloadFile, 
}