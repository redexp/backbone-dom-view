;(function(app){
    'use strict';

    var todos = app.todos = new app.Todos([], {
        dispatcher: app.dispatcher
    });

    todos.view = new app.AppView({
        el: '#todoapp',
        model: todos
    });

    todos.fetch({reset: true});

    app.dispatcher.on('remove-todo', function (todo) {
        if (!_.isArray(todo)) {
            todo = [todo];
        }

        _.invoke(todo, 'destroy');
    });

    app.dispatcher.on('save-todo', function (todo, data) {
        if (todo = todos.get(todo)) {
            todo.save(data);
        }
    });

    app.dispatcher.on('save-all-todo', function (data) {
        todos.invoke('save', data);
    });

    app.dispatcher.on('create-todo', function (data) {
        todos.create(data);
    });

    app.dispatcher.on('filter-todos', function (filter) {
        todos.view.set('filter', filter);

        var filteredModels = [];

        switch (filter) {
        case 'active':
            filteredModels = todos.completed();
            break;
        case 'completed':
            filteredModels = todos.remaining();
            break;
        }

        _.invoke(filteredModels, 'set', 'filtered', true);
        _.invoke(todos.difference(filteredModels), 'set', 'filtered', false);
    });

    app.router = new app.TodoRouter();

    Backbone.history.start();

})(window.app);
