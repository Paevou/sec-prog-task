var express = require('express');
var router = express.Router();
var userBD = require('../database/userDB');
var passwordHash  = require('password-hash');
var passport = require('passport');

/* POST new user listing. */
router.post('/', function(req, res, next) {
  let body = req.body;
  console.log(body)
  const hash_salt = passwordHash.generate(body['password']);
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

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}), (req,res) => {
  res.send("login pased");
})

module.exports = router;