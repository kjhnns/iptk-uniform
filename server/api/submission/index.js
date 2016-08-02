'use strict';


import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./submission.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.put('/file/:id', controller.updateFile);
router.delete('/:id', controller.destroy);
//router.get('/:id/assign', controller.getassign)
router.post('/:id/assign',auth.isAuthenticated(), controller.setassign)


module.exports = router;
