'use strict';

class SubmissionsIndexController {
    constructor(Submission, Auth, User) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.submissions = [];

        this.submissions = Submission.index();
    }
}

class SubmissionsShowController {
    constructor(Submission, Auth, User, $stateParams) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isChair = Auth.isChair;
        this.getCurrentUser = Auth.getCurrentUser;
        this.submission = {};

        this.submission = Submission.show({ id: $stateParams.id });
    }
}

angular.module('conferenceApp.submissions')
    .controller('SubmissionsIndexController', SubmissionsIndexController)
    .controller('SubmissionsShowController', SubmissionsShowController);
