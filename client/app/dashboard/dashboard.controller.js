'use strict';

class DashboardController {
    constructor(Submission, Auth, User) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.submissions = [];

        this.submissions = Submission.index();

    }


}

angular.module('conferenceApp.api')
    .controller('DashboardController', DashboardController);
