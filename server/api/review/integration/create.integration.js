'use strict';

import app from '../../..';
import { Review, User, SubToReviewer } from '../../../sqldb';
import request from 'supertest';
import * as integrationHelper from '../../../components/integrationHelper';

describe('Review API:', function() {
    var users = {};


    before(function() {
        return Review.destroy({ where: {} });
    });

    before(function(done) {
        integrationHelper.users(done, users)
    });


    describe('POST /api/reviews', function() {
        var submissions = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });


        it('should return a 201 when everythings fine', function(done) {
            request(app)
                .post('/api/reviews')
                .set('authorization', 'Bearer ' + users.reviewerToken)
                .send({
                    evaluation: 'test',
                    expertise: 'HIGH',
                    strongpoints: 'many',
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                    title: 'So good!',
                    submissionId: submissions.guestSub._id
                })
                .expect(function(res) {
                    delete res.body._id;
                    delete res.body.createdAt;
                    delete res.body.updatedAt;
                })
                .expect('Content-Type', /json/)
                .expect(201, {
                    'evaluation': 'test',
                    'expertise': 'HIGH',
                    'strongpoints': 'many',
                    'weakpoints': 'few',
                    'summary': 'SumSumSum',
                    'comment': 'ComComCom',
                    'title': 'So good!',
                    'submissionId': submissions.guestSub._id,
                    'createdBy': users.reviewerUser._id
                }, done);
        });

        it('shouldnt be allowed to create a review for a submission that wasnt assigned', function(done) {
            request(app)
                .post('/api/reviews')
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    evaluation: 'test',
                    expertise: 'HIGH',
                    strongpoints: 'many',
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                    submissionId: submissions.guestSub._id
                })
                .expect(403)
                .end(done);
        });

        it('shouldnt be able to create a review with missing fields', function(done) {
            request(app)
                .post('/api/reviews')
                .set('authorization', 'Bearer ' + users.reviewerToken)
                .send({
                    evaluation: 'test',
                    expertise: 'HIGH',
                    strongpoints: 'many',
                    weakpoints: 'few',
                    submissionId: submissions.guestSub._id
                })
                .expect(400)
                .end(done);
        });

        it('shouldnt be allowed to create a review without reviewer rights', function(done) {
            request(app)
                .post('/api/reviews')
                .set('authorization', 'Bearer ' + users.guestToken)
                .send({
                    evaluation: 'test',
                    expertise: 'HIGH',
                    strongpoints: 'many',
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                    submissionId: submissions.guestSub._id
                })
                .expect(403)
                .end(done);
        });


        it('shouldnt be allowed to create a review without bearer token', function(done) {
            request(app)
                .post('/api/reviews')
                .send({
                    evaluation: 'test',
                    expertise: 'HIGH',
                    strongpoints: 'many',
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                    submissionId: submissions.guestSub._id
                })
                .expect(401)
                .end(done);
        });


    });

});
