'use strict';

angular.module('conferenceApp.auth', [
  'conferenceApp.constants',
  'conferenceApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
