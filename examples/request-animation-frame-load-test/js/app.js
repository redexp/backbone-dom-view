jQuery(function($) {

    var Item = Backbone.Model.extend({
        defaults: {
            title: 'Todo Title',
            done: false
        }
    });

    var List = Backbone.Collection.extend({
        model: Item
    });

    var View = Backbone.DOMView;

    var ItemView = View.extend({
        template: {
            "label": {
                text: "@title"
            },
            ".toggle": {
                prop: {
                    'checked': "@done"
                }
            }
        }
    });

    var ListView = View.extend({
        template: {
            "": {
                each: {
                    view: ItemView,
                    el: '> *'
                }
            }
        }
    });

    var list = new List();
    var view = new ListView({
        model: list,
        el: '#todo-list'
    });

    function addItems() {
        for (var i = 0; i < 1000; i++) {
            list.add({title: 'Title #' + i, done: i % 2 === 0});
        }
    }

    var info = $('#info');

    $('#regular').click(function () {
        var startTime = new Date().getTime();

        for (var i = 0; i < 15000; i+=1000) {
            addItems();
        }

        var endTime = new Date().getTime();

        info.text((endTime - startTime).toLocaleString());
    });

    $('#with-request').click(function () {
        var startTime = new Date().getTime();

        var p = $.Deferred().resolve().promise();

        for (var i = 0; i < 15000; i+=1000) {
            p = p.then(function () {
                var df = $.Deferred();

                View.requestAnimationFrame(function () {
                    addItems();
                    df.resolve();
                });

                return df.promise();
            });
        }

        p.then(function () {
            var endTime = new Date().getTime();

            info.text((endTime - startTime).toLocaleString());
        });
    });

});
