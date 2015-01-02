'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var topics = require('../../app/controllers/topics.server.controller');

	// Topics Routes
	app.route('/topics')
		.get(topics.list)
		.post(users.requiresLogin, users.hasAuthorization(['administrator']), topics.create);

	app.route('/topics/:topicId')
		.get(topics.read)
		.put(users.requiresLogin, users.hasAuthorization(['administrator']), topics.update)
		.delete(users.requiresLogin, users.hasAuthorization(['administrator']), topics.delete);

	app.route('/topics/reserve/:topicId')
		.put(users.requiresLogin, topics.reserve);

	// Finish by binding the Topic middleware
	app.param('topicId', topics.topicByID);
};
