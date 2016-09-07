'use strict';

class SubmissionsFileController {
    constructor(Submission, $state, $stateParams, FileUploader, $cookies, Util) {
        this.$submission = Submission;
        this.submission = new Submission();
        this.badRequest = false;
        this.$state = $state;
        this.$submission = Submission;

        this.id = +$stateParams.id || null;

        if (this.id !== null) {
            this.submission = Submission.show({ id: this.id });
            this.submission._id = this.id;
        }

        if ($cookies.get('token')) {
            this.uploader = new FileUploader({
                url: '/api/submissions/' + this.id + '/file',
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('token'),
                    'X-XSRF-TOKEN': $cookies.get('XSRF-TOKEN')
                }, // only for html5
                withCredentials: true
            });
        }

        this.uploader.onCompleteAll = function() {
            $state.go('submissions.index');
        };
    }
}

class SubmissionsIndexController {
    constructor(Submission, Auth, $window, $state) {
        this.isChair = Auth.isChair;
        this.isAuthor = Auth.isAuthor;

        this.$state = $state;
        this.$window = $window;
        this.$submission = Submission;

        this.stateFilter = {};

        this.submissions = [];
        this.submissions = Submission.index();
    }



    setState(state) {
        this.$submission[state + "All"]((obj) => {
            this.badRequest = false;
            this.$state.reload();
        }, () => {
            this.badRequest = true;
        })
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

class SubmissionsAssignController {
    constructor(Submission, Auth, User, $state, $stateParams, appConfig) {
        this.$submission = Submission;
        this.submission = new Submission();
        this.success = false;
        this.badRequest = false;
        this.$state = $state;
        this.$submission = Submission;

        this.users = User.query();

        this.$auth = Auth;

        this.id = +$stateParams.id || null;

        if (this.id !== null) {
            this.submission = Submission.show({ id: this.id });
            this.submission._id = this.id;
        }


        this.reviewerRole = appConfig.userRoles['reviewer'] || -1;
        this.hasRole = function(roleHeHas, roleValue) {
            if ((roleHeHas & roleValue) == roleValue) {
                return true;
            } else {
                return false;
            }
        };
    }

    assign(user) {
        var tmp = new this.$submission({
            userId: user._id,
            subId: this.id
        });

        tmp.$assign({ id: this.id }, () => {
            this.$state.reload();
        });
    }

    isReviewer(user) {
        if (user.hasOwnProperty('role')) {
            return this.hasRole(user.role, this.reviewerRole);
        } else {
            return false;
        }
    }
}


class SubmissionsEditController {
    constructor(Submission, Auth, $state, $stateParams) {
        this.$submission = Submission;
        this.submission = new Submission();
        this.success = false;
        this.badRequest = false;
        this.$state = $state;
        this.$submission = Submission;

        this.$auth = Auth;

        this.id = +$stateParams.id || null;

        if (this.id !== null) {
            this.submission = Submission.show({ id: this.id });
            this.submission._id = this.id;
        }
    }

    setState(state) {
        this.$submission[state]({ id: this.id }, (obj) => {
            this.badRequest = false;
            this.$state.reload();
        }, () => {
            this.badRequest = true;
        })
    }

    isState(state) {
        if (this.submission.hasOwnProperty('status')) {
            return state == this.submission.status;
        } else {
            return false;
        }

    }


    isOwner() {
        if (this.submission.hasOwnProperty('createdBy')) {
            return this.$auth.hasId(this.submission.createdBy);
        } else {
            return false;
        }
    }

    save() {
        if (this.id === null) {
            this.$submission.create(this.submission, (obj) => {
                this.success = true;
                this.badRequest = false;
                this.$state.go('submissions.file', { id: obj._id });
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
    .controller('SubmissionsFileController', SubmissionsFileController)
    .controller('SubmissionsAssignController', SubmissionsAssignController)
    .controller('SubmissionsIndexController', SubmissionsIndexController)
    .controller('SubmissionsEditController', SubmissionsEditController);
