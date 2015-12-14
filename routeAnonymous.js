const router = require('express').Router();
const express = require('express');
const path = require('path');

router.use('/deploy', require('./routes/deploy'));

router.use('/login', require('./routes/login'));

router.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

module.exports = router;