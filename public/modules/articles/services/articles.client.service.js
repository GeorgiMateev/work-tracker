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
            },
            revision: {
                method: 'GET',
                url: 'articles/revision/:revisionId'
            },
            restore: {
                method: 'PUT',
                url: 'articles/revision/:revisionId',
                params: {
                    revisionId: '@_id'
                }
            }
		});
	}
])
.factory('Grades', ['$resource',
    function($resource) {
        return $resource('review/:articleId');
    }
]);