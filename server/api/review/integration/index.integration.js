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
        integrationHelper.users(done, users);
    });



    describe('GET /api/reviews', function() {
        var submissions = {};
        var reviews = {};

        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });


        before(function() {
            return integrationHelper.reviews(users, submissions, reviews);
        });

        it('should show only the author users reviews ', function(done) {
            request(app)
                .get('/api/reviews')
                .set('authorization', 'Bearer ' + users.authorToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body[0].createdBy !== users.authorUser._id) throw new Error("created by");
                })
                .end(done);
        });

        it('should return all reviews with a chair user', function(done) {
            request(app)
                .get('/api/reviews')
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body.length !== 3) throw new Error("show two");
                })
                .end(done);
        });


        it('should return 200 with a logged in user', function(done) {
            request(app)
                .get('/api/reviews')
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 401 with no token', function(done) {
            request(app)
                .get('/api/reviews')
                .expect(401)
                .end(done);
        });

        it('should return 200 with no rights', function(done) {
            request(app)
                .get('/api/reviews')
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return three reviews and return 200', function(done) {
            request(app)
                .get('/api/reviews')
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body.length !== 3) throw new Error("show three");
                })
                .end(done);
        });
    });


});
