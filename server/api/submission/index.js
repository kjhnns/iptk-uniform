'use strict';

var express = require('express');
var controller = require('./submission.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.update);


module.exports = router;
