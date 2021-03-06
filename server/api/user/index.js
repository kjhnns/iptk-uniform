'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('chair'), controller.index);
router.delete('/:id', auth.hasRole('chair'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/reviewer', auth.isAuthenticated(), controller.reviewer);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.get('/:id/rolecount', auth.hasRole('chair'), controller.getCountPerRole);

module.exports = router;
