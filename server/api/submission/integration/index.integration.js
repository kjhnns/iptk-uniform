'use strict';

import app from '../../..';
import { Submission, User, SubToReviewer } from '../../../sqldb';
import request from 'supertest';
import * as integrationHelper from '../../../components/integrationHelper';

describe('Submission API:', function() {
    var users = {};


    before(function() {
        return Submission.destroy({ where: {} });
    });

    before(function(done) {
        integrationHelper.users(done, users);
    });



    describe('GET /api/submissions', function() {
        var submissions = {};
        var reviews = {};

        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });


        before(function() {
            return integrationHelper.reviews(users, submissions, reviews);
        });

        it('should only the guest users submissions ', function(done) {
            request(app)
                .get('/api/submissions')
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body[0].createdBy !== users.guestUser._id) throw new Error("created by");
                })
                .end(done);
        });

        it('should return all submissions with a chair user', function(done) {
            request(app)
                .get('/api/submissions')
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body.length !== 3) throw new Error("show three");
                })
                .end(done);
        });


        it('should return 200 with a logged in user', function(done) {
            request(app)
                .get('/api/submissions')
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 401 with no token', function(done) {
            request(app)
                .get('/api/submissions')
                .expect(401)
                .end(done);
        });

        it('should return 200 with no rights', function(done) {
            request(app)
                .get('/api/submissions')
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return three submissions and return 200', function(done) {
            request(app)
                .get('/api/submissions')
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
