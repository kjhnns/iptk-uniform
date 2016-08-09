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



    describe('GET /api/submissions/0/assigned', function() {
        var submissions = {};
        var reviews = {};

        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });


        before(function() {
            return integrationHelper.reviews(users, submissions, reviews);
        });

        it('should return 200 with a logged in user', function(done) {
            request(app)
                .get('/api/submissions/0/assigned/')
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });


        it('should show two assigned submissions for the review user', function(done) {
            request(app)
                .get('/api/submissions/0/assigned/')
                .set('authorization', 'Bearer ' + users.reviewerToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (res.body.Submissions.length !== 2) throw new Error("show two");
                })
                .end(done);

        });


        it('should show two assigned open submissions for the review user', function(done) {
            request(app)
                .get('/api/submissions/0/open/')
                .set('authorization', 'Bearer ' + users.reviewerToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (res.body.Submissions.length !== 2) throw new Error("show two");
                })
                .end(done);

        });

    });


});
