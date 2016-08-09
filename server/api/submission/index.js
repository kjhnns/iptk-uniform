'use strict';


import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./submission.controller');

var router = express.Router();

router.get('/:id/assigned', auth.isAuthenticated(), controller.assigned);
router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.hasRole('author'), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id/reviews', auth.isAuthenticated(), controller.reviews);
router.put('/:id', auth.hasRole('author'), controller.update);
router.post('/:id/file', auth.hasRole('author'), controller.updateFile);
router.get('/:id/file', controller.showFile);
router.delete('/:id', auth.hasRole('author'), controller.destroy);
router.put('/:id/assign', auth.hasRole('chair'), controller.assign);


module.exports = router;
