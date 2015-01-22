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

Used to create alias of jQuery selectors. Instead of calling dozen times `this.$('.title')` you can use `this.ui.title`, so if you need to change selector, you will change it only in one plase. Also you can use this alias in `template:` instead of selectors. When you extend views `ui:` field will be merged from all parents prototypes.
```javascript
Backbone.DOMView.extend({
    ui: {
        title: 'input.title'
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

Hash where keys are jQuery selectors and values are hashes of [helpers](#helpers).

## Methods

### find()

Same as view's `.$(selector)` but it can accept empty value to return `.$el` it self. This method was created for `template:` option to **select root element** with empty string like `"": {class: {done: '@done'}}` and select aliases from `ui:` option.

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

Helper for jquery `.on()` method.
Takes object where keys are events and values are functions

[Example](test/on.coffee)

### connect

Simply binds field of model with property of element by some event (default is `change`).
To set event just add `|eventName` after property name.

[Example](test/connect.coffee)

### each

Helper for collections.
It has three options: view, addHandler and delHandler.

`view:` is view class for added model

[Example](test/each.coffee#L9-L34)

or you can set function which should return view class.

[Example](test/each.coffee#L36-L56)

`addHandler:` is a function which takes two arguments: jquery element and view object of added model.
In this function you should add element of model view to jquery element.
By default `each` will use `append` method.
Also you you can set this option as string name of predefined method:

* append
* prepend
* fadeIn
* slideDown

To add more methods just add them to `Backbone.DOMView.helpers.each.addHandlers` object

`delHandler:` is the same as `addHandler` only for removing elements. Default is `remove`.
Predefined methods:

* remove
* fadeOut
* slideUp

To add more methods just add them to `Backbone.DOMView.helpers.each.delHandlers` object

[Example](test/each.coffee#L58-L83)

`el:` selector for elements which will be detached to use as `el` for `view` class

[Example](test/each.coffee#L85-L108)

Each generated sub view will have field `parent` which points to view generated them.
If sub view already have field `parent` then it will not be overwritten.

[Example](test/each.coffee#L110-L128)

`field:` use name of model field to iterate over it

## Empty selector

You can use empty string to pointing to $el itself.
```javascript
var View = Backbone.DOMView.extend({
    template: {
        "": {
            class: {
                "tested": "@tested"
            }
        }
    }
});

var view = new View({
    model: new Backbone.Model({tested: true})
});

view.$el.hasClass('tested'); // true
```

## Extending views

Each new extended view class will extend `template:` option from parent view class

[Example](test/constructor.coffee#L9-L29)
