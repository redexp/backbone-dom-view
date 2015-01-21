;(function (app) {
	'use strict';

	app.TodoView = Backbone.DOMView.extend({
		ui: {
			title: '.edit',
			completed: '.toggle'
		},

		changeTitle: function () {
			var title = this.ui.title.val().trim();

			if (!title) {
				this.trigger('not-valid', true);
				return;
			}

			app.actions.todo.save(this.model, {
				title: title
			});
		},

		changeCompleted: function () {
			app.actions.todo.save(this.model, {
				completed: this.ui.completed.prop('checked')
			});
		},

		removeModel: function () {
			app.actions.todo.remove(this.model);
		},

		startEdit: function () {
			this.trigger('edit', true);
		},

		stopEdit: function () {
			this.trigger('edit', false);
		},

		template: {
			"": {
				"class": {
					"completed": "@completed",
					"editing": "#edit",
					"not-valid": "#not-valid"
				}
			},

			"completed": {
				prop: {
					'checked': '@completed'
				},
				on: {
					'change': function () {
						this.changeCompleted();
					}
				}
			},

			"label": {
				text: '@title',
				on: {
					"dblclick": function () {
					    this.startEdit();
					}
				}
			},

			"title": {
				prop: {
					'value': {
						'#edit': function (edit) {
							if (edit) {
								this.ui.title.focus();
							}

						    return this.model.get('title')
						}
					}
				},
				on: {
					'keydown': function (e) {
					    switch (e.which) {
							case ENTER_KEY:
								e.preventDefault();
								this.changeTitle();
								this.stopEdit();
								break;

							case ESC_KEY:
								this.stopEdit();
								break;
						}
					},
					'blur': function () {
					    this.stopEdit();
					}
				}
			},

			".destroy": {
				on: {
					'click': function () {
					    this.removeModel();
					}
				}
			}
		}
	});
})(window.app);
