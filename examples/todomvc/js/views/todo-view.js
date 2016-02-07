;(function(app){
    'use strict';

    app.TodoView = Backbone.DOMView.extend({
        ui: {
            title: '.edit',
            completed: '.toggle'
        },

        defaults: {
            edit: false,
            is_valid: true
        },

        isValid: function () {
            return !!this.ui.title.val().trim();
        },

        changeTitle: function(){
            var title = this.ui.title.val().trim();

            app.actions.todo.save(this.model, {
                title: title
            });
        },

        changeCompleted: function(){
            app.actions.todo.save(this.model, {
                completed: this.ui.completed.prop('checked')
            });
        },

        removeModel: function(){
            app.actions.todo.remove(this.model);
        },

        startEdit: function(){
            this.set('edit', true);
        },

        stopEdit: function(){
            this.set('edit', false);
        },

        template: {
            "root": {
                "class": {
                    "completed": "@completed",
                    "editing": "@edit",
                    "not-valid": "!@is_valid",
                    "hidden": '@filtered'
                }
            },

            "completed": {
                prop: {
                    'checked': '@completed'
                },
                on: {
                    'change': 'changeCompleted'
                }
            },

            "label": {
                text: '@title',
                on: {
                    "dblclick": 'startEdit'
                }
            },

            "title": {
                prop: {
                    'value': {
                        '@edit': function(edit){
                            if (edit) {
                                this.ui.title.focus();
                            }

                            return this.model.get('title');
                        }
                    }
                },
                on: {
                    'keydown': function(e){
                        switch (e.which) {
                        case app.ENTER_KEY:
                            e.preventDefault();

                            if (!this.isValid()) return;

                            this.changeTitle();
                            this.startEdit();
                            break;

                        case app.ESC_KEY:
                            this.stopEdit();
                            break;
                        }
                    },
                    'blur': 'stopEdit'
                }
            },

            ".destroy": {
                on: {
                    'click': 'removeModel'
                }
            }
        }
    });
})(window.app);
