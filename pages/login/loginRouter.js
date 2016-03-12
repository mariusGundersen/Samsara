import React from 'react';
import Router from 'express-promise-router';
import {login, redirectAfterLogin} from '../../private/authentication';
import View from './index';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  let errorMessage = req.flash('error');
  return res.send(layout("Login",
    <View message={errorMessage} />
  ));
});

router.post('/', login(), redirectAfterLogin('/'));
