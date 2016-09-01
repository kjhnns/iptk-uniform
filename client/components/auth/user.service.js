'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    reviewer: {
      method: 'GET',
      params: {
        id: 'reviewer'
      }
    },
    show: {
      method: 'GET'
    },
    count: { method: 'GET', isArray: true, params: { controller: 'rolecount', id: '0' } }
  });
}

angular.module('conferenceApp.auth')
  .factory('User', UserResource);

})();
