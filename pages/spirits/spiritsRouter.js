import Router from 'express-promise-router';
import rootMenu from '../../private/menu/root';
import spiritsMenu from '../../private/menu/spirits';
import samsara from 'samsara-lib';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const spirits = await samsara().spirits();
  res.render('spirits/index', {
    title: 'Spirits',
    menus: [rootMenu('spirits'), spiritsMenu(spirits)],
    content: {
      spirits: spirits
    }
  });
});

router.get('/new', async function(req, res, next) {
  const spirits = await samsara().spirits();
  res.render('spirits/new', {
    title: 'New Spirit',
    menus: [rootMenu('spirits'), spiritsMenu(spirits, null, true)],
    content: {}
  });
});
