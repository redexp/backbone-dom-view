backbone-dom-view
=================

Better View class for Backbone

Main idea of this view class is in configuration template object which looks like this
```javascript
var View = Backbone.DOMView.extend({
    template: {
        "jquery-selector": {
            "helper-name": {
                "first-option": "value",
                "second-option": {
                    "model-event #view-event": function () {
                        //..
                    }
                }
            }
        }
    }
});
```
`DOMView` class is extended from base `Backbone.View` class.

For example view for Todo model
```javascript
var TodoView = Backbone.DOMView.extend({
    template: {
        ".title": {
            text: "@title"
        },
        ".state": {
            'class': {
                "done": "@is_done",

                "selected": {
                    "change:selected": function () {
                        return this.model.get('selected');
                    }
                }
            }
        }
    }
});
```
Which means:
* Change `.title` text to model's `title` field value and listen `change:title` for future changes
* Add to `.state` class `done` when model's `is_done` field will be equal truthy value
* Add to `.state` class `selected` when model will trigger `change:selected` event and callback will return truthy value

## Installation

Bower:
`bower install backbone-dom-view`

**RequireJS ready** module name is `backbone-dom-view`

## Fields

### ui:

Used to create alias of jQuery selectors. Instead of calling dozen times `this.$('.title')` you can use `this.ui.title`, so if you need to change selector, you will change it only in one place. As value of `ui:` you can use `Object` or `Function` (which should return an object). Also you can use this alias in `template:` instead of selectors. When you extend views, `ui:` field will be merged with all parents prototypes.

You can use names of aliases in other aliases selector.
```javascript
Backbone.DOMView.extend({
    ui: {
        title: 'input.title',
        edit: '{title} ~ .edit'
    },
    
    template: {
        'title': {
            'class': {
                'error': {
                    'validate': function () {
                        return this.ui.title.val() === '';
                    }
                }
            }
        }
    }
});
```

### template:

Hash where keys are jQuery selectors and values are hashes of [helpers](#helpers). When you extend views, `template:` field will be merged with all parents prototypes. As value of `template:` you can use `Object` or `Function` (which should return an object).

## Methods

### find()

Same as view's `.$(selector)` but it can accept empty value to return `.$el` it self or `ui:` property name or selector with `ui:` property name in curly brackets. This method was created for `template:` selectors.
```javascript
Backbone.DOMView.extend({
    el: '<div><span>Name</span> <button>Edit</button></div>',
    ui: {
        name: 'span'
    },
    template: {
        "": { /* <div> */ },
        "name": { /* <span> */ },
        "{name} ~ button": { /* <button> */ }
    },
    initialize: function () {
        this.find() // <div>
        this.find('name') // <span>
        this.find('{name} ~ button') // <button>
    }
});
```

### bind()

Same as `.on()` method but with it you can bind callback to model and to view in same time. 
```javascript
Backbone.DOMView.extend({
    initialize: function () {
        this.bind('change:title #changed', function () {});
        // same as
        this.listenTo(this.model, 'change:title', function () {});
        this.on('changed', function () {});
    } 
});
```
So all events with `#` before them are view events, the rest are model events. But there one more feature `@model_field_name` notation which will be converted to `change:model_field_name` event and it callback will be called immediately with `model_field_name` value as first argument. All default helpers uses this method to bind to events.
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'class': {
                'active': {
                    'change:active': function (value) {
                        return value;
                    }
                },
                'selected': {
                    '@selected': function (value) {
                        return value;
                    }
                }
            }
        }
    } 
});
```
Class `active` will not be added when view will be created even if model field `active` is `true`, beacuse it will wait for `change:active` event. Instead of it class `selected` will be synced with model field `selected` on view creation because it uses `@selected` notation.

## Internal Events

View has several internal events

### template-ready

By default `template` will be executed only after `initialize` callback, so if you want to do some stuff after it you can use `template-ready` event or `Backbone.DOMView.readyEvent`
```javascript
Backbone.DOMView.extend({
    initialize: function () {
        this.on('template-ready', function () { /*...*/ });
        this.on(Backbone.DOMView.readyEvent, function () { /*...*/ });
    }
});
```

### element-ready

If you want to do some stuff before `initialize` but after `this.$el` prepared or you need to react when `this.$el` will be changed with `this.setElement()` method, then you can use `element-ready` event or `Backbone.DOMView.elementEvent`

## Helpers

* [class](#class)
* [attr](#attr)
* [prop](#prop)
* [style](#style)
* [html](#html)
* [text](#text)
* [on](#on)
* [connect](#connect)
* [each](#each)

You can define your own helpers, just add them to `Backbone.DOMView.helpers` object.
Arguments passed to helpers are `selector` and `options`.

### class

**jQuery alias:** `.toggleClass()`

It will add css class to element if first argument of event will be truthy and remove if not.

It is a hash where keys are space separated css class names and values are: event name or hash of events and callbacks or function. If value is event name, then helper will create callback for you where it will take first argument.
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'class': {
                'active': 'change:active',
                // same as 
                'active': {
                    'change:active': function (value) {
                        return value
                    }
                },
                // or you can change number of argument like this
                'selected': '@selected|arg(3)',
                // same as
                'selected': {
                    '@selected': functio (value1, value2, value3) {
                        return value3;
                    }
                }
            }
        }
    } 
});
```
If value is function it means css class should be initialized once only on view creation.
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'class': {
                'product': function () {
                    return this.model.isProduct();
                }
            }
        }
    } 
});
```

### attr

**jQuery alias:** `.attr()`

Used to change attributes values.

It is a hash where keys are attributes names and values same as in [class](#class) helper only values from callbacks will be used as values for attributes.
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'attr': {
                'data-message': '@message',
                'data-error': {
                    'validate': function () {
                        return this.model.validationError;
                    }
                },
                'rel': function () {
                    return this.model.get('id');
                }
            }
        }
    } 
});
```

### prop

**jQuery alias:** `.prop()`

Used to change properties values.

It is a hash where keys are properties names and values from callbacks will be used as values for properties.
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'prop': {
                'id': '@id',
                'value': {
                    'change:value': function () {
                        return this.model.get('value');
                    }
                },
                'disabled': function () {
                    return !this.model.get('active');
                }
            }
        }
    } 
});
```

### style

**jQuery alias:** `.css()`

Used to change css properties of element.

It is a hash where keys are css properties names and values from callbacks will be used as values for this properties.
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'style': {
                'z-index': '@index',
                'background-color': {
                    'validate': function () {
                        return this.model.isValid ? 'green' : 'red';
                    }
                },
                'width': function () {
                    return this.model.get('width') + 'px';
                }
            }
        }
    } 
});
```

### html

**jQuery alias:** `.html()`

Used to change `innerHTML` of element.
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'html': '@title'
        },
        '.text': {
            'html': {
                'change:text': function () {
                    return '<b>' + this.model.get('text') + '</b>';
                }
            }
        },
        '.type': {
            'html': function () {
                return this.model.get('type');
            }
        }
    } 
});
```

### text

**jQuery alias:** `.text()`

Works just like `html` helper only difference that it uses `text()` method of jQuery, which will convert all html special chars to html entities.

### on

**jQuery alias:** `.on()`

Used to bind callbacks to dom events.

It is a hash where keys are space separated dom events and values are callbacks or hash of selectors and callbacks. Callback will get same arguments as jQuery `.on()` callback. `this` in callbacks will be current view.
```javascript
Backbone.DOMView.extend({
    template: {
        '.remove': {
            'on': {
                'click': function (e) {
                    e.preventDefault();
                    return this.model.remove();
                },
                
                'change': {
                    'input.name': function (e) {
                        this.model.set('name', e.currentTarget.value);
                    }
                }
            }
        }
    } 
});
```

### connect

This helper gives you two way binding with element property and model field. By default helper will listen for `chnage` event in element and `change:model_field` in model
```javascript
Backbone.DOMView.extend({
    template: {
        'input.title': {
            connect: {
                'value': 'title'
            }
        }
    }
});
```
So when element will trigger `change` event, helper will take `value` property and set it to model's `title` field and when model trigger `change:title`, helper will change `value` with new `title`.
If you want to listen different event in element then you can use `property|event` notation
```javascript
connect: {
    'value|keyup': 'title'
}
```

### each

Helper to render collections.
```javascript
var ItemView = Backbone.DOMView.extend({
    tagName: 'li',
    template: {
        '': {
            text: '@title'
        }
    }
});

var ListView = Backbone.DOMView.extend({
    tagName: 'ul',
    template: {
        '': {
            each: {
                view: ItemView
            }
        }
    }
});

var list = new Backbone.Collection([
    {title: 'one'},
    {title: 'two'},
    {title: 'three'}
]);

var view = new LsitView({
    model: list,
    el: '#items'
});

view.$el //= <ul><li>one</li><li>two</li><li>three</li></ul>

list.remove(list.at(1));

view.$el //= <ul><li>one</li><li>three</li></ul>

list.add({title: 'four'});

view.$el //= <ul><li>one</li><li>three</li><li>four</li></ul>

list.at(0).set('title', 'zero');

view.$el //= <ul><li>zero</li><li>three</li><li>four</li></ul>
```

#### Options

**view:** `{View|Function}`

If `view:` value is `Backbone.View` class (or extended form it) then helper will create instances from this class for each model added to collection. If `view:` value is `Function` then helper will call it for each model and expect view instance from it (helpful if you need different views in same collection).

**el:** `{String}` Default: `null`

Selector for `el:` option fo `view:` class. You can use it when template for `ItemView` is in `ul.items`
```html
<ul class="items">
    <li><span class="title"></span></li>
</ul>
```
```javascript
var ListView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                view: ItemView,
                el: '> li' // means 'ul.items > li'
            }
        }
    }
});

//...

view.$el //= <ul class="items"><li><span class="title">one</span></li><li><span class="title">two</span></li><li><span class="title">three</span></li></ul>
```
When you will create instance of `ListView` it will detach `ul.items > li` and use it clones as `el:` option for `ItemView`

**addEvent:** `{String}` Default: `'add'`

By default helper will listen for `add` event to add new view, but you can change it with this option

**removeEvent:** `{String}` Default: ``remove``

Same as previous only for `remove` event.

**addHandler:** `{String|Function}` Default: `'append'`

By default helper will use `.append()` jQuery method to add views to `ul.items`, you can chenge it with three predefined jQuery methods and pass it as a string for this option: `prepend`, `fadeIn`, `slideDown`. Or you can use function and add view in custom way.
```javascript
var ListView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                view: ItemView,
                addHandler: function (ul, view) {
                    view.$el.hide().appendTo(ul).animate({backgrounColor: 'red'});
                }
            }
        }
    }
});
```

**delHandler:** `{String|Function}` Default: `'remove'`

Same as `addHandler` only for removing views. Default method is `remove`. Predefined methods: `fadeOut`, `slideUp`.

**sort:** `{Boolean|Object}` Default: `false`

Elements in `ul.items` can be sorted and sync with models in collection. If `sort:` is `true` then helper will listen for `sort` event and will change order of views in `ul.items` or you can set custom event name with object.
```javascript
var ListView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                view: ItemView,
                sort: {
                    event: 'change-order'
                }
            }
        }
    }
});
```
Also you can change views order by some models field value not by their index in collection.
```javascript
var ListView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                view: ItemView,
                sort: {
                    event: 'change:order',
                    field: 'order'
                }
            }
        }
    }
});

var list = new Backbone.Collection([
    {title: 'one', order: 1},
    {title: 'two', order: 2},
    {title: 'three', order: 3}
]);

//...

view.$el //= <ul class="items"><li>one</li><li>two</li><li>three</li></ul>

list.at(0).set('order', 4);

view.$el //= <ul class="items"><li>two</li><li>three</li><li>one</li></ul>
```

**offOnRemove:** `{Boolean}` Default: `true`

By default all views created by this helper on remove will stop listen all events (`.off()` and `.stopListening()`). You can disable it by set this option to `false`.

**field:** `{String|Object}` Default: `null`

Helper can work not only with `this.model` but also with collection in model field. Name of this filed you can set with this option
```javascript
var UserView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                field: 'items',
                view: ItemView
            }
        }
    }
});

var user = new Backbone.Model({
    name: 'Max',
    items: new Backbone.Collection([
        {title: 'one'},
        {title: 'two'},
        {title: 'three'}
    ])
});

var view = new UserView({
    model: user
});

view.$el.find('.items') //= <ul class="items"><li>one</li><li>two</li><li>three</li></ul>
```
Or you can iterate over plain array, but you will need to set wrapper constructor (usually `Backbone.Collection`).
```javascript
var user = new Backbone.Model({
    name: 'Max',
    items: [
        {title: 'one'},
        {title: 'two'},
        {title: 'three'}
    ]
});

var UserView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                field: {
                    name: 'items',
                    wrapper: Backbone.Collection
                },
                view: ItemView
            }
        }
    }
});
```

Backbone Collection can work only with array of objects, so your wrapper can prepare array of values to array of objects
```javascript
var user = new Backbone.Model({
    name: 'Max',
    items: [
        'one',
        'two',
        'three'
    ]
});

var Items = Backbone.Collection.extend({
    constructor: function (items) {
        items = items.map(function (item) {
            return {title: item};
        });

        Backbone.Collection.call(this, items);
    }
});

var UserView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                field: {
                    name: 'items',
                    wrapper: Items
                },
                view: ItemView
            }
        }
    }
});
```