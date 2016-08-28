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
        this.sortbystatus.push(Submission.incompleted());
        this.sortbystatus.push(Submission.completed());
        this.sortbystatus.push(Submission.closed ());
        this.sortbystatus.push(Submission.accepted());
        this.sortbystatus.push(Submission.rejected());


    
    }

    countByStatus(arr){
        var count = new Array(5);

        for(var i = 0; i<count.length; i++){
            count[i] = arr[i].length;
        }


        return count;
    }








    countExpertise = _.memoize(function(reviews){

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


    });




    countPerRole = _.memoize(function(users){


        var result = [0,0,0,0];


        for(var i = 0; i < users.length; i++){

            if(users[i].role != null){
                var rolebin = users[i].role.toString(2);

            }
            else{
                var rolebin = "000";
                result[3]++;
            }


            while(rolebin.length < 3){

                rolebin = "0" + rolebin;
            }

            console.log(rolebin)


            for(var y = 0; y < rolebin.length; y++){

                if(rolebin.charAt(y) == "1"){

                    result[y]++;

                }

            }

        }

        return result;

    });

}


angular.module('conferenceApp.charts')
    .controller('ChartsIndexController', ChartsIndexController);




      


