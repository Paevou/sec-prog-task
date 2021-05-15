var express = require('express');
var router = express.Router();
var userDB = require('../database/userDB');
var passwordHash  = require('password-hash');
var passport = require('passport');

/* POST new user listing. */
router.post('/', function(req, res, next) {
  let body = req.body;
  console.log(body)
  const hash_salt = passwordHash.generate(body['password']);
  body['pw_hash_salt'] = hash_salt;
  userDB.addUser(body)
    .then(result => {
      res.send(result);
    })
});

/* GET user listing. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    userDB.getUserByEmail(req.user.email)
      .then(result => {
        res.send({email: result["email"], lastName: result["lastname"], firstName: result["firstname"]});
      });
  } else {
    console.log("No login");
    res.status(403).send("Access denied");
  }
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}), (req,res) => {
  res.send("login passed");
});

router.get('/logout', (req,res,next) => {
  if(req.isAuthenticated()) {
    req.logOut();
    res.clearCookie('connect.sid', {path: '/'}).status(200).send('Ok.');
  } else {
    res.status(403).send("Access denied");
  }
});

router.post('/update', (req, res, next ) => {
  console.log("Update");
  if(req.isAuthenticated()) {
    console.log("Email: ", req.body);
    userDB.getUserByEmail(req.user.email)
      .then((user) => {
        console.log("Then: ", user)
          if(typeof user === 'error') {res.status(500).send("Error."); }
          else if(user == {}) {res.status(401).send("Could not find."); }
          else if(!passwordHash.verify(req.body.password, user.pw_hash_salt)) {res.status(401).send("Could not find")}
          else {
            console.log("Body:", req.body);
            userDB.updateUser(req.user.email, { firstName: req.body.firstName, lastName: req.body.lastName})
            .then(result => {
              if( typeof result === 'error' ) { res.status( 501 ).send( "Unexpected error." ); }
              else { res.status(200).send("User Updated."); }
            })
          }
      }) 
  }
  // console.log("Update body: ", req.body);
  // res.send("Updated")
});

module.exports = router;