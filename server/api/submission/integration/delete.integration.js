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


    describe('DELETE /api/submissions', function() {
        var submissions = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });


        it('shouldnt delete a submission from chair', function(done) {
            request(app)
                .delete('/api/submissions/' + submissions.chairSub._id)
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(403)
                .end(done);
        });

        it('should send a 404 when sub is not found', function(done) {
            request(app)
                .delete('/api/submissions/9999')
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(403)
                .end(done);
        });

        it('chair cant delete any submission', function(done) {
            request(app)
                .delete('/api/submissions/' + submissions.guestSub._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(404)
                .end(done);
        });


        it('should delete a submission', function(done) {
            request(app)
                .delete('/api/submissions/' + submissions.chairSub._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(204)
                .expect(function(res) {
                    Submission.find({
                        where: {
                            _id: submissions.chairSub._id
                        }
                    }).then(function(o) {
                      console.log("dafdsfds",o);
                        if(o) throw new Error("no obj");
                    })
                })
                .end(done);
        });
    });

});
