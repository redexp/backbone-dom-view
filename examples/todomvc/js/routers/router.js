;(function(app){
    'use strict';

    app.TodoRouter = Backbone.Router.extend({
        routes: {
            '*filter': 'setFilter'
        },

        setFilter: function(param){
            // Set the current filter to be used
            app.TodoFilter = param || '';

            app.actions.todo.filter(param);
        }
    });

})(window.app);
