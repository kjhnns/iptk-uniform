'use strict';

var express = require('express');
var controller = require('./submission.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.put('/file/:id', controller.updateFile);
router.delete('/:id', controller.destroy);
//router.post('/:id/assign', controller.assign); tbd

module.exports = router;
