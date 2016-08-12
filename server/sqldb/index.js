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
db.User = db.sequelize.import('../api/user/user.model');
db.Submission = db.sequelize.import('../api/submission/submission.model');
db.Review = db.sequelize.import('../api/review/review.model');
db.SubToReviewer = db.sequelize.import('../api/submission/subtoreviewer.model');


db.Review.belongsTo(db.User, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
db.Review.belongsTo(db.Submission, { foreignKey: 'submissionId', onDelete: 'CASCADE' });


db.Submission.belongsTo(db.User, { foreignKey: 'createdBy', onDelete: 'CASCADE' });

db.Submission.hasMany(db.Review, {
    foreignKey: 'submissionId',
    onDelete: 'CASCADE'
});

db.User.belongsToMany(db.Submission, {
    through: db.SubToReviewer,
    as: 'Reviewers',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});


db.Submission.belongsToMany(db.User, {
    through: db.SubToReviewer,
    as: 'Reviewers',
    foreignKey: 'subId',
    onDelete: 'CASCADE'
});


module.exports = db;
