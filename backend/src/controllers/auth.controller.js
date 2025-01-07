const connection = require('../../dbconfig/config')
const crypto = require('../security/crypto')
const jwt = require('jsonwebtoken');
// list of controllers　
const loginAccount = (req, res) => {
    const data = req.body;
    var query = "Select * from user where username=?";
    connection.query(query, [data.username], (err, result) => {
        if (!err) {
            if (result.length > 0) {
                const user = result[0];
                const password = user.password;
                const encPass = crypto.hash512(data.password);
                console.log(encPass)
                if (password == encPass) {
                    const response = { id: user.id, name: user.name, email: user.email, username: user.username, work_start: user.work_start, work_end: user.work_end }
                    const accsToken = jwt.sign(response, process.env.SECRET_KEY, { expiresIn: '12h' });
                    return res.json({ message: "Successfully login", data: response, token: accsToken });
                } else {
                    return res.json({ message: "Password didnt match!", })
                }
            } else {
                return res.json({ message: "Username not found", })
            }
        } else {
            return res.json({ message: "Something went wrong", })
        }
    })
} 　
module.exports = { 
    loginAccount, 
}