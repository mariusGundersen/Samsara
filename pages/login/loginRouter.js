import Router from 'express-promise-router';
import {login, redirectAfterLogin} from '../../private/authentication';
import page from './index';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  return res.send(layout(page({message: req.flash('error')}), {
    title:'Login',
    menus: []
  }));
});

router.post('/', login(), redirectAfterLogin('/'));
