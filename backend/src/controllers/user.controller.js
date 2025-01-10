const connection = require('../../dbconfig/config')
const crypto = require('../security/crypto')
const jwt = require('jsonwebtoken');
const multer = require('multer')
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


// const uploadFile = async (req, res) => {
//     const file = req.files; 

//     const uploadPromises = data.map((file) => {
//         return new Promise((resolve, reject) => {
//             const fileUrl = `http://localhost:3000/uploaded_files/${file.filename}`;

//             var query = `INSERT INTO uploads (name, original_name, filepath) VALUES (?, ?, ?)`;
//             connection.query(query, [data.filename, data.originalname, fileUrl], (err, result) => {
//                 if (err) {
//                     console.error('Error executing query:', err);
//                     return res.status(500).json({ message: "Something went wrong" });
//                 }
//             })
//         });
//     });
//     const results = await Promise.all(uploadPromises); 
//     return res.json({
//         message: 'Files uploaded succesfully.',
//     }); 
// }

const uploadFile = async (req, res) => {
    const data = req.body;
    try {
        const files = req.files;
        const uploadedFiles = files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
        }));
        var getallFiles = `Select * files`
        for (let i = 0; i < uploadedFiles.length; i++) {
            var query = `INSERT INTO files (name, original_name, filepath) VALUES (?, ?, ?)`;
            connection.query(query, [uploadedFiles[i].filename, uploadedFiles[i].originalname, uploadedFiles[i].path], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ message: "Something went wrong" });
                } else {
                    return res.json({
                        message: 'Files uploaded successfully',
                        uploadedFiles,
                    });
                }
            })
        }
        //  else {
        //     var query = `INSERT INTO files (name, original_name, filepath) VALUES (?, ?, ?)`;
        //     connection.query(query, [uploadedFiles.filename, uploadedFiles.originalname, uploadedFiles.path], (err, result) => {
        //         if (err) {
        //             console.error('Error executing query:', err);
        //             return res.status(500).json({ message: "Something went wrong" });
        //         } else {
        //             return res.json({
        //                 message: 'Files uploaded successfully',
        //                 uploadedFiles,
        //             });
        //         }
        //     }) 
        // }
        console.log('Form Data:', req.body);

    } catch (error) {
        console.error('Error during file upload:', error);
        return res.status(500).json({ message: 'File upload failed', error });
    }
}



module.exports = {
    getAllUsers,
    uploadFile,
}