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



    describe('PUT /api/submissions/:id', function() {
        var submissions = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });



        it('should be possible to edit', function(done) {
            request(app)
                .put('/api/submissions/' + submissions.chairSub._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    _id: 999,
                    keywords: '999',
                    abstract: 'newwww'
                })
                .expect(function(res) {
                    delete res.body.createdAt;
                    delete res.body.updatedAt;
                    delete res.body.file;
                    delete res.body.status;
                })
                .expect('Content-Type', /json/)
                .expect(200, {
                    _id: submissions.chairSub._id,
                    title: "Hallo Submission 2",
                    keywords: "999",
                    abstract: "newwww",
                    createdBy: users.chairUser._id
                }, done);
        });

        it('shouldnt be possible to edit another sub', function(done) {
            request(app)
                .put('/api/submissions/' + submissions.guestSub._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    title: '2',
                    keywords: '999',
                    abstract: 'newwww'
                })
                .expect(404)
                .end(done);
        });

        it('should send a 404 when sub is not found', function(done) {
            request(app)
                .put('/api/submissions/99999')
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    title: '2',
                    keywords: '999',
                    abstract: 'newwww'
                })
                .expect(404)
                .end(done);
        });
    });




});
