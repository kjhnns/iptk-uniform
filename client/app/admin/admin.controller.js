'use strict';

(function() {

    class AdminController {
        constructor(User, Submission) {
            // Use the User $resource to fetch all users
            this.users = User.query();
            this.$submission = Submission;
        }

        delete(user) {
            user.$remove();
            this.users.splice(this.users.indexOf(user), 1);
        }

        role(role) {
          var roles = {0: "Author", 3: "Author, Reviewer", 2: "Author", 1: "Reviewer", 7: "Chair, Author, Reviewer", 6: "Chair, Author"};

          return roles[+role];
        }

    }

    angular.module('conferenceApp.admin')
        .controller('AdminController', AdminController);

})();
