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

**AMD ready**

## Properties

### ui:

Used to create alias of jQuery selectors. Instead of calling dozen times `this.$('.title')` you can use `this.ui.title`, so if you need to change selector in extended classs, you will change it only in one place. As value of `ui:` you can use `Object` or `Function` (which should return an object). Also you can use this alias in `template:` instead of selectors. When you extend views, `ui:` field will be merged with all parents prototypes.

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
        },
        'edit': {
            prop: {
                'value': '@title'
            }
        }
    }
});
```
By default `ui:` has one alias `root` which is alias to `this.$el`.

### template:

Hash where keys are jQuery selectors or `ui` fields names or both of them but then you need put `ui` names in curly brackets. Values of `template:` fields are hashes of [helpers](#helpers) names. When you extend views, `template:` field will be merged with all parent `template` fields. Merged result will written as own `view.template` property and will be available in `initialize` function before processing template, so you can do last modification to it. When `template` will be prepared, will be triggered [template-ready](#template-ready) event.
```javascript
Backbone.DOMView.extend({
    ui: {
        name: 'input'
    },

    initialize: function () {
        if (this.model.get('disabled')) {
            delete this.template.root['class'].selected;
        }
    },

    template: {
        'root': {
            'class': {
                'selected': '@selected'
            }
        },
        'name': {
            'prop': {
                'value': '@name'
            }
        },
        '{name} + label': {
            'text': '@name'
        }
    }
});
```
As value of `template:` you can use `Object` or `Function` (which should return an object). Function will get utility `extendDeep` as first argument
```javascript
Backbone.DOMView.extend({
    template: function (extendDeep) {
        var tpl = {
            'root': {
                'class': {
                    'selected': '@selected'
                }
            }
        };

        this.$('input').each(function (i, inp) {
            var selector = 'input[name=' + inp.name + ']';
            tpl[selector] = {
                prop: {
                    'value': '@' + inp.name
                }
            };
        });

        return tpl;
    }
});
```

### defaults:

Same as `Backbone.Model::defaults` option, see [get, set, has](#get-set-has) in [Methods](#methods) section.

### .parent

[each](#each) helper will add to children views field `parent` which will be link to current view.

## Methods

* [get, set, has](#get-set-has)
* [matches](#matches)
* [find](#find)
* [bind](#bind)
* [bindTo](#bindTo)
* [listenElement](#listenElement)
* [stopListeningElement](#stopListeningElement)

### get, set, has

<a name="get-set-has"></a>`DOMView` can listen model attributes, but many times you will need extra attributes to store current state of view like `selected` or `editing`, so for this purpose view inherited `get`, `set` and `has` methods from `Backbone.Model`.
```javascript
Backbone.DOMView.extend({
    defaults: {
        error: false,
        message: ''
    },

    initialize: function () {
        this.listenTo(this.model, 'invalid', function (error) {
            this.set({
                'error': true,
                'message': error
            });
        });
    },

    template: {
        'root': {
            'class': {
                'error': '@error'
            }
        },
        '.message': {
            text: '@message'
        }
    }
});
```

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
        "root": { /* <div> */ },
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

`view.bind('event', callback)` - will bind to `event` which should be triggered in `model`

`view.bind('#event', callback)` - will bind to `event` which should be triggered in `view`

`view.bind('@attribute_name', callback)` - will bind to `change:attribute_name` which should be triggered in `view` (if `view` has `attribute_name`) or in `model` (if `view` do not has `attribute_name`). Callback will be called immediately with `attribute_name` value.

`view.bind('=attribute_name', callback)` - will not bind to any event, it just will call `callback` with `attribute_name` value.

Also you can add `!` before any event type to get opposite first argument in event callback.

All default helpers uses `bind` method to bind to events.
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
                        return value * 2 === 4;
                    }
                },

                'hidden': '!@visible',

                'deleted': '=is_deleted',
                // same as
                'deleted': function () {
                    return this.model.get('is_deleted');
                }
            }
        }
    } 
});
```
Class `active` will not be added when view will be created even if model field `active` is `true`, because it will wait for `change:active` event. Instead of it class `selected` will be synced with model field `selected` on view creation because it uses `@selected` notation.

### bindTo()

Same as `bind()` but first argument is another then `view.model` model.
```javascript
Backbone.DOMView.extend({
    initialize: function () {
        this.bindTo(this.model.get('friends'), 'add reset #change', function () {});
        // same as
        this.listenTo(this.model.get('friends'), 'add reset', function () {});
        this.on('change', function () {});
    }
});
```

### listenElement(element, event, callback)

Just like `listenTo()` only for html elements. Instead of `element.on(event, callback)` you can use `view.listenElement(element, event, callback)` and `this` in `callback` will be `view` and when you will need to remove `callback` from `elemet` you can use `view.stopListeningElement(element)`. Useful for memory management.

Also you can pass `selector` like with `element.on(event, selector, callback)` same here `view.listenElement(element, event, selector, callback)`

### stopListeningElement()

Just like `stopListening()`. If you pass no arguments, it will off all events from all elements. If you pass just element, then it will off all events from this element. If you pass element and event name, then it will off only this event.

## Internal Events

View has several internal events

### template-ready

By default `template` will be executed only after `initialize` callback, so if you want to do some stuff after it, you can use `template-ready` event or `Backbone.DOMView.readyEvent`. You can change `Backbone.DOMView.readyEvent`
```javascript
Backbone.DOMView.extend({
    initialize: function () {
        this.once('template-ready', function () { /*...*/ });
        this.once(Backbone.DOMView.readyEvent, function () { /*...*/ });
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
* [safeHtml](#safeHtml)
* [text](#text)
* [template](#template)
* [on](#on)
* [connect](#connect)
* [each](#each)

You can define your own helpers, just add them to `Backbone.DOMView.helpers` object.
Arguments passed to helpers are `selector` and `options`.

### class

**jQuery alias:** `.toggleClass()`

It will add css class to element if first argument of event will be truthy and remove if not.

It is a hash where keys are space separated css class names and values are event name or hash of events and callbacks or function. If value is event name, then helper will create callback for you where it will take first argument.
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
                }
            }
        }
    } 
});
```
If value is function it means css class should be initialized once on view creation.
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
With `@attribute_name` event you can initialize class name on view creation and listen to changes of `attribute_name`
```javascript
Backbone.DOMView.extend({
    template: {
        '.title': {
            'class': {
                'hidden': '@hide'
            }
        }
    } 
});
```

### attr

**jQuery alias:** `.attr()`

Used to change attributes values.

It is a hash where the keys are attributes names and values same as in [class](#class) helper only values from callbacks will be used as values for attributes.
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

### safeHtml

Just like `html` only it will replace tags `script`, `style`, `link`, `meta`, `iframe`, `frame` with tag `<div style="display: none;">` and will replace `on*=` attributes like `onclick=` with `x-*=` like `x-click=`.

### text

**jQuery alias:** `.text()`

Works just like `html` helper only difference that it uses `text()` method of jQuery, which will convert all html special chars to html entities.

### template

This is simple helper which helps make long selectors shorter
```javascript
Backbone.DOMView.extend({
    template: {
        '.user': {
            template: {
                '.name': {
                    text: '@name'
                },
                '&.age': {
                    text: '@age'
                }
            }
        },

        // instead of

        '.user .name': {
            text: '@name'
        },
        '.user.age': {
            text: '@age'
        }
    }
});
```
You can write this even shorter, just start all your sub selectors with `&` and you can omit `template:` helper.
Basically it means if helper name starts with `&` then recognize it as selector.
```html
<div class="user">
  <h2 class="title"></h2>
  <span class="user-name"></span>
  <div data-toolbar>
    <button data-toolbar-edit></button>
  </div>
</div>
```
```javascript
Backbone.DOMView.extend({
    template: {
        '.user': {
            '& .title': {
                text: '@title'
            },
            '&-name': {
                text: '@name'
            },
            '& [data-toolbar': {
                '&-edit]': {
                    on: {
                        'click': function() {
                            //...
                        }
                    }
                }
            },
            on: {
                'click': function() {
                    //...
                }
            }
        }
    }
});
```


### on

**jQuery alias:** `.on()`

Used to bind callbacks to dom events.

It is a hash where keys are space separated dom events and values are string names of view methods or callbacks or hash of selectors and callbacks (to implement `.on('event', 'selector', callback)` pattern). Callback will get same arguments as jQuery `.on()` callback. `this` in callbacks will be current view.
```javascript
Backbone.DOMView.extend({
    open: function () {
        //...
    },

    template: {
        '.open': {
            on: {
                'click': 'open',
                // same as
                'click': function () {
                    this.open();
                }
            }
        },
    
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

This helper gives you two way binding with element property and view or model attribute. By default helper will listen for `chnage` event in element and `change:field_name` in view or model.
```javascript
Backbone.DOMView.extend({
    defaults: {
        active: false
    },

    template: {
        'input.title': {
            connect: {
                'value': 'title'
            }
        },
        'input.active': {
            connect: {
                'checked': 'active'
            }
        }
    }
});
```
So when `input.title` element will trigger `change` event, helper will take `value` property and set it to model's `title` field and when model trigger `change:title`, helper will change `value` with new `title`. Same with view's `active` attribute.

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
        'root': {
            text: '@title'
        }
    }
});

var ListView = Backbone.DOMView.extend({
    tagName: 'ul',
    template: {
        'root': {
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

view.$el //= <ul><li>one</li> <li>two</li> <li>three</li></ul>

list.remove(list.at(1));

view.$el //= <ul><li>one</li> <li>three</li></ul>

list.add({title: 'four'});

view.$el //= <ul><li>one</li> <li>three</li> <li>four</li></ul>

list.at(0).set('title', 'zero');

view.$el //= <ul><li>zero</li> <li>three</li> <li>four</li></ul>
```

#### Options

* [view:](#each-view)
* [el:](#each-el)
* [field:](#each-field)
* [viewProp:](#each-view-prop)
* [sort:](#each-sort)
* [sortByViews:](#each-sort-by-views)
* [addHandler:](#each-add-handler)
* [delHandler:](#each-del-handler)
* [addEvent:](#each-add-event)
* [removeEvent:](#each-remove-event)
* [resetEvent:](#each-reset-event)
* [addedEvent:](#each-added-event)
* [offOnRemove:](#each-off-on-remove)

<a name="each-view"></a>**view:** `{View|Function}`

If `view:` value is `Backbone.View` class (or extended form it) then helper will create instances from this class for each model added to collection. If `view:` value is `Function` then helper will call it for each model and expect View class or view instance from it (helpful if you need different views in same collection).

**el:** `{String|Object|Function}` Default: `null`

Selector for `el:` option for `view:` class.
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

view.$el //= <ul class="items"><li><span class="title">one</span></li> <li><span class="title">two</span></li> <li><span class="title">three</span></li></ul>
```
When you will create instance of `ListView` it will detach `ul.items > li` and use it clone as `el:` option for `ItemView`.

If your collection should be rendered with different views and different `el:` for them, then you can use object with tags attributes names and model attributes.
```html
<ul>
    <li data-type="1"><span></span></li>
    <li data-type="second"><input /></li>
    <li data-type="last"><div></div></li>
</ul>
```
```javascript
var ListView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                view: function (model) {
                    switch (model.get('type')) {
                        case '1': return FirstView;
                        case 'second': return InputView;
                        case 'last': return DefaultView;
                    }
                },
                el: {
                    'data-type': 'type'
                }
            }
        }
    }
});
```
This means that helper will detach all `ul.items > [data-type]` elements and when new model will be added to collection it will take it `type` attribute value and find element with same `data-type` attribute value and will use it clone for new child view as `el:` option.

Instead of model's attribute name you can also use function which should return elements attribute value
```html
<ul>
    <li class="type-one"><span></span></li>
    <li class="type-two"><input /></li>
    <li class="type-three"><div></div></li>
</ul>
```
```javascript
var ListView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                view: function (model) {
                    switch (model.get('type')) {
                        case 'one': return FirstView;
                        case 'two': return InputView;
                        case 'three': return DefaultView;
                    }
                },
                el: {
                    'class': function (model) {
                        return 'type-' + model.get('type');
                    }
                }
            }
        }
    }
});
```
Also you can use function for `el:` which should return jQuery object or selector or object described above.

<a name="each-field"></a>**field:** `{String|Object}` Default: `null`

Helper can work not only with `this.model` but also with collection in model (or in view). Name of this filed you can set with this option
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

view.$el.find('.items') //= <ul class="items"><li>one</li> <li>two</li> <li>three</li></ul>
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

Backbone Collection can work only with array of objects, so your wrapper can prepare array of values to collection of objects
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

<a name="each-view-prop"></a>**viewProp:** `{String}` Default: `null`

All generated views for models in collection `each` will store in object of `DOMView.eachHelper.EachViewList` class. Access to this object you can get by setting `viewProp:` option with name of property which should be added to view with `EachViewList` object. Own properties of this object are models `cid` and values are views of this models. `EachViewList` has few most useful methods which works just like `Backbone.Collection` methods only for views:

* `where` has extended functionality, it can accept regular expressions.
* `findWhere`
* `count` is just like `where`, only it returns count of founded views.
* `get` will return view by model or id or cid.
* `getByEl` return view by jquery object or native element
* `getModels` returns array of models in `EachViewList`
* and almost all underscore functions applicable to objects

```javascript
var ItemView = Backbone.DOMView.extend({
    defaults: {
        error: false
    },

    template: {
        'root': {
            'class': {
                'error': '@error'
            }
        }
    }
});

var ListView = Backbone.DOMView.extend({
    initialize: function () {
        this.on('template-ready', function () {
            var views = this.items.where({error: false});

            var view = this.items.get(this.model.at(0));

            this.items.invoke('set', 'error', true);

            this.items.forEach(function (view, i) {
                // ...
            });
        });
    },

    template: {
        'ul.items': {
            each: {
                view: ItemView,
                el: '> *',
                viewProp: 'items'
            }
        }
    }
});
```

<a name="each-sort"></a>**sort:** `{Boolean|Object}` Default: `false`

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

view.$el //= <ul class="items"><li>one</li> <li>two</li> <li>three</li></ul>

list.at(0).set('order', 4);

view.$el //= <ul class="items"><li>two</li> <li>three</li> <li>one</li></ul>
```

<a name="each-sort-by-views"></a>**sortByViews:** `{String|Object}` Default: `null`

`each` can sort models in collection by current views position in DOM. All you need is to trigger an event in parent view. Config is same as for `sort:`
```javascript
sortByViews: 'sortable-update'
// or
sortByViews: {
    event: 'sortable-update'
}
// or if you want to set order in some field
sortByViews: {
    event: 'sortable-update',
    field: 'index'
}
```

<a name="each-add-handler"></a>**addHandler:** `{String|Function}` Default: `'append'`

By default helper will use `.append()` jQuery method to add views to `ul.items`, you can chenge it with three predefined jQuery methods and pass it as a string for this option: `prepend`, `fadeIn`, `slideDown`. Or you can use function and add view in custom way.
```javascript
var ListView = Backbone.DOMView.extend({
    template: {
        'ul.items': {
            each: {
                view: ItemView,
                addHandler: function (ul, view) {
                    view.$el
                        .css({
                            height: 0
                        })
                        .appendTo(ul)
                        .animate({
                            height: 100
                        }, 600, 'easeOutBounce')
                    ;
                }
            }
        }
    }
});
```

<a name="each-del-handler"></a>**delHandler:** `{String|Function}` Default: `'remove'`

Same as `addHandler` only for removing views. Default method is `remove`. Predefined methods: `fadeOut`, `slideUp`.

<a name="each-add-event"></a>**addEvent:** `{String}` Default: `'add'`

By default helper will listen for `add` event to add new view, but you can change it with this option

<a name="each-remove-event"></a>**removeEvent:** `{String}` Default: `'remove'`

Same as `addEvent` only for remove view.

<a name="each-reset-event"></a>**resetEvent:** `{String}` Default: `'reset'`

Same as `addEvent` only for reset collection.

<a name="each-added-event"></a>**addedEvent:** `{String}` Default: `'added'`

This event will be triggered in sub view when `addHandler` will be called. It useful when you need to be sure that your `view.$el` is in DOM.

<a name="each-off-on-remove"></a>**offOnRemove:** `{Boolean}` Default: `true`

By default all views created by this helper on remove will stop listen all events (`.off().stopListening().stopListeningElement()`). You can disable it by set this option to `false`.

### Best practices for creating classes

In `each` helper you need set `view:`, but if you create classes like `var ClassName = Backbone....extend()` then first you will need to create child view and after that list view (upside down class definition). To solve this problem you can create classes like this
```javascript
function ClassName() {
    Backbone.Model.apply(this, arguments);
}

Backbone.Model.extend({
    constructor: ClassName,
    
    // initialize: function () {....}
});
```
In this case `ClassName` will be available in all you current scope, dosen't matter where it was defined, so you can use it first and define it after.
```javascript
function UsersList() {
    Backbone.Collection.apply(this, arguments);
}

Backbone.Collection.extend({
    constructor: UsersList,
    model: User
});

function User() {
    Backbone.Model.apply(this, arguments);
}

Backbone.Model.extend({
    constructor: User
});
```
And use it in `view:` option
```javascript
function UsersListView() {
    Backbone.DOMView.apply(this, arguments);
}

Backbone.DOMView.extend({
    constructor: UsersListView,
    
    template: {
        'ul': {
            each: {
                view: UserView,
                el: '> li'
            }
        }
    }
});

function UserView() {
    Backbone.DOMView.apply(this, arguments);
}

Backbone.DOMView.extend({
    constructor: UserView,
    
    template: {
        'root': {
            text: '=name'
        }
    }
});

```
