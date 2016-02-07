;(function(app){
    'use strict';

    app.TodoRouter = Backbone.Router.extend({
        routes: {
            '*filter': 'setFilter'
        },

        setFilter: function(param){
            app.actions.todo.filter(param);
        }
    });

})(window.app);
