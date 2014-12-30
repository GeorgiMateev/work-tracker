'use strict';

// Configuring the Articles module
angular.module('topics').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Topics', 'topics', 'dropdown', '/topics(/create)?');
		Menus.addSubMenuItem('topbar', 'topics', 'List Topics', 'topics');
		Menus.addSubMenuItem('topbar', 'topics', 'New Topic', 'topics/create');
	}
]);