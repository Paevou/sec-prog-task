var express = require('express');
var router = express.Router();
var userBD = require('../database/userDB');
var passwordHash  = require('password-hash');

/* POST new user listing. */
router.post('/', function(req, res, next) {
  let body = req.body['user'];
  console.log(req.body['user']);
  const hash_salt = passwordHash.generate('testPassword');
  console.log("HASH", hash_salt)
  body['pw_hash_salt'] = hash_salt;
  console.log(body)
  let result = userBD.addUser(body);
  console.log("Result: ", result)
  res.send('new user added');
});

/* GET user listing. */
router.get('/', function(req, res, next) {
  res.send('new user added');
});

module.exports = router;