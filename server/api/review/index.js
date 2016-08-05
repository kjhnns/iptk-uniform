'use strict';

var express = require('express');
var controller = require('./review.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

'gets list of reviews'
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole('reviewer'), controller.create);
router.put('/:id',auth.hasRole('reviewer'), controller.update);
router.delete('/:id', auth.hasRole('reviewer'), controller.destroy);

module.exports = router;
