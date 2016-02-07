;(function (app) {
	'use strict';

	app.Todos = Backbone.Collection.extend({
		model: app.Todo,

		localStorage: new Backbone.LocalStorage('todo-backbone'),

		completed: function () {
			return this.where({completed: true});
		},

		remaining: function () {
			return this.where({completed: false});
		}
	});

})(window.app);
