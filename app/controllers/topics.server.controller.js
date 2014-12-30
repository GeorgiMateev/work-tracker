'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Topic = mongoose.model('Topic'),
	_ = require('lodash');

/**
 * Create a Topic
 */
exports.create = function(req, res) {
	var topic = new Topic(req.body);
	topic.user = req.user;

	topic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topic);
		}
	});
};

/**
 * Show the current Topic
 */
exports.read = function(req, res) {
	res.jsonp(req.topic);
};

/**
 * Update a Topic
 */
exports.update = function(req, res) {
	var topic = req.topic ;

	topic = _.extend(topic , req.body);

	topic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topic);
		}
	});
};

/**
 * Delete an Topic
 */
exports.delete = function(req, res) {
	var topic = req.topic ;

	topic.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topic);
		}
	});
};

/**
 * List of Topics
 */
exports.list = function(req, res) { 
	Topic.find().sort('-created').populate('user', 'displayName').exec(function(err, topics) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(topics);
		}
	});
};

/**
 * Topic middleware
 */
exports.topicByID = function(req, res, next, id) { 
	Topic.findById(id).populate('user', 'displayName').exec(function(err, topic) {
		if (err) return next(err);
		if (! topic) return next(new Error('Failed to load Topic ' + id));
		req.topic = topic ;
		next();
	});
};

/**
 * Topic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.topic.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
