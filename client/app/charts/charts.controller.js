'use strict';

class ChartsIndexController {
    constructor(Review, Auth, User, Submission, $window) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.reviews = [];
        this.submissions = [];
        this.users = [];
        this.$window = $window;
        this.$review = Review;
        this.$submission = Submission;

        this.reviews = Review.index();
        this.submissions = Submission.index();
        this.users = User.query();


        this.myConfig = {
          "type": "bar",

          "scale-x": {
                "labels": ["incompleted", "completed", "closed", "accepted", "rejected"]
            },
          "series":[
            {}]
        };

        this.reviewChartConfig = {
          "type":"bar",
          "scale-x": {
                "labels": ["No Expertise", "Low", "Mid", "High"]
            },

          "series":[
            {
            }
          ]
        };

        this.usersChartConfig = {
          "type":"bar",
          "scale-x": {
                "labels": ["Chair", "Author", "Reviewer", "Guest"]
            },

          "series":[
            {
            }
          ]
        };

        this.sortbystatus = [];
        this.sortbystatus = Submission.count();

        this.expertisecount = [];
        this.expertisecount = Review.expertisecount();

        this.rolecount = [];
        this.rolecount = User.count();


    
    }

}


angular.module('conferenceApp.charts')
    .controller('ChartsIndexController', ChartsIndexController);




      


