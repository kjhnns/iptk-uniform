'use strict';

import app from '../../..';
import { Submission, SubToReviewer } from '../../../sqldb';
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


    describe('PUT /api/submissions/assign/:submissionId/:reviewerId', function() {
        var submissions = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });



        it('should assign the reviewer to a submission', function(done) {
            request(app)
                .put('/api/submissions/assign/' + submissions.chairSub._id + '/' + users.reviewerUser._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(201)
                .expect(function(res) {
                    SubToReviewer.find({
                        where: {
                            userId: users.reviewerUser._id,
                            subId: submissions.chairSub._id
                        }
                    }).then(function(obj) {
                        if(obj.userId !== users.reviewerUser._id) throw new Error("different user id");
                        if(obj.subId !== submissions.chairSub._id) throw new Error("different sub id");
                    })
                })
                .end(done);
        });

        it('should assign the user with multiple rights to a submission', function(done) {
            request(app)
                .put('/api/submissions/assign/' + submissions.guestSub._id + '/' + users.chairUser._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(201)
                .expect(function(res) {
                    return SubToReviewer.find({
                        where: {
                            userId: users.chairUser._id,
                            subId: submissions.guestSub._id
                        }
                    }).then(function(obj) {
                        if(obj.userId !== users.chairUser._id) throw new Error("different user id");
                        if(obj.subId !== submissions.guestSub._id) throw new Error("different sub id");
                    });
                })
                .end(done)
        });

        it('shouldnt allow guest user to review', function(done) {
            request(app)
                .put('/api/submissions/assign/' + submissions.guestSub._id + '/' + users.guestUser._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(403)
                .end(done);
        });
    });


});
