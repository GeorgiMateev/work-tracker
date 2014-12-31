'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Article = mongoose.model('Article'),
    ArticleHistory = mongoose.model('ArticleHistory'),
    _ = require('lodash');

/**
 * Create a new version of the article
 */
exports.create = function(req, res) {
    if (!req.body.topic) {
        return res.status(500).send({
            message: 'A new version of an article must be assocciated with a topic. Add topic:{ObjectId} param in the body of the post request.'
        });
    }

    Article.findOne({
        $and: [{topic: req.body.topic}, {user: req.user}]
    }, function (err, article) {
        if (err) {
            return res.status(500).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        // Get the latest version
        if (article) {
            //Create new version with the latest changes from the client
            var newVersion = new Article(req.body);
            newVersion.user = req.user;
            newVersion.version = article.version + 1;

            newVersion.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(article);
                }
            });

            // Save the outdated version in the archive collection
            var oldVersion = new ArticleHistory(article.toObject());
            oldVersion.originalArticle = article._id;

            oldVersion.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            });

            // Delete the outdated version from the collection containing the new versions.
            article.remove(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            });
        }
        else {
            var newArticle = new Article(req.body);
            newArticle.user = req.user;
            newArticle.topic = req.body.topic;
            newArticle.save(function (err) {
                if (err) {
                   return res.status(400).send({
                       message: errorHandler.getErrorMessage(err)
                   });
                } else {
                    // Check that the user has submitted article for the given topic.
                    var i;
                    req.user.reserved.forEach(function (reserved, index) {
                        if(reserved.topic.equals(req.body.topic)) {
                            i = index;
                        }
                    });

                    req.user.reserved[i].set('submitted', true);

                    req.user.save(function (err) {
                        if (err) {
                           return res.status(400).send({
                               message: errorHandler.getErrorMessage(err)
                           });
                        }
                    });

                    res.json(newArticle);
                }
            });
        }        
    });
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
    res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
    Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
    Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};