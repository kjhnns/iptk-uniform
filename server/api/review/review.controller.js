/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { Review } from '../../sqldb';
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
                    return res.status(204).end();
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
        res.status(statusCode).send(err);
    };
}

// Gets a list of Things
export function index(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Review.findAll({ where: {} })
            .then(respondWithResult(res))
            .catch(handleError(res));
    }, function() {
        return Review.findAll({ where: { createdBy: req.user._id } })
            .then(respondWithResult(res))
            .catch(handleError(res));
    });
}

// Gets a single Thing from the DB
export function show(req, res) {
    auth.checkRoles('chair', req.user.role, function() {
        return Review.find({
                where: {
                    _id: +req.params.id
                }
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    }, function() {
        return Review.find({
                where: {
                    _id: +req.params.id,
                    createdBy: req.user._id
                }
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    });
}

// Creates a new Thing in the DB
export function create(req, res) {
    auth.checkReviewerRights(req.user._id, req.body.submissionId, () => {
        var newRev = Review.build(req.body);
        newRev.setDataValue('createdBy', req.user._id);
        return newRev.save()
            .then(respondWithResult(res, 201))
            .catch(handleError(res, 400));
    }, () => {
        return handleError(res, 403)();
    });
}

// Updates an existing Thing in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Review.find({
            where: {
                _id: +req.params.id,
                createdBy: req.user._id
            }
        })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res, 400));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
    return Review.find({
            where: {
                _id: +req.params.id,
                createdBy: req.user._id
            }
        })
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res, 400));
}
