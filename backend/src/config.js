var express = require('express');
var router = express.Router();
const morgan = require('morgan');  
router.use(express.json({ limit: '50mb' }));  
router.use(express.urlencoded({ extended: true, limit: '50mb' }));  
// router.use(express.json());
// router.use(express.urlencoded({ extended: false })); 
router.use(morgan('dev'));


router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200","https://stech.wheba-services.net/dtr/", "https://stech.wheba-services.net");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
}); 
 
module.exports = router;  
 