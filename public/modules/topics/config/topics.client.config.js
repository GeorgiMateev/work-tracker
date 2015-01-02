'use strict';

// Configuring the Articles module
angular.module('topics').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Create topic', 'topics/create', 'default', null, null, ['administrator']);
	}
]);