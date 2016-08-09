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



    describe('POST /api/submissions/:id/file', function() {
        var submissions = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });



        it('should be possible to upload a file for a submission', function(done) {
            request(app)
                .post('/api/submissions/' + submissions.chairSub._id + '/file')
                .set('authorization', 'Bearer ' + users.chairToken)
                .attach('file', 'README.md')
                .expect(200)
                .expect((res) => {
                    if (res.body.fileName !== "README.md") throw new Error("file");
                })
                .end(done);
        });

    });

    describe('GET /api/submissions/:id/file', function() {
        var submissions = {};

        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });

        it('should be possible to retrieve a file', function(done) {
            request(app)
                .post('/api/submissions/' + submissions.chairSub._id + '/file')
                .set('authorization', 'Bearer ' + users.chairToken)
                .attach('file', 'README.md')
                .expect(200)
                .expect((res) => {
                    if (res.body.fileName !== "README.md") throw new Error("file");
                })
                .end(() => {
                    return request(app)
                        .get('/api/submissions/' + submissions.chairSub._id + '/file')
                        .expect(200)
                        .end(done);
                })


        });

    });




});
