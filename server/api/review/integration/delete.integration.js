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
      integrationHelper.users(done, users)
    });


    describe('DELETE /api/reviews', function() {
        var submissions = {}, reviews = {};


        before(function(done) {
            return integrationHelper.submissions(done, users, submissions);
        });

        before(function() {
            return integrationHelper.reviews(users, submissions, reviews);
        });


        it('shouldnt delete a review from author not being the author', function(done) {
            request(app)
                .delete('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.guestToken)
                .expect(403)
                .end(done);
        });

        it('should delete my own review', function(done) {
            request(app)
                .delete('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.authorToken)
                .expect(204)
                .end(done);
        });

        it('chair shouldnt delete any review', function(done) {
            request(app)
                .delete('/api/reviews/' + reviews.authorReview._id)
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(404)
                .end(done);
        });

        it('should send a 404 when sub is not found', function(done) {
            request(app)
                .delete('/api/reviews/999999999')
                .set('authorization', 'Bearer ' + users.chairToken)
                .expect(404)
                .end(done);
        });

    });

});
