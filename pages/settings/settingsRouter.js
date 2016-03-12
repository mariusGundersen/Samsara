import React from 'react';
import Router from 'express-promise-router';
import samsara from 'samsara-lib';

import SettingsView from './index';
import IndexMenu from '../index/menu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const users = await samsara().users();
  res.send(layout('Settings',
    <IndexMenu selected="settings" />,
    <SettingsView users={users.map(user => ({username: user.username}))} />
  ));
});
