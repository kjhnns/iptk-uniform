'use strict';

class ReviewsIndexController {
    constructor(Review, Auth, User, Submission) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.reviews = [];

        this.reviews = Review.index();
        this.open = Submission.assignedOpen();
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

class ReviewsEditController{

        constructor(Review, Auth, User, $stateParams){
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
