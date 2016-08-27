'use strict';

class ChartsIndexController {
    constructor(Review, Auth, User, Submission, $window) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.reviews = [];
        this.submissions = [];
        this.$window = $window;
        this.$review = Review;
        this.$submission = Submission;

        this.reviews = Review.index();
        this.submissions = Submission.index();

        this.assigned = [];
        this.assignedOpen = [];
        this.assigned = Submission.assigned();
        this.assignedOpen = Submission.assignedOpen();


        this.users = User.query();


        this.myConfig = {
          "type":"bar",

          "scale-x": {
                "labels": ["incompleted", "completed", "closed", "accepted", "rejected"]
            },
          "series":[
            {
            }
          ]
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


    }

    countStatus(arr) {

        var incompleted = 0;
        var completed = 0;
        var closed = 0;
        var accepted = 0;
        var rejected = 0;



        for(var i = 0; i < arr.length; i++){
            if(arr[i].status == 0){
                incompleted++;
            }

            if(arr[i].status == 1){
                completed++;
            }
            if(arr[i].status == 2){
                closed++;
            }
            if(arr[i].status == 3){
                accepted++;
            }
            if(arr[i].status == 4){
                rejected++;
            }
        }

        var status = [incompleted,completed,closed,accepted,rejected];


        return status;

    }


    countExpertise(reviews){

        var result = [0,0,0,0];
        var expertise = ['No Expertise', 'Low', 'Mid', 'High'];



        for(var i = 0; i < reviews.length; i++){
            for(var y = 0; y < expertise.length; y++){
                if(reviews[i].expertise == expertise[y]){
                    result[y]++;
                }
            }

        }

        return result;


    }




    countPerRole(users){


        var result = [0,0,0];

        for(var i = 0; i < users.length; i++){

            var rolebin = users[i].role.toString(2);

            while(rolebin.length < 3){

                rolebin = "0" + rolebin;
            }

            for(var y = 0; y < rolebin.length; y++){

                if(rolebin.charAt(y) == "1"){

                    result[y]++;

                }

            }

        }

        return result;

    }



}


angular.module('conferenceApp.charts')
    .controller('ChartsIndexController', ChartsIndexController);




      


