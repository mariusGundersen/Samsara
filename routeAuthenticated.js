const router = require('express').Router();
const qvc = require('qvc');

router.use('/qvc', qvc(
  require('./handlers/container'),
  require('./handlers/spirit'),
  require('./handlers/spiritConfig'),
  require('./handlers/settings'),
  {
    debug: process.env.NODE_ENV === 'development'
  }
));

router.use('/container(s?)/', require('./routes/container'));
router.use('/spirit(s?)/', require('./routes/spirits'));
router.use('/spirit(s?)/', require('./routes/spirit'));
router.use('/spirit(s?)/', require('./routes/life'));
router.use('/setting(s?)/', require('./routes/settings'));
router.use('/', require('./routes/index'));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;