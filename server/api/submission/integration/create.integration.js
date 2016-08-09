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


    describe('POST /api/submissions', function() {
        it('should return a 201 when everythings fine', function(done) {
            request(app)
                .post('/api/submissions')
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    title: 'Hallo Submission',
                    keywords: 'bla',
                    abstract: 'asd'
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    delete res.body._id;
                    delete res.body.createdAt;
                    delete res.body.updatedAt;
                })
                .expect({
                    fileName: null,
                    fileType: null,
                    file: null,
                    title: 'Hallo Submission',
                    abstract: 'asd',
                    keywords: 'bla',
                    status: 0,
                    createdBy: users.chairUser._id
                })
                .end(done);
        });

        it('should return a 400 when the title is missing', function(done) {
            request(app)
                .post('/api/submissions')
                .set('authorization', 'Bearer ' + users.chairToken)
                .send({
                    keywords: 'bla',
                    abstract: 'asd'
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return a 401 when authorization token is missing', function(done) {
            request(app)
                .post('/api/submissions')
                .send({
                    title: 'test',
                    keywords: 'bla',
                    abstract: 'asd'
                })
                .expect(401)
                .end(done);
        });

        it('should return a 403 when u are using an unauthorized user', function(done) {
            request(app)
                .post('/api/submissions')
                .set('authorization', 'Bearer ' + users.guestToken)
                .send({
                    title: 'test',
                    keywords: 'bla',
                    abstract: 'asd'
                })
                .expect(403)
                .end(done);
        });
    });

});
