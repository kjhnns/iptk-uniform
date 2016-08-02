/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');
db.Submission = db.sequelize.import('../api/submission/submission.model');
db.Review = db.sequelize.import('../api/review/review.model');
db.SubToReviewer = db.sequelize.import('../api/submission/subtoreviewer.model');


db.User.belongsToMany(db.Submission, {
	through: "SubToReviewer",
  unique: true,
  foreignKey: 'userId'
});


db.Submission.belongsToMany(db.User, {
  through: "SubToReviewer",
  unique: true,
  foreignKey: 'subId'
});


module.exports = db;
