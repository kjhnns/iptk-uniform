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


    describe('GET /api/reviews/:id', function() {
        var submissions = {}, reviews = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });

        before(function() {
            return integrationHelper.reviews(users, submissions, reviews);
        });



        it('should show the author his own review', function(done) {
            request(app)
                .get('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.authorToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body.createdBy !== users.authorUser._id) throw new Error("created by");
                })
                .end(done);
        });


        it('shouldnt show the reviewer the authors review', function(done) {
            request(app)
                .get('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.reviewerToken)
                .expect(404)
                .end(done);
        });


        it('shouldnt show the guest the chair submission', function(done) {
            request(app)
                .get('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(404)
                .end(done);
        });

        it('should send a 404 when a submission wasnt found', function(done) {
            request(app)
                .get('/api/reviews/99999')
                .set('authorization', 'Bearer ' + users.reviewerToken)
                .expect(404)
                .end(done);
        });

        it('should show the chair the guest submission', function(done) {
            request(app)
                .get('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body.createdBy !== users.authorUser._id) throw new Error("created by");
                })
                .end(done);
        });

    });



});
