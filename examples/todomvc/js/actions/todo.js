;(function(app) {

    app.actions.todo = {
        create: function (data) {
            app.dispatcher.trigger('create-todo', data);
        },

        save: function (model, data) {
            app.dispatcher.trigger('save-todo', model, data);
        },

        saveAll: function (data) {
            app.dispatcher.trigger('save-all-todo', data);
        },

        remove: function (model) {
            app.dispatcher.trigger('remove-todo', model);
        }
    };

}(window.app));
