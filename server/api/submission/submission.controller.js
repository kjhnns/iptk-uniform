/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 */

'use strict';

import _ from 'lodash';
import { Submission, SubToReviewer, User } from '../../sqldb';
import * as auth from '../../auth/auth.service';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function saveUpdates(updates) {
    return function(entity) {
        return entity.updateAttributes(updates)
            .then(updated => {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.destroy()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            throw 404;

        } else {
            return entity;
        }
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        console.log(err);
        res.status(statusCode).send(err);
    };
}

// Gets a list of Things
export function index(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.findAll({ where: {} })
            .then(respondWithResult(res))
            .catch(handleError(res));
    }, function() {
        return Submission.findAll({ where: { createdBy: req.user._id } })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });
}


// Creates a new Submission in the DB
export function create(req, res) {
    var newSub = Submission.build(req.body);
    newSub.setDataValue('status', 0);
    newSub.setDataValue('createdBy', req.user._id);
    return newSub.save()
        .then(respondWithResult(res, 201))
        .catch(handleError(res, 400));
}

// Gets a single Submission from the DB
export function show(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Submission.find({
                where: {
                    _id: req.params.id
                }
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    }, function() {
        auth.checkReviewerRights(req.user._id, req.params.id, () => {
            return Submission.find({
                    where: {
                        _id: req.params.id
                    }
                })
                .then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));
        }, () => {
            return Submission.find({
                    where: {
                        _id: req.params.id,
                        createdBy: req.user._id
                    }
                })
                .then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));
        });

    });
}


// Updates an existing Submission in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }

    return Submission.find({
            where: {
                _id: req.params.id,
                createdBy: req.user._id
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Submission file in the DB
export function updateFile(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Submission.find({
            where: {
                _id: req.params.id
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
    return Submission.destroy({
            _id: req.params.id,
            createdBy: req.user._id
        })
        .then(function(result) {
            res.status(204).end();
        })
        .catch(handleError(res, 403));
}


/**
 *  set Reviewers to Submissions
 */

export function assign(req, res) {
    var userIsReviewer = function(res) {
        return function(uObj) {
            return auth.checkRoles("reviewer", uObj.dataValues.role, () => {
                console.log("user has reviewer rights");
                return uObj;
            }, () => {
                console.log("no rights unfortunately");
                throw 403;
            })
        };
    }

    var addUserAsReviewer = function(res, sId) {
        return (uObj) => {
            console.log("creating new relation", sId, "-", uObj.dataValues._id);
            return SubToReviewer.create({
                subId: sId,
                userId: uObj.dataValues._id
            });
        };
    };

    return User.find({
            where: {
                _id: req.params.reviewerId
            }
        })
        .then(handleEntityNotFound(res))
        .then(userIsReviewer(res))
        .then(addUserAsReviewer(res, req.params.submissionId))
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}
