'use strict';

class SubmissionsIndexController {
    constructor(Submission, Auth, User, $window) {
        this.isChair = Auth.isChair;
        this.isAuthor = Auth.isAuthor;
        this.$window = $window;
        this.$submission = Submission;

        this.submissions = [];

        this.submissions = Submission.index();
    }

    delete(pid) {
        var confirmDelete = this.$window.confirm('Are you absolutely sure you want to delete?');
        if (confirmDelete) {
            this.$submission.destroy({ id: pid }, () => {
                this.submissions = this.$submission.index();
            });
        }
    }
}


class SubmissionsEditController {
    constructor(Submission, $state, $stateParams) {
        this.$submission = Submission;
        this.submission = new Submission();
        this.success = false;
        this.badRequest = false;
        this.$state = $state;
        this.$submission = Submission;

        this.id = +$stateParams.id || null;

        if (this.id !== null) {
            this.submission = Submission.show({ id: this.id });
            this.submission._id = this.id;
        }

    }

    save() {
        if (this.id === null) {
            this.$submission.create(this.submission, () => {
                this.success = true;
                this.badRequest = false;
                this.$state.go('submissions.index');
            }, () => {
                this.badRequest = true;
                this.success = false;
            });
        } else {
            this.$submission.update(this.submission, () => {
                this.success = true;
                this.badRequest = false;
                this.$state.go('submissions.index');
            }, () => {
                this.badRequest = true;
                this.success = false;
            });
        }

    }
}

angular.module('conferenceApp.submissions')
    .controller('SubmissionsIndexController', SubmissionsIndexController)
    .controller('SubmissionsEditController', SubmissionsEditController);
