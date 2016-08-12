/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import { Submission, User, SubToReviewer, Review } from '../sqldb';

var fixtures = { users: [], submissions: [] };


Promise.all([
        User.sync(),
        Submission.sync(),
        Review.sync(),
        SubToReviewer.sync(),

        SubToReviewer.destroy({ where: {} }),
        Review.destroy({ where: {} }),
        Submission.destroy({ where: {} }),
        User.destroy({ where: {} })
    ])
    .then(() => {
        var populate = [];
        var users = [User.build({
                provider: 'local',
                role: 2, // reviewer
                name: 'Author User',
                email: 'author@example.com',
                password: 'asdasd'
            }),
            User.build({
                provider: 'local',
                role: 3, // reviewer + author
                name: 'Reviewer User',
                email: 'reviewer@example.com',
                password: 'asdasd'
            }),
            User.build({
                provider: 'local',
                role: 7,
                name: 'Chair User',
                email: 'chair@example.com',
                password: 'asdasd'
            }),
            User.build({
                provider: 'local',
                name: 'Random User #1',
                email: 'user01@example.com',
                password: 'asdasd'
            }),
            User.build({
                provider: 'local',
                name: 'Random User #2',
                email: 'user02@example.com',
                password: 'asdasd'
            }),
            User.build({
                provider: 'local',
                name: 'Random User #3',
                email: 'user03@example.com',
                password: 'asdasd'
            })
        ];

        users.forEach((val) => {
            populate.push(val.save().then(function(obj) {
                fixtures.users.push(obj.dataValues);
                return obj;
            }));
        });
        return Promise.all(populate);
    })
    .then(() => {
        var populate = [];
        var subs = [{
            title: 'Paper One',
            file: 'www.google.de',
            status: 1,
            keywords: 'best paper ever',
            abstract: 'this is a test',
            createdBy: fixtures.users[0]._id
        }, {
            title: 'Paper Two',
            file: 'www.google.de',
            status: 4,
            keywords: 'secondbest paper ever',
            abstract: 'this is a test number two',
            createdBy: fixtures.users[2]._id
        }, {
            title: 'Paper Three',
            file: 'www.google.de',
            status: 0,
            keywords: 'fsfdsfd paper ever',
            abstract: 'this is a test number two',
            createdBy: fixtures.users[1]._id
        }, {
            title: 'Paper Four',
            file: 'www.google.de',
            status: 0,
            keywords: 'fsfdsfd paper ever',
            abstract: 'this is a test number two',
            createdBy: fixtures.users[0]._id
        }];

        subs.forEach((val) => {
            populate.push(Submission.create(val).then(function(obj) {
                fixtures.submissions.push(obj.dataValues);
                return obj;
            }));
        });
        return Promise.all(populate);
    })
    .then(() => {
        return Review.bulkCreate([{
            evaluation: 'good',
            expertise: 'high',
            strongpoints: 'words',
            weakpoints: 'grammar',
            summary: 'Was a cool summary',
            comment: 'I like summaries',
            createdBy: fixtures.users[1]._id,
            submissionId: fixtures.submissions[0]._id
        }, {
            evaluation: 'bad',
            expertise: 'low',
            strongpoints: 'words',
            weakpoints: 'punctuation',
            summary: 'something',
            comment: 'comment comment comment comment',
            createdBy: fixtures.users[1]._id,
            submissionId: fixtures.submissions[1]._id
        }, {
            evaluation: 'qwe',
            expertise: 'asd',
            strongpoints: 'words',
            weakpoints: 'punctuation',
            summary: 'asdfdsfdsfdsf',
            comment: 'asd asd asd asd ',
            createdBy: fixtures.users[2]._id,
            submissionId: fixtures.submissions[2]._id
        }]);
    })
    .then(() => {
        return SubToReviewer.bulkCreate([{
            subId: fixtures.submissions[2]._id,
            userId: fixtures.users[2]._id
        }, {
            subId: fixtures.submissions[1]._id,
            userId: fixtures.users[1]._id
        }, {
            subId: fixtures.submissions[0]._id,
            userId: fixtures.users[0]._id
        }, {
            subId: fixtures.submissions[3]._id,
            userId: fixtures.users[1]._id
        }]);
    })
    .then(function() {
        console.log("Database populated");
    });
