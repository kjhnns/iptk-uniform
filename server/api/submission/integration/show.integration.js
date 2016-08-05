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
        integrationHelper.users(done, users)
    });


    describe('GET /api/submissions/:id', function() {
        var submissions = {};

        beforeEach(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });



        it('should show the guest his own submission', function(done) {
            request(app)
                .get('/api/submissions/' + submissions.guestSub._id)
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body.createdBy !== users.guestUser._id) throw new Error("created by");
                })
                .end(done);
        });


        it('should show the reviewer the guests submission', function(done) {
            request(app)
                .get('/api/submissions/' + submissions.guestSub._id)
                .set('authorization', 'Bearer ' + users.reviewerToken)
                .expect(200)
                .expect((res) => {
                  if(res.body.createdBy !== users.guestUser._id) throw new Error("created by");
                })
                .end(done);
        });


        it('shouldnt show the guest the chair submission', function(done) {
            request(app)
                .get('/api/submissions/' + submissions.chairSub._id)
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(404)
                .end(done);
        });

        it('should send a 404 when a submission wasnt found', function(done) {
            request(app)
                .get('/api/submissions/99999')
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(404)
                .end(done);
        });

        it('should show the chair the guest submission', function(done) {
            request(app)
                .get('/api/submissions/' + submissions.guestSub._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                  if(res.body.createdBy !== users.guestUser._id) throw new Error("created by");
                })
                .end(done);
        });

    });



});
