'use strict';

import app from '../';
import { Submission, User, SubToReviewer, Review } from '../sqldb';
import request from 'supertest';


export function submissions(done, users, submissions) {
    submissions.guestSub = null;
    submissions.chairSub = null;

    var sub = Submission.build({
            title: 'Hallo Submission 1',
            keywords: 'bla',
            abstract: 'asd',
            createdBy: users.guestUser._id
        }),
        sub2 = Submission.build({
            title: 'Hallo Submission 2',
            keywords: 'bla,sdf,qwerer',
            abstract: 'asd',
            createdBy: users.chairUser._id
        }),
        sub3 = Submission.build({
            title: 'Hallo Submission 3',
            keywords: 'bla',
            abstract: 'asd',
            createdBy: users.authorUser._id
        });

    var createRelationShip = function(sid, rid) {
        return SubToReviewer.create({
            subId: sid,
            userId: rid
        });
    };

    return Promise.all([Submission.destroy({ where: {} }), sub.save().then(function(obj) {
            submissions.guestSub = obj.dataValues;
            return obj;
        }),
        sub2.save().then(function(obj) {
            submissions.chairSub = obj.dataValues;
            return obj;
        }),
        sub3.save().then(function(obj) {
            submissions.authorSub = obj.dataValues;
            return obj;
        })
    ]).then(() => {
        return Promise.all([
                           // SUBMISSION <- USER
                           // guest <- reviewer
                           // author <- reviewer

            createRelationShip(submissions.guestSub._id, users.reviewerUser._id),
            createRelationShip(submissions.authorSub._id, users.reviewerUser._id)
        ]).then(() => {
            done();
        });
    });
}

// REVIEW -> SUBMISSION
// author -> guest
// reviewer -> chair
// chair -> guest

export function reviews(users, submissions, reviews) {
    reviews.reviewerReview = null;
    reviews.authorReview = null;
    reviews.chairReview = null;

    var rev = Review.build({
            evaluation: 'good',
            expertise: 'High',
            strongpoints: 'words',
            weakpoints: 'grammar',
            summary: 'Was a cool summary',
            comment: 'I like summaries',
            createdBy: users.reviewerUser._id,
            submissionId: submissions.chairSub._id
        }),
        rev2 = Review.build({
            evaluation: 'bad',
            expertise: 'Low',
            strongpoints: 'words',
            weakpoints: 'punctuation',
            summary: 'something',
            comment: 'comment comment comment comment',
            createdBy: users.authorUser._id,
            submissionId: submissions.guestSub._id
        }),
        rev3 = Review.build({
            evaluation: 'qwe',
            expertise: 'No Expertise',
            strongpoints: 'words',
            weakpoints: 'punctuation',
            summary: 'asdfdsfdsfdsf',
            comment: 'asd asd asd asd ',
            createdBy: users.chairUser._id,
            submissionId: submissions.guestSub._id
        });


    return Promise.all([Review.destroy({ where: {} }),
        rev.save().then(function(obj) {
            reviews.reviewerReview = obj.dataValues;
            return obj;
        }),
        rev2.save().then(function(obj) {
            reviews.authorReview = obj.dataValues;
            return obj;
        }),
        rev3.save().then(function(obj) {
            reviews.chairReview = obj.dataValues;
            return obj;
        })
    ]);

}


export function users(done, users) {
    users.chairToken = null;
    users.guestToken = null;
    users.reviewerToken = null;
    users.guestUser = null;
    users.chairUser = null;
    users.reviewerUser = null;
    users.authorUser = null;
    users.authorToken = null;


    var user = User.build({
            name: 'Fake User',
            email: 'test@example.com',
            password: 'password',
            role: 0
        }),
        user2 = User.build({
            name: 'Fake User',
            email: 'testgood@example.com',
            password: 'password',
            role: 7
        }),
        user3 = User.build({
            name: 'Fake User',
            email: 'reviewuser@example.com',
            password: 'password',
            role: 1
        }),
        user4 = User.build({
            name: 'Fake User',
            email: 'authoruser@example.com',
            password: 'password',
            role: 3
        });


    User.sync({ force: true }).then(function() {
        User.destroy({ where: {} }).then(function() {
            user.save().then(function(uobj) {
                users.guestUser = uobj.dataValues;
                user2.save().then(function(uobj2) {
                    users.chairUser = uobj2.dataValues;
                    user3.save().then(function(uobj3) {
                        users.reviewerUser = uobj3.dataValues;
                        user4.save().then(function(uobj4) {
                            users.authorUser = uobj4.dataValues;
                            request(app)
                                .post('/auth/local')
                                .send({
                                    email: 'test@example.com',
                                    password: 'password'
                                })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .end((err, res) => {
                                    users.guestToken = res.body.token;
                                    request(app)
                                        .post('/auth/local')
                                        .send({
                                            email: 'testgood@example.com',
                                            password: 'password'
                                        })
                                        .expect(200)
                                        .expect('Content-Type', /json/)
                                        .end((err, res) => {
                                            users.chairToken = res.body.token;
                                            request(app)
                                                .post('/auth/local')
                                                .send({
                                                    email: 'reviewuser@example.com',
                                                    password: 'password'
                                                })
                                                .expect(200)
                                                .expect('Content-Type', /json/)
                                                .end((err, res) => {
                                                    users.reviewerToken = res.body.token;
                                                    request(app)
                                                        .post('/auth/local')
                                                        .send({
                                                            email: 'authoruser@example.com',
                                                            password: 'password'
                                                        })
                                                        .expect(200)
                                                        .expect('Content-Type', /json/)
                                                        .end((err, res) => {
                                                            users.authorToken = res.body.token;
                                                            done();
                                                        });
                                                });
                                        });
                                });
                        });
                    });
                });
            });
        });
    });
}
