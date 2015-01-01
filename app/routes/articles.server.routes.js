'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(articles.list)
		// Create new version of the article
		// Edit of an article is not possible because new version is created for every change.
		.post(users.requiresLogin, articles.create);	

	//Get article
	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update);

	app.route('/articles/history/:articleId')
		.get(articles.history);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};