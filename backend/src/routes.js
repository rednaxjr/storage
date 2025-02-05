var express = require('express');
var router = express.Router();
const user = require("./api/user"); 
const auth = require("./api/auth")
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => { 
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {  if (err) {  return res.sendStatus(401); }   req.user = user;   next();   });
    } else {  res.sendStatus(401);  router.use((req, res) => { res.status(404).sendFile('./views/404.html', { root: __dirname }); });   }
};
//public 
router.use('/auth', auth);

router.use('/user', authenticateJWT, user); 

// router.use('/', (req, res) => { res.sendFile('./views/index.html', { root: __dirname }); });
router.use((req, res) => { res.status(404).sendFile('./views/404.html', { root: __dirname }); });

module.exports = router;