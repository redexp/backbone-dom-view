;(function (app) {
	'use strict';

	app.Todos = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Todo,

		localStorage: new Backbone.LocalStorage('todo-backbone'),

		initialize: function (data, ops) {
		    var dispatcher = ops.dispatcher;

			this.listenTo(dispatcher, 'remove-todo', function (todo) {
				this.remove(todo);
			});

			this.listenTo(dispatcher, 'save-todo', function (todo, data) {
				if (todo = this.get(todo)) {
					todo.save(data);
				}
			});

			this.listenTo(dispatcher, 'save-all-todo', function (data) {
				this.invoke('save', data);
			});

			this.listenTo(dispatcher, 'create-todo', function (data) {
				this.create(data);
			});
		},

		completed: function () {
			return this.where({completed: true});
		},

		remaining: function () {
			return this.where({completed: false});
		}
	});

})(window.app);
