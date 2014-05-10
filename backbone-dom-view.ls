function def(modules, module)
    if typeof define is \function and define.amd
        define modules, module
    else
        module Backbone

Backbone <- def ['backbone']

DOMView = Backbone.DOMView = Backbone.View.extend do
    constructor: (ops, ...rest) !->
        if ops instanceof Backbone.Model or ops instanceof Backbone.Collection
            Backbone.View.apply(this, [model: ops].concat rest)
        else
            Backbone.View.apply(this, arguments)

        if typeof @template is \object
            @template = Backbone.$.extend true, {}, @template
            for own selector, helps of @template
                for own helper, options of helps
                    helpers[helper].call(this, selector, options)

            this.trigger \template-ready

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
    text:    textHelper
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

!function textHelper(selector, options)
    callJqueryMethod.call this, do
        node:    @find(selector)
        method: 'text'
        options: options

!function onHelper(selector, options)
    node = @find(selector)
    for own let event, func of options
        node.on event, ~> func.apply this, arguments

!function connectHelper(selector, options)
    node = @find(selector)
    for own let prop, field of options
        event = \change
        if propEvent = prop.match dividedField
            [x, prop, event] = propEvent
        node.on event, ~> this.model.set field, node.prop(prop)
        @listenTo @model, \change: + field, (model, value) -> if value is not node.prop(prop) then node.prop prop, value

        node.prop prop, @model.get field

#endregion

#region =============== prepare node sub helper =============

dividedField = /^(.+)\|(.+)/
fieldEvent =  /@([\w-]+)/
viewEvent = /#([\w-:\.]+)/
argSelector = /\|arg\((\d+)\)/

!function callJqueryMethod({node, method, options, wrapper, fieldName}:ops)
    model = @model
    view = this
    ops.view = view
    ops.model = view.model

    switch typeof options
    case \string
        ops.events = options.split /\s+/
        convertEvents ops

    case \object
        for own let events, func of options
            ops.events = events.split /\s+/
            ops.func = func
            convertEvents ops

    case \function
        value = options.apply view, arguments
        ops.value = value
        applyJqueryMethod ops

!function convertEvents({node, method, events, wrapper, fieldName, func, view, model}:ops)
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

        if target is model
            view.listenTo model, event, helperHandler
        else
            view.on event, helperHandler

        !function helperHandler()
            if func
                value = func.apply view, arguments
            else
                value = arguments[argNum]
                
            ops.value = value
            applyJqueryMethod ops

!function applyJqueryMethod({node, method, fieldName, wrapper, value}:ops)
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
    view = this
    holder = @find selector
    list = if field = options.field then @model.get field else @model

    options.viewList = {}

    options.addHandler ?= \append
    options.delHandler ?= \remove

    if typeof options.addHandler is \string
        options.addHandler = eachHelper.addHandlers[options.addHandler]

    if typeof options.delHandler is \string
        options.delHandler = eachHelper.delHandlers[options.delHandler]

    view.listenTo list, \add, eachAddListener
    view.listenTo list, \remove, eachRemoveListener

    list.each eachAddListener

    !function eachAddListener(model)
        View = if isClass options.view then options.view else options.view.call view, model
        
        subView = if isClass View
            ops = {model: model}
            if options.viewNode then ops.el = options.viewNode.clone!
            new View(ops)
        else 
            View
            
        options.viewList[model.cid] = subView
        options.addHandler.call view, holder, subView

    !function eachRemoveListener(model)
        subView = delete options.viewList[model.cid]
        options.delHandler.call view, holder, subView

eachHelper.addHandlers = do
    append: (ul, view)!-> ul.append view.$el
    prepend: (ul, view)!-> ul.prepend view.$el
    fadeIn:  (ul, view)!-> view.$el.hide!.appendTo(ul).fadeIn!
    slideIn: (ul, view)!-> view.$el.hide!.appendTo(ul).slideIn!

eachHelper.delHandlers = do
    remove: (ul, view)!-> view.$el.remove!
    fadeOut:  (ul, view)!-> view.$el.fadeOut -> view.$el.remove!
    slideOut: (ul, view)!-> view.$el.slideOut -> view.$el.remove!

function isClass(func)
    return func.hasOwnProperty '__super__'

#endregion

return DOMView
