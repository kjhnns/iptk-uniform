'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isChair = Auth.isChair;
    this.isReviewer = Auth.isReviewer;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('conferenceApp')
  .controller('NavbarController', NavbarController);
