function def(modules, module)
    if typeof define is \function and define.amd
        define modules, module
    else
        module Backbone

Backbone <- def ['backbone']

DOMView = Backbone.DOMView = Backbone.View.extend do
    constructor: (ops, ...rest) !->
        if ops instanceof Backbone.Model
            Backbone.View.apply(this, [model: ops].concat rest)

        Backbone.View.apply(this, arguments)

        return if typeof @template is not \object

        for own selector, helps of @template
            for own helper, options of helps
                helpers[helper].call(this, selector, options)

    find: (selector) ->
        if selector
            this.$el.find(selector)
        else
            this.$el

helpers = DOMView.helpers = do
    class:   classHelper
    attr:    attrHelper
    prop:    propHelper
    style:   styleHelper
    html:    htmlHelper
    on:      onHelper
    connect: connectHelper
    each:    eachHelper

#region =============== Helpers =============================

!function classHelper(selector, options)
    callJquerySetterMethod.call this, do
        node:    @find(selector)
        method: 'toggleClass'
        options: options
        wrapper: (v) -> !!v

!function attrHelper(selector, options)
    callJquerySetterMethod.call this, do
        node:    @find(selector)
        method: 'attr'
        options: options

!function propHelper(selector, options)
    callJquerySetterMethod.call this, do
        node:    @find(selector)
        method: 'prop'
        options: options

!function styleHelper(selector, options)
    callJquerySetterMethod.call this, do
        node:    @find(selector)
        method: 'css'
        options: options

!function htmlHelper(selector, options)
    callJqueryMethod.call this, do
        node:    @find(selector)
        method: 'html'
        options: options

!function onHelper(selector, options)
    node = @find(selector)
    for own event, func of options
        node.on event, ~> func.apply this, arguments

!function connectHelper(selector, options)
    node = @find(selector)
    for own let prop, field of options
        event = \change
        if propEvent = prop.match dividedField
            [x, prop, event] = propEvent
        node.on event, ~> this.model.set field, node.prop(prop)
        @model.on \change: + field, (model, value) -> node.prop prop, value

        node.prop prop, @model.get field

#endregion

#region =============== prepare node sub helper =============

dividedField = /^(.+)\|(.+)/
fieldEvent =  /@([\w-]+)/
viewEvent = /#([\w-:\.]+)/
argSelector = /\|arg\((\d+)\)/

!function callJqueryMethod({node, method, options, wrapper, fieldName})
    model = @model
    view = this

    switch typeof options
    case \string
        events = options.split /\s+/
        for let event in events
            target = model
            argNum = 0

            event = event.replace argSelector, (x, num)->
                argNum := num
                return ''

            event = event.replace fieldEvent, (x, field)->
                target := model
                argNum := 1
                helperHandler target, model.get field
                return 'change:' + field

            event = event.replace viewEvent, (x, event)->
                target := view
                helperHandler!
                return event

            target.on event, helperHandler

            !function helperHandler()
                value = arguments[argNum]
                if wrapper then value = wrapper value
                if fieldName
                    node[method] fieldName, value
                else
                    node[method] value

    case \object
        for own let event, func of options
            model.on event, helperHandler

            !function helperHandler()
                value = func.apply view, arguments
                if wrapper then value = wrapper value
                if fieldName
                    node[method] fieldName, value
                else
                    node[method] value

    case \function
        value = options.apply view, arguments
        if wrapper then value = wrapper value
        if fieldName
            node[method] fieldName, value
        else
            node[method] value

!function callJquerySetterMethod(ops)
    {options} = ops
    for own name, value of options
        ops.fieldName = name
        ops.options = value
        callJqueryMethod.call this, ops

#endregion

#region =============== Each helper =========================

!function eachHelper(selector, options)
    asd!

#endregion

return DOMView