'use strict';

import app from '../..';
import { Submission, User } from '../../sqldb';
import request from 'supertest';

describe('Submission API:', function() {
    var chairToken, guestToken, guestUser, chairUser, reviewerUser;

    before(function() {
        return Submission.destroy({ where: {} });
    });

    before(function(done) {
        var user = User.build({
                name: 'Fake User',
                email: 'test@example.com',
                password: 'password',
                role: 0
            }),
            user2 = User.build({
                name: 'Fake User',
                email: 'testgood@example.com',
                password: 'password',
                role: 7
            }),
            user3 = User.build({
                name: 'Fake User',
                email: 'reviewuser@example.com',
                password: 'password',
                role: 1
            });

        User.sync({ force: true }).then(function() {
            User.destroy({ where: {} }).then(function() {
                user.save().then(function(uobj) {
                    guestUser = uobj.dataValues;
                    user2.save().then(function(uobj2) {
                        chairUser = uobj2.dataValues;
                        user3.save().then(function(uobj3) {
                            reviewerUser = uobj3.dataValues;
                            request(app)
                                .post('/auth/local')
                                .send({
                                    email: 'test@example.com',
                                    password: 'password'
                                })
                                .expect(200)
                                .expect('Content-Type', /json/)
                                .end((err, res) => {
                                    guestToken = res.body.token;
                                    request(app)
                                        .post('/auth/local')
                                        .send({
                                            email: 'testgood@example.com',
                                            password: 'password'
                                        })
                                        .expect(200)
                                        .expect('Content-Type', /json/)
                                        .end((err, res) => {
                                            chairToken = res.body.token;
                                            done();
                                        });
                                });
                        });
                    });
                });
            });
        });
    });


    describe('PUT /api/submissions/assign/:submissionId/:reviewerId', function() {
        var guestSub, chairSub;
        before(function() {
            var sub = Submission.build({
                    title: 'Hallo Submission 1',
                    keywords: 'bla',
                    abstract: 'asd',
                    createdBy: guestUser._id
                }),
                sub2 = Submission.build({
                    title: 'Hallo Submission 2',
                    keywords: 'bla,sdf,qwerer',
                    abstract: 'asd',
                    createdBy: chairUser._id
                });
            return Promise.all([Submission.destroy({ where: {} }), sub.save().then(function(obj) {
                    guestSub = obj.dataValues;
                    return new Promise(function(resolve, reject) { resolve(); });
                }),
                sub2.save().then(function(obj) {
                    chairSub = obj.dataValues;
                    return new Promise(function(resolve, reject) { resolve(); });
                })
            ]);
        });
    });


    describe('DELETE /api/submissions', function() {
        var guestSub, chairSub;
        beforeEach(function() {
            var sub = Submission.build({
                    title: 'Hallo Submission 1',
                    keywords: 'bla',
                    abstract: 'asd',
                    createdBy: guestUser._id
                }),
                sub2 = Submission.build({
                    title: 'Hallo Submission 2',
                    keywords: 'bla,sdf,qwerer',
                    abstract: 'asd',
                    createdBy: chairUser._id
                });
            return Promise.all([
                Submission.destroy({ where: {} }),
                sub.save().then(function(obj) {
                    guestSub = obj.dataValues;
                    return obj;
                }),
                sub2.save().then(function(obj) {
                    chairSub = obj.dataValues;
                    return obj;
                })
            ]);
        });


        it('shouldnt delete a submission from chair', function(done) {
            request(app)
                .delete('/api/submissions/' + chairSub._id)
                .set('authorization', 'Bearer ' + guestToken)
                .expect(401)
                .end(function(err, res) {
                    Submission.find({
                        where: {
                            _id: chairSub._id
                        }
                    }).then(function(o) {
                        expect(o, null);
                        done();
                    })
                });
        });

        it('should send a 404 when sub is not found', function(done) {
            request(app)
                .delete('/api/submissions/9999')
                .set('authorization', 'Bearer ' + guestToken)
                .expect(403)
                .end(done);
        });

        it('chair cant delete any submission', function(done) {
            request(app)
                .delete('/api/submissions/' + guestSub._id)
                .set('authorization', 'Bearer ' + chairToken)
                .expect(500)
                .end(done);
        });


        it('should delete a submission', function(done) {
            request(app)
                .delete('/api/submissions/' + chairSub._id)
                .set('authorization', 'Bearer ' + chairToken)
                .expect(204)
                .end(function(err, res) {
                    Submission.find({
                        where: {
                            _id: chairSub._id
                        }
                    }).then(function(o) {
                        expect(o, null);
                        done();
                    })
                });
        });
    });

    describe('PUT /api/submissions', function() {
        var guestSub, chairSub;
        before(function() {
            var sub = Submission.build({
                    title: 'Hallo Submission 1',
                    keywords: 'bla',
                    abstract: 'asd',
                    createdBy: guestUser._id
                }),
                sub2 = Submission.build({
                    title: 'Hallo Submission 2',
                    keywords: 'bla,sdf,qwerer',
                    abstract: 'asd',
                    createdBy: chairUser._id
                });
            return Promise.all([
                Submission.destroy({ where: {} }),
                sub.save().then(function(obj) {
                    guestSub = obj.dataValues;
                    return obj;
                }),
                sub2.save().then(function(obj) {
                    chairSub = obj.dataValues;
                    return obj;
                })
            ]);
        });



        it('should be possible to edit', function(done) {
            request(app)
                .put('/api/submissions/' + chairSub._id)
                .set('authorization', 'Bearer ' + chairToken)
                .send({
                    _id: 999,
                    keywords: '999',
                    abstract: 'newwww'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.body._id, chairSub._id);
                    expect(res.body.title, "Hallo Submission 2");
                    expect(res.body.keywords, "999");
                    expect(res.body.abstract, "newwww");
                    expect(res.body.createdBy, chairUser._id);
                    done();
                });
        });

        it('shouldnt be possible to edit another sub', function(done) {
            request(app)
                .put('/api/submissions/' + guestSub._id)
                .set('authorization', 'Bearer ' + chairToken)
                .send({
                    title: '2',
                    keywords: '999',
                    abstract: 'newwww'
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should send a 400 when sub is not found', function(done) {
            request(app)
                .put('/api/submissions/99999')
                .set('authorization', 'Bearer ' + chairToken)
                .send({
                    title: '2',
                    keywords: '999',
                    abstract: 'newwww'
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });



    describe('GET /api/submissions/:id', function() {
        var guestSub, chairSub;
        before(function() {
            var sub = Submission.build({
                    title: 'Hallo Submission 1',
                    keywords: 'bla',
                    abstract: 'asd',
                    createdBy: guestUser._id
                }),
                sub2 = Submission.build({
                    title: 'Hallo Submission 2',
                    keywords: 'bla,sdf,qwerer',
                    abstract: 'asd',
                    createdBy: chairUser._id
                });
            return Promise.all([Submission.destroy({ where: {} }), sub.save().then(function(obj) {
                    guestSub = obj.dataValues;
                    return new Promise(function(resolve, reject) { resolve(); });
                }),
                sub2.save().then(function(obj) {
                    chairSub = obj.dataValues;
                    return new Promise(function(resolve, reject) { resolve(); });
                })
            ]);
        });



        it('should show the guest his own submission', function(done) {
            request(app)
                .get('/api/submissions/' + guestSub._id)
                .set('authorization', 'Bearer ' + guestToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.body.createdBy, guestUser._id);
                    done();
                });
        });


        it('shouldnt show the guest the chair submission', function(done) {
            request(app)
                .get('/api/submissions/' + chairSub._id)
                .set('authorization', 'Bearer ' + guestToken)
                .expect(404)
                .end(done);
        });

        it('should send a 404 when a submission wasnt found', function(done) {
            request(app)
                .get('/api/submissions/99999')
                .set('authorization', 'Bearer ' + guestToken)
                .expect(404)
                .end(done);
        });

        it('should show the chair the guest submission', function(done) {
            request(app)
                .get('/api/submissions/' + guestSub._id)
                .set('authorization', 'Bearer ' + chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.body.createdBy, guestUser._id);
                    done();
                });
        });

    });

    describe('GET /api/submissions', function() {
        before(function() {
            var sub = Submission.build({
                    title: 'Hallo Submission 1',
                    keywords: 'bla',
                    abstract: 'asd',
                    createdBy: guestUser._id
                }),
                sub2 = Submission.build({
                    title: 'Hallo Submission 2',
                    keywords: 'bla,sdf,qwerer',
                    abstract: 'asd',
                    createdBy: chairUser._id
                });
            return Promise.all([Submission.destroy({ where: {} }), sub.save(), sub2.save()]);
        });

        it('should only the guest users submissions ', function(done) {
            request(app)
                .get('/api/submissions')
                .set('authorization', 'Bearer ' + guestToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.body[0].createdBy, guestUser._id);
                    done();
                });
        });

        it('should return all submissions with a chair user', function(done) {
            request(app)
                .get('/api/submissions')
                .set('authorization', 'Bearer ' + chairToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.body.length, 2);
                    done();
                });
        });


        it('should return 200 with a logged in user', function(done) {
            request(app)
                .get('/api/submissions')
                .set('authorization', 'Bearer ' + chairToken)
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
                .set('authorization', 'Bearer ' + guestToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return two submissions and return 200', function(done) {
            request(app)
                .post('/api/submissions')
                .set('authorization', 'Bearer ' + chairToken)
                .send({
                    keywords: 'bla',
                    abstract: 'asd'
                })
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });

    describe('POST /api/submissions', function() {
        it('should return a 201 when everythings fine', function(done) {
            request(app)
                .post('/api/submissions')
                .set('authorization', 'Bearer ' + chairToken)
                .send({
                    title: 'Hallo Submission',
                    keywords: 'bla',
                    abstract: 'asd'
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body.file, null);
                    expect(res.body.title, 'Hallo Submission');
                    expect(res.body.abstract, 'asd');
                    expect(res.body.keywords, 'bla');
                    expect(res.body.status, 0);
                    done();
                });
        });

        it('should return a 400 when the title is missing', function(done) {
            request(app)
                .post('/api/submissions')
                .set('authorization', 'Bearer ' + chairToken)
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
                .set('authorization', 'Bearer ' + guestToken)
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
