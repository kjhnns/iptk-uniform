'use strict';

(function() {

    function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
        var safeCb = Util.safeCb;
        var currentUser = {};
        var userRoles = appConfig.userRoles || [];

        if ($cookies.get('token') && $location.path() !== '/logout') {
            currentUser = User.get();
        }

        var Auth = {

            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional, function(error, user)
             * @return {Promise}
             */
            login({ email, password }, callback) {
                return $http.post('/auth/local', {
                        email: email,
                        password: password
                    })
                    .then(res => {
                        $cookies.put('token', res.data.token);
                        currentUser = User.get();
                        return currentUser.$promise;
                    })
                    .then(user => {
                        safeCb(callback)(null, user);
                        return user;
                    })
                    .catch(err => {
                        Auth.logout();
                        safeCb(callback)(err.data);
                        return $q.reject(err.data);
                    });
            },

            /**
             * Delete access token and user info
             */
            logout() {
                $cookies.remove('token');
                currentUser = {};
            },

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional, function(error, user)
             * @return {Promise}
             */
            createUser(user, callback) {
                return User.save(user,
                    function(data) {
                        $cookies.put('token', data.token);
                        currentUser = User.get();
                        return safeCb(callback)(null, user);
                    },
                    function(err) {
                        Auth.logout();
                        return safeCb(callback)(err);
                    }).$promise;
            },

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional, function(error, user)
             * @return {Promise}
             */
            changePassword(oldPassword, newPassword, callback) {
                return User.changePassword({ id: currentUser._id }, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function() {
                    return safeCb(callback)(null);
                }, function(err) {
                    return safeCb(callback)(err);
                }).$promise;
            },

            /**
             * Gets all available info on a user
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, funciton(user)
             * @return {Object|Promise}
             */
            getCurrentUser(callback) {
                if (arguments.length === 0) {
                    return currentUser;
                }

                var value = (currentUser.hasOwnProperty('$promise')) ?
                    currentUser.$promise : currentUser;
                return $q.when(value)
                    .then(user => {
                        safeCb(callback)(user);
                        return user;
                    }, () => {
                        safeCb(callback)({});
                        return {};
                    });
            },

            /**
             * Check if a user is logged in
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, function(is)
             * @return {Bool|Promise}
             */
            isLoggedIn(callback) {
                if (arguments.length === 0) {
                    return currentUser.hasOwnProperty('role');
                }

                return Auth.getCurrentUser(null)
                    .then(user => {
                        var is = user.hasOwnProperty('role');
                        safeCb(callback)(is);
                        return is;
                    });
            },

            /**
             * Check if a user has a specified role or higher
             *   (synchronous|asynchronous)
             *
             * @param  {String}     role     - the role to check against
             * @param  {Function|*} callback - optional, function(has)
             * @return {Bool|Promise}
             */
            hasRole(role, callback) {
                var _hasRole = function(roleHeHas, roleValue) {
                    if ((roleHeHas & userRoles[roleValue]) == userRoles[roleValue]) {
                        return true;
                    } else {
                        return false;
                    }
                };

                if (arguments.length < 2) {
                    return _hasRole(currentUser.role, role);
                }

                return Auth.getCurrentUser(null)
                    .then(user => {
                        var has = (user.hasOwnProperty('role')) ?
                            _hasRole(user.role, role) : false;
                        safeCb(callback)(has);
                        return has;
                    });
            },

            hasId(compId, callback) {
                var _hasId = function(myId, compId) {
                    return myId == compId;
                };

                if (arguments.length < 2) {
                    return _hasId(currentUser._id, compId);
                }

                return Auth.getCurrentUser(null)
                    .then(user => {
                        var has = (user.hasOwnProperty('_id')) ?
                            _hasId(user._id, compId) : false;
                        safeCb(callback)(has);
                        return has;
                    });
            },

            /**
             * Check if a user is an admin
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, function(is)
             * @return {Bool|Promise}
             */
            isChair() {
                return Auth.hasRole
                    .apply(Auth, [].concat.apply(['chair'], arguments));
            },

            isReviewer() {
                return Auth.hasRole
                    .apply(Auth, [].concat.apply(['reviewer'], arguments));
            },

            isAuthor() {
                return Auth.hasRole
                    .apply(Auth, [].concat.apply(['author'], arguments));
            },

            /**
             * Get auth token
             *
             * @return {String} - a token string used for authenticating
             */
            getToken() {
                return $cookies.get('token');
            }
        };

        return Auth;
    }

    angular.module('conferenceApp.auth')
        .factory('Auth', AuthService);

})();
