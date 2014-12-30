'use strict';

// Topics controller
angular.module('topics').controller('TopicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topics',
	function($scope, $stateParams, $location, Authentication, Topics) {
		$scope.authentication = Authentication;

		// Create new Topic
		$scope.create = function() {
			// Create new Topic object
			var topic = new Topics ({
				name: this.name
			});

			// Redirect after save
			topic.$save(function(response) {
				$location.path('topics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Topic
		$scope.remove = function(topic) {
			if ( topic ) { 
				topic.$remove();

				for (var i in $scope.topics) {
					if ($scope.topics [i] === topic) {
						$scope.topics.splice(i, 1);
					}
				}
			} else {
				$scope.topic.$remove(function() {
					$location.path('topics');
				});
			}
		};

		// Update existing Topic
		$scope.update = function() {
			var topic = $scope.topic;

			topic.$update(function() {
				$location.path('topics/' + topic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Topics
		$scope.find = function() {
			$scope.topics = Topics.query();
		};

		// Find existing Topic
		$scope.findOne = function() {
			$scope.topic = Topics.get({ 
				topicId: $stateParams.topicId
			});
		};
	}
]);