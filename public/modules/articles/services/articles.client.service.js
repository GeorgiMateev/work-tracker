'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            history: {
                method: 'GET',
                url: 'articles/history/:articleId',
                isArray:true
            }
		});
	}
])
.factory('Grades', ['$resource',
    function($resource) {
        return $resource('review/:articleId');
    }
]);