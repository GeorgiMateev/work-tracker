'use strict';

//Setting up route
angular.module('topics').config(['$stateProvider',
	function($stateProvider) {
		// Topics state routing
		$stateProvider.
		state('listTopics', {
			url: '/topics',
			templateUrl: 'modules/topics/views/list-topics.client.view.html'
		}).
		state('createTopic', {
			url: '/topics/create',
			templateUrl: 'modules/topics/views/create-topic.client.view.html'
		}).
		state('viewTopic', {
			url: '/topics/:topicId',
			templateUrl: 'modules/topics/views/view-topic.client.view.html'
		}).
		state('editTopic', {
			url: '/topics/:topicId/edit',
			templateUrl: 'modules/topics/views/edit-topic.client.view.html'
		});
	}
]);