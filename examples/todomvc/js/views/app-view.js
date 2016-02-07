;(function(app){
    'use strict';

    app.AppView = Backbone.DOMView.extend({
        el: '#todoapp',

        ui: {
            'toggleAll': '#toggle-all',
            'newTitle': '#new-todo'
        },

        defaults: {
            completed: 0,
            remaining: 0,
            filter: ''
        },

        initialize: function(){
            this.bind('#template-ready add remove reset change:completed', function(){
                this.set({
                    completed: this.model.completed().length,
                    remaining: this.model.remaining().length
                });
            });
        },

        createNewTodo: function(){
            app.actions.todo.create({
                title: this.ui.newTitle.val().trim()
            });
        },

        removeCompleted: function(){
            app.actions.todo.remove(this.model.completed());
        },

        changeAllCompleted: function(){
            app.actions.todo.saveAll({
                completed: this.ui.toggleAll.prop('checked')
            });
        },

        template: {
            "root": {
                'class': {
                    'all-filter': {
                        '@filter': function(filter){
                            return !filter;
                        }
                    },
                    'active-filter': {
                        '@filter': function(filter){
                            return filter === 'active';
                        }
                    },
                    'completed-filter': {
                        '@filter': function(filter){
                            return filter === 'completed';
                        }
                    }
                }
            },

            "newTitle": {
                on: {
                    'keydown': function(e){
                        switch (e.which) {
                        case app.ENTER_KEY:
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
                    "checked": '!@remaining'
                },

                on: {
                    'change': 'changeAllCompleted'
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
                        "#template-ready add remove reset": function(){
                            return this.model.length === 0;
                        }
                    }
                }
            },
            "#todo-count strong": {
                text: '@remaining'
            },
            "#todo-count span": {
                text: {
                    "@remaining": function(count){
                        return (count === 1 ? 'item' : 'items') + ' left';
                    }
                }
            },
            "#clear-completed": {
                'class': {
                    "hidden": '!@completed'
                },
                on: {
                    'click': function(e){
                        e.preventDefault();
                        this.removeCompleted();
                    }
                }
            },
            "#clear-completed span": {
                text: '@completed'
            },
            "#filters [href='#/']": {
                'class': {
                    "selected": {
                        "@filter": function(filter){
                            return !filter;
                        }
                    }
                }
            },
            "#filters [href='#/active']": {
                'class': {
                    "selected": {
                        "@filter": function(filter){
                            return filter === 'active';
                        }
                    }
                }
            },
            "#filters [href='#/completed']": {
                'class': {
                    "selected": {
                        "@filter": function(filter){
                            return filter === 'completed';
                        }
                    }
                }
            }
        }
    });
})(window.app);
