var express = require('express');
var router = express.Router();
var userDB = require('../database/userDB');
var bcrypt = require('bcrypt');
var passport = require('passport');

/* POST new user. */
router.post('/', function(req, res, next) {
  let body = req.body;
  const saltRounds = 10;
  bcrypt.hash(body['password'], saltRounds)
    .then((hash) => {
      body['pw_hash_salt'] = hash;
      userDB.addUser(body)
        .then(result => {
          if(result !== "OK") {
            res.status(500).send("Unexpected error");
          } else {
            res.send(result);
          }
      })
    })
    .catch((err) => {
      res.statusCode(501).send("Unexpected error");
    })
  
})

/* GET user profile. */
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

/* Login, authenticate with passport local strategy. */
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

/**
 * Update user information.
 */
router.post('/update', (req, res, next ) => {
  // Check session.
  if(req.isAuthenticated()) {
    userDB.getUserByEmail(req.user.email)
      .then((user) => {

          if(typeof user === 'error') {res.status(500).send("Error."); }

          else if(user == {}) {res.status(401).send("Could not find."); }
          // Sync operations are not the best. (Could change to async / promises)
          else if(!bcrypt.compareSync(req.body.password, user.pw_hash_salt)) {res.status(401).send("Could not find")}
         
          else {
            // User wants to update password too
            if(typeof req.body.newPassword !== "undefined" && req.body.newPasswordConfirm === req.body.newPassword) {
              
              let saltRounds = 10;
              let newPasswordHash = bcrypt.hashSync(req.body.newPassword, saltRounds);
              userDB.updateUser(req.user.email, { firstName: req.body.firstName, lastName: req.body.lastName, pw_hash_salt: newPasswordHash})
              .then(result => {
                if( typeof result === 'error' ) { res.status( 501 ).send( "Unexpected error." ); }
                else { res.status(200).send("User Updated."); }
              });
            } else {
              userDB.updateUser(req.user.email, { firstName: req.body.firstName, lastName: req.body.lastName})
              .then(result => {
                if( typeof result === 'error' ) { res.status( 501 ).send( "Unexpected error." ); }
                else { res.status(200).send("User Updated."); }
              });
            }
          }
      }) 
  }
});

module.exports = router;