'use strict';


import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./submission.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.hasRole('author'), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.hasRole('author'), controller.update);
router.put('/file/:id', auth.hasRole('author'), controller.updateFile);
router.delete('/:id', auth.hasRole('author'), controller.destroy);
router.put('/assign/:submissionId/:reviewerId', auth.hasRole('chair'), controller.assign);


module.exports = router;
