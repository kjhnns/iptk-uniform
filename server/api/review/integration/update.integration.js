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



    describe('PUT /api/reviews/:id', function() {
        var submissions = {},
            reviews = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });

        before(function() {
            return integrationHelper.reviews(users, submissions, reviews);
        });



        it('should be possible to edit', function(done) {
            request(app)
                .put('/api/reviews/' + reviews.chairReview._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                })
                .expect(function(res) {
                    delete res.body.createdAt;
                    delete res.body.updatedAt;
                    delete res.body.evaluation;
                    delete res.body.expertise;
                    delete res.body.strongpoints;
                    delete res.body.submissionId;
                })
                .expect('Content-Type', /json/)
                .expect(200, {
                    _id: reviews.chairReview._id,
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                    createdBy: users.chairUser._id
                }, done);
        });

        it('shouldnt be possible to edit another review', function(done) {
            request(app)
                .put('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                })
                .expect(404)
                .end(done);
        });

        it('should send a 404 when review is not found', function(done) {
            request(app)
                .put('/api/reviews/99999')
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    weakpoints: 'few',
                    summary: 'SumSumSum',
                    comment: 'ComComCom',
                })
                .expect(404)
                .end(done);
        });
    });




});
