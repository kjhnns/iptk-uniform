'use strict';

angular.module('conferenceApp.dashboard')
  .config(function($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html'
        // controller: 'AdminController',
        // controllerAs: 'admin',
        // authenticate: 'admin'
      });
  });
