var crypto = require('crypto');
var key = '19950609';
// exports.des = {
//   algorithm: {
//     ecb: 'des-ecb',
//     cbc: 'des-cbc'
//   },
//   encrypt: function(plaintext, iv){
//     var key = new Buffer(key);
//     var iv = new Buffer(iv ? iv : 0);
//     var cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
//     cipher.setAutoPadding(true);
//     var ciph = cipher.update(plaintext, 'utf8', 'base64');
//     ciph += cipher.final('base64');
//     return ciph;
//   },
//   decrypt: function(encrypt)
// }
