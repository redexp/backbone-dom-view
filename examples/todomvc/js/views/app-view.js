/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.DOMView.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');

			this.listenTo(this.model, 'change:completed', this.filterOne);
			this.listenTo(this.model, 'filter', this.filterAll);

			this.bind('#template-ready add remove change:completed', function () {
				this.cacheCompleted();
				this.trigger('change:list');
			});
			
			this.cacheCompleted();

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			this.model.fetch({reset: true});
		},

		cacheCompleted: function () {
			this.completed = this.model.completed().length;
			this.remaining = this.model.remaining().length;
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			this.model.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: this.model.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				this.model.create(this.newAttributes());
				this.$input.val('');
			}
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(this.model.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			this.model.each(function (todo) {
				todo.save({
					completed: completed
				});
			});
		},

		template: {
			"#todo-list": {
				each: {
					view: app.TodoView,
					el: '> *'
				}
			},
			"#main, #footer": {
				'class': {
					'hidden': {
						"#template-ready add remove": function () {
						    return this.model.length === 0;
						}
					}
				}
			},
			"#todo-count strong": {
				text: {
					// event #change:list triggered in initialize function
					"#change:list": function () {
					    return this.remaining;
					}
				}
			},
			"#todo-count span": {
				text: {
					"#change:list": function () {
					    return (this.remaining === 1 ? 'item' : 'items') + ' left';
					}
				}
			},
			"#clear-completed": {
				'class': {
					"hidden": {
						"#change:list": function () {
							return this.completed === 0;
						}
					}
				}
			},
			"#clear-completed span": {
				text: {
					"#change:list": function () {
						return this.completed;
					}
				}
			},
			"#toggle-all": {
				prop: {
					"checked": {
						"#change:list": function () {
							return !this.remaining;
						}
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
})(jQuery);
