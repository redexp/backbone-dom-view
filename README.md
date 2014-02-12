backbone-dom-view
=================

Better View class for Backbone

Main idea of this view class is in configuration template object which looks like this
```coffeescript
View = Backbone.DOMView.extend
    template:
        "jquery selector":
            "name of helper":
                "helper options"
```

For example view for Todo model
```coffeescript
View = Backbone.DOMView.extend
    template:
        ".title":
            html: "@title"
        ".state":
            class:
                "done": "@is_done"
```
Which means - on change `title` field, change `.title` innerHTML and when `is_done` will be true add class `done`

## Installation

Bower:
`bower install backbone-dom-view`

Script:
`<script src="backbone-dom-view.js"></script>`

**RequireJS ready**

## Empty selector

You can use empty string to pointing to $el itself.
```coffeescript
View = Backbone.DOMView.extend
    template: "":
        class: "tested": "@tested"

view = new View new Backbone.Model tested: yes
view.$el.hasClass 'tested' #>> true
```

## Helpers

* [class](#class)
* [attr](#attr-and-prop)
* [prop](#attr-and-prop)
* [style](#style)
* [html](#html)
* [on](#on)
* [connect](#connect)
* [each](#each)

You can define your helpers, just add them to `Backbone.DOMView.helpers` object.
Arguments of helpers are selector and options.

### class

This helper takes object where keys are space separated css classes and values are space separated model events.
First argument of event will be passed to jquery `toggleClass`.

[Example](test/class-prop-attr-style-html.coffee#L10-L40)

To change number of argument you can use `|arg(number)` helper after event name

[Example](test/class-prop-attr-style-html.coffee#L42-L72)

To bind class with model field you can `@fieldName` notation

[Example](test/class-prop-attr-style-html.coffee#L74-L106)

To handle view events just add `#` before event name

[Example](test/class-prop-attr-style-html.coffee#L108-L138)

To do some calculation before passing event value, use object where keys are events and values are functions

[Example](test/class-prop-attr-style-html.coffee#L140-L172)

### attr and prop

Works just like `class` helper only they set values of events to attributes and properties.

### style

Set css style to element, works just like `class`.

### html

Works just like `class` helper only difference that it not takes names of classes.

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
* slideIn

To add more methods just add them to `Backbone.DOMView.helpers.each.addHandlers` object

`delHandler:` is the same as `addHandler` only for removing elements. Default is `remove`.
Predefined methods:

* remove
* fadeOut
* slideOut

To add more methods just add them to `Backbone.DOMView.helpers.each.delHandlers` object

[Example](test/each.coffee#L58-L83)
