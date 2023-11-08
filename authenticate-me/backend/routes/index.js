const express = require('express');
const router = express.Router();

router.get('/hello/world', function(req, res) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

// router.get('/hello/world', (req, res)=> {res.send('Hello World!')});

exports = router;
