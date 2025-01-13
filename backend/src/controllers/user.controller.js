const connection = require('../../dbconfig/config')
const crypto = require('../security/crypto')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
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
            return {
                name: file,
                size: stats.size,
                type: mimeType,
            };
        });
        return res.json({
            files: fileDetails,
        });
    });
};

// const uploadFile = async (req, res) => {
//     // const data = req.body;
//     // const files =  getAllFiles;

//     // try {
//         const files = req.files;
//         const uploadedFiles = files.map(file => ({
//             filename: file.filename,
//             originalname: file.originalname,
//             path: file.path,
//         }));
//     //     var getallFiles = `Select * files`
//     //     for (let i = 0; i < uploadedFiles.length; i++) {
//     //         var query = `INSERT INTO files (name, original_name, filepath) VALUES (?, ?, ?)`;
//     //         connection.query(query, [uploadedFiles[i].filename, uploadedFiles[i].originalname, uploadedFiles[i].path], (err, result) => {
//     //             if (err) {
//     //                 console.error('Error executing query:', err);
//     //                 return res.status(500).json({ message: "Something went wrong" });
//     //             } else {
//     //                 return res.json({
//     //                     message: 'Files uploaded successfully',
//     //                     uploadedFiles,
//     //                 });
//     //             }
//     //         })
//     //     }
//     //     //  else {
//     //     //     var query = `INSERT INTO files (name, original_name, filepath) VALUES (?, ?, ?)`;
//     //     //     connection.query(query, [uploadedFiles.filename, uploadedFiles.originalname, uploadedFiles.path], (err, result) => {
//     //     //         if (err) {
//     //     //             console.error('Error executing query:', err);
//     //     //             return res.status(500).json({ message: "Something went wrong" });
//     //     //         } else {
//     //     //             return res.json({
//     //     //                 message: 'Files uploaded successfully',
//     //     //                 uploadedFiles,
//     //     //             });
//     //     //         }
//     //     //     }) 
//     //     // }
//     //     console.log('Form Data:', req.body);

//     // } catch (error) {


//     // if () {
//     //     res.status(500).json({ message: 'File upload failed', error });
//     // } else {
//         return res.json({
//             message: 'Files uploaded successfully',
//             uploadedFiles,
//         });
//     // }
//     // console.error('Error during file upload:', error);
//     // return res.status(500).json({ message: 'File upload failed', error });
//     // }
// }
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
    viewFile
}