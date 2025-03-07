var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
// var SHA512 = require("crypto-js/sha512"); 
require('dotenv').config();

function hash512(data) {
    // const ciphertext = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
    // const ciphertext = CryptoJS.SHA512(data).toString();
    const ciphertext = CryptoJS.SHA512(data).toString(CryptoJS.enc.Hex);
    return ciphertext
}
function encrypt(data) {
    // const ciphertext = CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
    const ciphertext = CryptoJS.SHA512(data).toString();
    return ciphertext
}
function decrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
 

module.exports = {
    encrypt, 
    decrypt,
    hash512
}