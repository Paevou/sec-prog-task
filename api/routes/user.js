var express = require('express');
var router = express.Router();

/* POST new user listing. */
router.post('/', function(req, res, next) {
  res.send('new user added');
});

module.exports = router;