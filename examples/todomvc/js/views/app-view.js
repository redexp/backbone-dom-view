;(function (app) {
	'use strict';

	app.AppView = Backbone.DOMView.extend({
		el: '#todoapp',

		ui: {
			'toggleAll': '#toggle-all',
			'newTitle': '#new-todo'
		},

		initialize: function () {
			this.completed = 0;
			this.remaining = 0;

			this.bind('#template-ready add remove reset change:completed', function () {
				this.cacheStats();
				this.trigger('list-changed');
			});
		},

		cacheStats: function () {
			this.completed = this.model.completed().length;
			this.remaining = this.model.remaining().length;
		},

		createNewTodo: function () {
			app.actions.todo.create({
				title: this.ui.newTitle.val().trim()
			});
		},

		removeCompleted: function () {
			app.actions.todo.remove(this.model.completed());
		},

		changeAllCompleted: function () {
			app.actions.todo.saveAll({
				completed: this.ui.toggleAll.prop('checked')
			});
		},

		template: {
			"": {
				'class': {
					'all-filter': {
						'filter': function (path) {
						    return !path;
						}
					},
					'active-filter': {
						'filter': function (path) {
						    return path === 'active';
						}
					},
					'completed-filter': {
						'filter': function (path) {
						    return path === 'completed';
						}
					}
				}
			},

			"newTitle": {
				on: {
					'keydown': function (e) {
					    switch (e.which) {
							case ENTER_KEY:
								e.preventDefault();

								var title = this.ui.newTitle.val().trim();

								if (!title) return;

								this.createNewTodo();

								this.ui.newTitle.val('');
								break;
						}
					}
				}
			},

			"toggleAll": {
				prop: {
					"checked": {
						"#list-changed": function () {
							return !this.remaining;
						}
					}
				},

				on: {
					'change': function () {
					    this.changeAllCompleted();
					}
				}
			},

			"#todo-list": {
				each: {
					view: app.TodoView,
					el: '> *'
				}
			},
			"#main, #footer": {
				'class': {
					'hidden': {
						"#template-ready add remove reset": function () {
						    return this.model.length === 0;
						}
					}
				}
			},
			"#todo-count strong": {
				text: {
					// event #list-changed triggered in initialize function
					"#list-changed": function () {
					    return this.remaining;
					}
				}
			},
			"#todo-count span": {
				text: {
					"#list-changed": function () {
					    return (this.remaining === 1 ? 'item' : 'items') + ' left';
					}
				}
			},
			"#clear-completed": {
				'class': {
					"hidden": {
						"#list-changed": function () {
							return this.completed === 0;
						}
					}
				},
				on: {
					'click': function (e) {
						e.preventDefault();
					    this.removeCompleted();
					}
				}
			},
			"#clear-completed span": {
				text: {
					"#list-changed": function () {
						return this.completed;
					}
				}
			},
			"#filters [href='#/']": {
				'class': {
					"selected": {
						"filter": function (path) {
							return !path;
						}
					}
				}
			},
			"#filters [href='#/active']": {
				'class': {
					"selected": {
						"filter": function (path) {
							return path === 'active';
						}
					}
				}
			},
			"#filters [href='#/completed']": {
				'class': {
					"selected": {
						"filter": function (path) {
							return path === 'completed';
						}
					}
				}
			}
		}
	});
})(window.app);
