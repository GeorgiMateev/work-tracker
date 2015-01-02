'use strict';

// Topics controller
angular.module('topics').controller('TopicsController',
 ['$scope', '$stateParams', '$location', 'Authentication', 'Topics', '$modal',
    function($scope, $stateParams, $location, Authentication, Topics, $modal) {
        $scope.authentication = Authentication;

        // Create new Topic
        $scope.create = function() {
            // Create new Topic object
            var topic = new Topics ({
                name: this.name,
                description: this.description
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
            $scope.topics = Topics.query(function (topics) {
                return topics.map(function (topic) {
                    var reserved = Authentication.user.reserved.filter(function (reserved) {
                        return reserved.topic === topic._id;
                    });

                    topic.reserved = reserved.length > 0;
                    topic.submitted = reserved[0] && reserved[0].submitted;
                    return topic;
                });
            });
        };

        // Find existing Topic
        $scope.findOne = function() {
            $scope.topic = Topics.get({ 
                topicId: $stateParams.topicId
            });
        };

        // Ask the user and reserve topic
        $scope.promptReserveTopic = function(topic) {
            $modal.open({
                templateUrl: 'prompt-reserve.html',
                scope:$scope
            })
            .result
            .then(function (accepted) {
                if (accepted) {
                    topic.$reserve().then(function () {
                        $scope.addAlert(topic.name + ' was reserved.', 'success');
                        topic.reserved = true;
                    });
                }
            });
        };

        $scope.alerts = [];

        $scope.addAlert = function(message, type) {
          $scope.alerts.push({message: message, type: type});
        };

        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };
    }
]);