(function(angular, undefined) {
'use strict';

angular.module('conferenceApp.constants', [])

.constant('appConfig', {userRoles:{guest:0,reviewer:1,author:2,chair:4}})

;
})(angular);