import {Router} from 'express';
import qvc from 'qvc';

import containerHandler from './handlers/container';
import spiritHandler from './handlers/spirit';
import spiritConfigHandler from './handlers/spiritConfig';
import spiritSettingsHandler from './handlers/spiritSettings';
import settingsHandler from './handlers/settings';

import container from './routes/container';
import spirits from './routes/spirits';
import spirit from './routes/spirit';
import life from './routes/life';
import settings from './routes/settings';
import index from './routes/index';

const router = Router();
export default router;

router.use('/qvc', qvc(
  containerHandler,
  spiritHandler,
  spiritConfigHandler,
  spiritSettingsHandler,
  settingsHandler,
  {
    debug: process.env.NODE_ENV === 'development',
    cacheConstraints: process.env.NODE_ENV === 'development' ? false : 84600
  }
));

router.use('/container(s?)/', container);
router.use('/spirit(s?)/', spirits);
router.use('/spirit(s?)/', spirit);
router.use('/spirit(s?)/', life);
router.use('/setting(s?)/', settings);
router.use('/', index);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
