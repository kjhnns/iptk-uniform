(function(angular, undefined) {
'use strict';

angular.module('conferenceApp.constants', [])

.constant('appConfig', {userRoles:['guest','author','reviewer','chair']})

;
})(angular);