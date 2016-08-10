'use strict';

class ReviewsIndexController {
    constructor(Review, Auth, User, Submission, $window) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.reviews = [];
        this.open = [];
        this.$window = $window;
        this.$review = Review;
        this.$submission = Submission;

        this.reviews = Review.index();
        this.open = Submission.assignedOpen();
    }


    delete(pid) {
        var confirmDelete = this.$window.confirm('Are you absolutely sure you want to delete?');
        if (confirmDelete) {
            this.$review.destroy({ id: pid }, () => {
                this.open = this.$submission.assignedOpen();
                this.reviews = this.$review.index();
            });
        }
    }

}

class ReviewsShowController {
    constructor(Review, Auth, User, $stateParams) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.review = {};

        this.review = Review.show({ id: $stateParams.id });
    }
}

class ReviewsEditController {
    constructor(Review, $state, $stateParams) {
        this.$review = Review;
        this.review = new Review();
        this.success = false;
        this.badRequest = false;
        this.$state = $state;
        this.$review = Review;

        this.id = +$stateParams.id || null;

        if ($state.is('reviews.edit')) {
            this.review = Review.show({ id: this.id });
            this.review._id = this.id;
        } else {
          this.review.submissionId = this.id;
        }

    }

    save() {
        if ($state.is('reviews.create')) {
            this.$review.create(this.review, (obj) => {
                this.success = true;
                this.badRequest = false;
                this.$state.go('reviews.index');
            }, () => {
                this.badRequest = true;
                this.success = false;
            });
        } else {
            this.$review.update(this.review, () => {
                this.success = true;
                this.badRequest = false;
                this.$state.go('reviews.index');
            }, () => {
                this.badRequest = true;
                this.success = false;
            });
        }

    }
}

 {
    constructor(Review, Auth, User, $stateParams) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.review = {};

        this.review = Review.update(this.review);

    }
}



angular.module('conferenceApp.reviews')
    .controller('ReviewsIndexController', ReviewsIndexController)
    .controller('ReviewsShowController', ReviewsShowController);
