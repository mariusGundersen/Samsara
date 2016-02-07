import {Router} from 'express';
import qvc from 'qvc';

import containerHandler from './pages/containers/containersHandler';
import spiritHandler from './pages/spirit/spiritHandler';
import spiritConfigHandler from './pages/spirit/spiritConfigHandler';
import spiritSettingsHandler from './pages/spirit/spiritSettingsHandler';
import settingsHandler from './pages/settings/settingsHandler';

import container from './pages/containers/containersRouter';
import spirits from './pages/spirits/spiritsRouter';
import spirit from './pages/spirit/spiritRouter';
import life from './pages/life/lifeRouter';
import settings from './pages/settings/settingsRouter';
import index from './pages/index/indexRouter';

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
