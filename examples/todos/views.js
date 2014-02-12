jQuery(function($){

    var itemNode = $('#todo-list > li').detach();
    window.TodoView = Backbone.DOMView.extend({
        initialize: function(){
            this.$el = itemNode.clone();
            this.model.on('change:title change:done', function(){
                this.save();
            });
        },
        startEdit: function(){
            this.trigger('edit', true);
            this.$el.find('.edit').focus();
        },
        endEdit: function(){
            this.trigger('edit', false);
        },
        template: {
            "": {
                "class": {
                    "done": "@done",
                    "editing": "#edit"
                }
            },
            ":checkbox": {
                connect: {
                    "checked": "done"
                }
            },
            ".edit": {
                connect: {
                    "value|keyup": "title"
                },
                on: {
                    "keydown": function(e){
                        if (e.keyCode !== 13) return;

                        this.endEdit();
                    },
                    "blur": function(){
                        this.endEdit();
                    }
                }
            },
            ".view": {
                on: {"dblclick": function(){
                    this.startEdit();
                }}
            },
            "label": {
                html: "@title"
            },
            ".destroy": {
                on: {"click": function(){
                    this.model.destroy();
                    return false;
                }}
            }
        }
    });

    window.TodoListView = Backbone.DOMView.extend({
        el: $('#todoapp'),
        initialize: function(){
            this.listenTo(this.model, 'add remove', throttle(this.lengthChanged));
            this.on('template-ready', this.lengthChanged);

            this.listenTo(this.model, 'change:done', throttle(this.doneChanged));
            this.on('length-changed', this.doneChanged);
        },
        lengthChanged: function(){
            this.trigger('length-changed');
        },
        doneChanged: function(){
            this.trigger('done-changed', this.model.done().length);
        },

        template: {
            "": {
                "class": {
                    "has-todo": {
                        "#length-changed": function(){
                            return this.model.length > 0;
                        }
                    }
                }
            },

            "#todo-list": {
                each: {
                    view: TodoView
                }
            },

            "#new-todo": {
                on: {
                    "keydown": function(e){
                        var title = e.target.value;
                        if (e.keyCode !== 13 || ! title) return;

                        this.model.create({title: title});
                        e.target.value = '';
                    }
                }
            },

            "#todo-count": {
                html: {
                    "#done-changed": function(length){
                        length = this.model.length - length;
                        return prepare('$1 item$2 left', length, length > 1 ? 's':'');
                    }
                }
            },

            "#clear-completed": {
                html: {
                    "#done-changed": function(length){
                        return prepare('Clear $1 completed item$2', length, length > 1 ? 's':'');
                    }
                },
                style: {
                    "display": {
                        "#done-changed": function(length){
                            return length > 0 ? 'block':'none';
                        }
                    }
                },
                on: {
                    "click": function(){
                        this.model.removeCompleted();
                        return false;
                    }
                }
            },

            "#toggle-all": {
                on: {
                    "change": function(e){
                        this.model.saveAll({done: e.target.checked});
                    }
                }
            }
        }
    });

    function throttle(fnc, wait){
        wait || (wait = 50);

        return _.throttle(fnc, wait, {leading: false});
    }

    function prepare(str){
        var args = arguments;
        return str.replace(/\$(\d+)/g, function(x, i){
            return args[i];
        });
    }

});
