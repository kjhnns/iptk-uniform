'use strict';

(function() {

    class MainController {

        constructor(User, Auth, $state, Review, Submission) {
            this.$auth = Auth;
            this.$user = User;
            this.state = $state;
            this.$review = Review;
            this.$submission = Submission;


            this.reviews = Review.index();
            this.submissions = Submission.index();
        }

        reviewer() {
            this.$user.reviewer(() => {
                this.state.reload();
            })
        }

    }

    angular.module('conferenceApp')
        .component('main', {
            templateUrl: 'app/main/main.html',
            controller: MainController,
            controllerAs: 'ctrl'
        });

})();
