// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
jQuery(function($){

    window.Todo = Backbone.Model.extend({

        // Default attributes for the todo item.
        defaults: function() {
            return {
                title: "empty todo...",
                order: TodoList.nextOrder(),
                done: false
            };
        },

        // Toggle the `done` state of this todo item.
        toggle: function() {
            this.save({done: !this.get("done")});
        }

    });

    // The collection of todos is backed by *localStorage* instead of a remote server
    window.TodoList = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Todo,

        // Save all of the todo items under the `"todos-backbone"` namespace.
        localStorage: new Backbone.LocalStorage("todos-backbone"),

        // Filter down the list of all todo items that are finished.
        done: function() {
            return this.where({done: true});
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            return this.where({done: false});
        },

        saveAll: function(fields){
            this.invoke('save', fields);
        },

        removeCompleted: function(){
            _.invoke(this.done(), 'destroy');
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'
    },{
        currentOrder: 0,
        nextOrder: function() {
            return ++this.currentOrder;
        }
    });

});
