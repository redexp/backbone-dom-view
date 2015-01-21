var ENTER_KEY = 13;
var ESC_KEY = 27;

window.app = {
	dispatcher: new Backbone.Events(),
	actions: {}
};

jQuery(function () {
	'use strict';

	var app = window.app;

	var todos = new app.Todos([], {
		dispatcher: app.dispatcher
	});

	new app.AppView({
		model: todos
	});

	todos.fetch({reset: true});
});
