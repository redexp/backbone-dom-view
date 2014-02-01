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

        for own selector, helps of this.template
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
    on:      onHelper
    connect: connectHelper

#region =============== Helpers =============================

!function classHelper(selector, options)
    prepareNode.call this, @find(selector), 'toggleClass', options, (v) -> !!v

!function attrHelper(selector, options)
    prepareNode.call this, @find(selector), 'attr', options

!function propHelper(selector, options)
    prepareNode.call this, @find(selector), 'prop', options

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
        this.model.on \change: + field, (model, value) -> node.prop prop, value

#endregion

#region =============== prepare node sub helper =============

dividedField = /^(.+)\|(.+)/
fieldEvent =  /@([\w-]+)/
viewEvent = /#([\w-:\.]+)/
argSelector = /\|arg\((\d+)\)/

!function prepareNode(node, method, options, wrapper)
    model = @model
    view = this

    for own let name, value of options
        switch typeof value
        case \string
            events = value.split /\s+/
            for let event in events
                target = model
                argNum = 0

                event = event.replace argSelector, (x, num)->
                    argNum := num
                    return ''

                func = if wrapper then wrappedHandler else handler

                event = event.replace fieldEvent, (x, field)->
                    target := model
                    argNum := 1
                    func target, model.get field
                    return 'change:' + field

                event = event.replace viewEvent, (x, event)->
                    target := view
                    func!
                    return event

                target.on event, func

                !function handler()
                    node[method] name, arguments[argNum]

                !function wrappedHandler()
                    node[method] name, wrapper arguments[argNum]

        case \object
            for own let event, func of value
                handler = if wrapper
                    -> node[method] name, wrapper func.apply view, arguments
                else
                    -> node[method] name, func.apply view, arguments

                model.on event, handler

#endregion

return DOMView