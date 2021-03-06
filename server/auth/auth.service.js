'use strict';

import passport from 'passport';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import { User, Submission, SubToReviewer } from '../sqldb';
var _ = require('lodash');

var validateJwt = expressJwt({
    secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function(req, res, next) {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function(req, res, next) {
            User.find({
                    where: {
                        _id: req.user._id
                    }
                })
                .then(user => {
                    if (!user) {
                        res.status(401).end();
                        return null;
                    }
                    req.user = user;
                    return next();
                })
                .catch(err => next(err));
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            checkRoles(roleRequired, req.user.role, function() {
                return next();
            }, function() {
                res.status(403).send('Forbidden');
            });
        });

}


export function checkReviewerRights(hisId, subId, granted, denied) {
    SubToReviewer.find({ where: { subId: subId, userId: hisId } })
        .then((relObj) => {
            if (relObj !== null && +relObj.subId === +subId && +relObj.userId === +hisId) {
                console.log("Validate Relation: user " + hisId + " -> sub " + subId + " -> granted");
                return granted();
            } else {
                console.log("Validate Relation: user " + hisId + " -> sub " + subId + " -> forbidden");
                return denied();
            }
        });
};

var validateRole = function(roles, roleHeNeeds, roleHeHas) {
    var roleValue = roles[roleHeNeeds];
    if (roles !== undefined && roleHeNeeds !== undefined) {
        if ((roleHeHas & roleValue) == roleValue) {
            console.log("Validate Role: has " + roleHeHas + " - needs " + roleValue + " -> granted");
            return true;
        } else {
            console.log("Validate Role: has " + roleHeHas + " - needs " + roleValue + " -> denied");
            return false;
        }
    } else {
        console.log("Validate Role: has " + roleHeHas + " - needs " + roleValue + " -> granted");
        return true;
    }
}

export function checkRoles(rolesHeNeeds, rolesHeHas, granted, denied) {
    if (_.isArray(rolesHeNeeds)) {
        var result = false;
        _.forEach(rolesHeNeeds, function(roleRequired, key) {
            if (validateRole(config.userRoles, roleRequired, rolesHeHas)) {
                result = true;
            }
        });
        if (result) {
            return granted();
        } else {
            return denied();
        }
    } else {
        if (validateRole(config.userRoles, rolesHeNeeds, rolesHeHas)) {
            return granted();
        } else {
            return denied();
        }
    }
}


/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
    return jwt.sign({ _id: id, role: role }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
    });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
    if (!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
}
