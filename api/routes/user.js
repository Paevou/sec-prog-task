var express = require('express');
var router = express.Router();
var userBD = require('../database/userDB');
var passwordHash  = require('password-hash');

/* POST new user listing. */
router.post('/', function(req, res, next) {
  let body = req.body['user'];
  const hash_salt = passwordHash.generate('testPassword');
  body['pw_hash_salt'] = hash_salt;
  userBD.addUser(body)
    .then(result => {
      res.send(result);
    })
});

/* GET user listing. */
router.get('/', function(req, res, next) {
  res.send('new user added');
});

module.exports = router;