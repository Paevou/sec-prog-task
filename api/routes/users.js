var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.user) {
    console.log("USERS", req.user);
    if(req.user.email == 'asd') {
      res.send('lastname of asd: '+req.user.lastname);
    } else {
      res.send('respond with a resource');
    }
  } else {
    console.log("Unauthorized")
    res.send('unauthorized');
  }
});

module.exports = router;
