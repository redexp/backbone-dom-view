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
TodoView = Backbone.DOMView.extend
    template:
        ".title":
            html: "@title"
```
Which means - on change `title` field, change `.title` innerHTML

## Helpers

* [class](#class)
* [attr](#attr-and-prop)
* [prop](#attr-and-prop)
* [style](#style)
* [html](#html)
* [on](#on)
* [connect](#connect)
* [each](#each)

### class

This helper takes object where keys are space separated css classes and values are space separated model events.
First argument of event will be passed to jquery `toggleClass`.

[Example](test/main.coffee#L11-L41)

To change number of argument you can use `|arg(number)` helper after event name

[Example](test/main.coffee#L43-L73)

To bind class with model field you can `@fieldName` notation

[Example](test/main.coffee#L75-L107)

To handle view events just add `#` before event name

[Example](test/main.coffee#L109-L139)

To do some calculation before passing event value, use object where keys are events and values are functions

[Example](test/main.coffee#L141-L173)

### attr and prop

Works just like `class` helper only they set values of events to attributes and properties.

### style

Set css style to element, works just like `class`.

### html

Works just like `class` helper only difference that it not takes names of classes.

### on

Helper for jquery `.on()` method.
Takes object where keys are events and values are functions

[Example](test/main.coffee#L176-L184)

### connect

Simply binds field of model with property of element by some event (default is `change`).
To set event just add `|eventName` after property name.

[Example](test/main.coffee#L187-L207)

### each

Helper for collections.
It has three options: view, addHandler and delHandler.

`view:` is view class for added model

[Example](test/main.coffee#L210-L235)

or you can set function which should return view class.

[Example](test/main.coffee#L264-L284)

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

[Example](test/main.coffee#L237-L262)
