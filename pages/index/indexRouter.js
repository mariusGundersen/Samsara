import Router from 'express-promise-router';
import root from '../../private/menu/root';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  res.render('index', {
    title: null,
    menus: [root()],
    content: {}
  });
});
