'use strict';

class ReviewsIndexController {
    constructor(Review, Auth, User) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.reviews = [];

        this.reviews = Review.index();
    }   

}

class ReviewsShowController{
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

        if (this.id !== null) {
            this.review = Review.show({ id: this.id });
            this.review._id = this.id;
        }

    }

    save() {
        if (this.id === null) {
            this.$review.create(this.review, (obj) => {
                this.success = true;
                this.badRequest = false;
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


angular.module('conferenceApp.reviews')
  .controller('ReviewsIndexController', ReviewsIndexController)
  .controller('ReviewsShowController', ReviewsShowController)
  .controller('ReviewsEditController', ReviewsEditController);
