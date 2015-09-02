const router = require('express').Router();
const express = require('express');
const path = require('path');

router.use('/deploy', require('./routes/deploy'));
router.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxage: process.env.NODE_ENV === 'development' ? 0 : 60*60*24
}));

module.exports = router;