'use strict';

class ReviewsIndexController {
    constructor(Review, Auth, User) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.reviews = [];
        this.submissions = [];

        this.reviews = Review.index();
    }   

}

class ReviewsShowController{
        constructor(Review, Auth, User, $stateParamss) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.review = {};
        this.submission = {};

        this.review = Review.show({ id: $stateParams.id });
    }
}

class ReviewsEditController{}



angular.module('conferenceApp.reviews')
  .controller('ReviewsIndexController', ReviewsIndexController)
  .controller('ReviewsShowController', ReviewsShowController);
