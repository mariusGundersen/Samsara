import Router from 'express-promise-router';
import root from '../../private/menu/root';

import view from './index';
import menu from './indexMenu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  res.send(layout(view(), {
    title: null,
    menus: [menu()],
  }));
});
