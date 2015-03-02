;(function() {

    if (typeof define === 'function' && define.amd) {
        define('backbone-dom-view', ['backbone', 'underscore'], module);
    } else {
        module(Backbone);
    }

    function module (BB, _) {

        var View = BB.View,
            $ = BB.$;

        var dividedField = /^(.+)\|(.+)/,
            fieldEvent = /@([\w-]+)/,
            viewEvent = /#([\w\-:\.]+)/,
            argSelector = /\|arg\((\d+)\)/,
            uiSelectors = /\{([^}]+)}/g;

        function DOMView(ops) {
            var view = this;

            view.attributes = {};
            if (view.defaults) {
                view.set(_.result(view, 'defaults'));
            }

            view.template = mergeExtendedField(view, 'template');

            View.apply(view, arguments);

            var template = view.template;

            for (var selector in template) {
                if (!has(template, selector)) continue;

                var helpersList = template[selector];

                for (var helper in helpersList) {
                    if (!has(helpersList, helper)) continue;

                    helpers[helper].call(view, selector, helpersList[helper]);
                }
            }

            view.trigger(DOMView.readyEvent);
        }

        BB.DOMView = View.extend({
            constructor: DOMView,

            ui: {
                root: ''
            },

            setElement: function () {
                View.prototype.setElement.apply(this, arguments);

                var view = this;

                var ui = mergeExtendedField(view, 'ui');
                view.ui = {};

                for (var name in ui) {
                    if (!has(ui, name)) continue;

                    view.ui[name] = view.find(ui[name]);
                }

                this.trigger(DOMView.elementEvent);

                return this;
            },

            find: function(selector) {
                if (!selector) return this.$el;

                if (this.ui[selector]) return this.ui[selector];

                if (selector.indexOf('{') > -1) {
                    var ui = this.ui,
                        rootSelectorLength = this.$el.selector.length;

                    selector = selector.replace(uiSelectors, function (x, name) {
                        return typeof ui[name] === 'string' ? ui[name] : ui[name].selector.slice(rootSelectorLength);
                    });
                }

                return this.$el.find(selector);
            },

            bind: function (events, func) {
                var view = this,
                    model = view.model;

                events = $.trim(events).split(/\s+/);

                for (var i = 0, len = events.length; i < len; i++) {
                    parseEvent(events[i]);
                }

                function parseEvent (event) {
                    var target = model,
                        argNum = null;

                    event = event.replace(argSelector, function(x, num) {
                        argNum = num;
                        return '';
                    });

                    event = event.replace(fieldEvent, function(x, field) {
                        target = view.has(field) ? view : model;
                        argNum = 1;
                        bindApplyFunc(target, target.get(field));
                        return 'change:' + field;
                    });

                    event = event.replace(viewEvent, function(x, event) {
                        target = view;
                        return event;
                    });

                    if (target === model) {
                        view.listenTo(model, event, bindApplyFunc);
                    }
                    else {
                        view.on(event, bindApplyFunc);
                    }

                    function bindApplyFunc () {
                        return func.apply(view, argNum === null ? arguments : [arguments[argNum]]);
                    }
                }
            },

            get: BB.Model.prototype.get,
            set: BB.Model.prototype.set,
            has: BB.Model.prototype.has,
            _validate: BB.Model.prototype._validate
        });

        DOMView.readyEvent = 'template-ready';
        DOMView.elementEvent = 'element-ready';

        var helpers = DOMView.helpers = {
            'class': classHelper,
            attr: attrHelper,
            prop: propHelper,
            style: styleHelper,
            html: htmlHelper,
            text: textHelper,
            on: onHelper,
            connect: connectHelper,
            each: eachHelper
        };

        function classHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'toggleClass',
                options: options,
                wrapper: function(v) {
                    return !!v;
                }
            });
        }

        function attrHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'attr',
                options: options
            });
        }

        function propHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'prop',
                options: options
            });
        }

        function styleHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'css',
                options: options
            });
        }

        function htmlHelper (selector, options) {
            callJqueryMethod({
                view: this,
                node: this.find(selector),
                method: 'html',
                options: options
            });
        }

        function textHelper (selector, options) {
            callJqueryMethod({
                view: this,
                node: this.find(selector),
                method: 'text',
                options: options
            });
        }

        function onHelper (selector, options) {
            var view = this,
                node = view.find(selector),
                ops;

            for (var event in options) {
                if (!has(options, event)) continue;

                ops = options[event];

                if (typeof ops === 'object') {
                    for (var target in ops) {
                        if (!has(ops, target)) continue;

                        onHelperBindEvent(event, target, ops[target]);
                    }
                }
                else {
                    onHelperBindEvent(event, ops);
                }
            }

            function onHelperBindEvent (event, target, func) {
                if (typeof target === 'string') {
                    node.on(event, target, function() {
                        return func.apply(view, arguments);
                    });
                }
                else {
                    node.on(event, function() {
                        return target.apply(view, arguments);
                    });
                }
            }
        }

        function connectHelper (selector, options) {
            var view = this,
                node = view.find(selector);

            for (var prop in options) {
                if (!has(options, prop)) continue;

                connectHelperBind(prop, options[prop]);
            }

            function connectHelperBind (prop, field) {
                var event = 'change',
                    propEvent = prop.match(dividedField);

                if (propEvent) {
                    prop = propEvent[1];
                    event = propEvent[2];
                }

                var target = view.has(field) ? view : view.model;

                node.on(event, function() {
                    target.set(field, node.prop(prop));
                });

                view.listenTo(target, 'change:' + field, function(model, value) {
                    if (value !== node.prop(prop)) {
                        node.prop(prop, value);
                    }
                });

                node.prop(prop, target.get(field));
            }
        }

        function callJqueryMethod (ops) {
            var view = ops.view,
                model = view.model,
                options = ops.options;

            ops = extend({
                model: model
            }, ops);

            switch (typeof options) {
                case 'string':
                    bindEvents(options);
                    break;

                case 'object':
                    for (var events in options) {
                        if (!has(options, events)) continue;

                        bindEvents(events, options[events]);
                    }
                    break;

                case 'function':
                    ops.value = options.apply(view, arguments);
                    applyJqueryMethod(ops);
                    break;
            }

            function bindEvents(events, func) {
                view.bind(events, function () {
                    ops.value = func ? func.apply(view, arguments) : arguments[0];
                    applyJqueryMethod(ops);
                });
            }
        }

        function applyJqueryMethod (ops) {
            var node = ops.node,
                method = ops.method,
                fieldName = ops.fieldName,
                wrapper = ops.wrapper,
                value = ops.value;

            if (wrapper) {
                value = wrapper(value);
            }

            if (fieldName) {
                node[method](fieldName, value);
            }
            else {
                node[method](value);
            }
        }

        function callJquerySetterMethod (ops) {
            var options = ops.options;

            for (var name in options) {
                if (!has(options, name)) continue;

                ops.fieldName = name;
                ops.options = options[name];
                callJqueryMethod(ops);
            }
        }

        /**
         * Options for "each" helper
         * @typedef {Object} EachHelperOptions
         * @property {String|Object} field
         * @property {Function|Object} view
         * @property {String} el
         * @property {String} addHandler
         * @property {String} delHandler
         * @property {String} addEvent
         * @property {String} resetEvent
         * @property {String} removeEvent
         * @property {String} addedEvent
         * @property {Boolean|Object} sort
         * @property {Boolean} offOnRemove
         * @property {EachViewList} viewList
         * @property {String|Object} sortByViews
         */

        /**
         * @param {string} selector
         * @param {EachHelperOptions} options
         */
        function eachHelper (selector, options) {
            _.defaults(options, {
                addHandler: 'append',
                delHandler: 'remove',
                addEvent: 'add',
                resetEvent: 'reset',
                removeEvent: 'remove',
                addedEvent: 'added',
                sort: false,
                sortByViews: false,
                offOnRemove: true
            });

            var view = this,
                holder = view.find(selector),
                viewEl = options.el ? holder.find(options.el).detach() : false,
                list = view.model;

            if (options.field) {
                var field = options.field,
                    fieldName = field,
                    fieldClass = null;

                if (typeof field === 'object') {
                    fieldName = field.name;
                    fieldClass = field.wrapper;
                }

                list = view.model.get(fieldName);

                if (fieldClass) {
                    list = new fieldClass(list);
                }
            }

            var viewList = options.viewList = new EachViewList();
            var addHandler = options.addHandler;
            var delHandler = options.delHandler;

            if (typeof addHandler === 'string') {
                addHandler = eachHelper.addHandlers[addHandler];
            }

            if (typeof delHandler === 'string') {
                delHandler = eachHelper.delHandlers[delHandler];
            }

            view.listenTo(list, options.addEvent, eachAddListener);
            view.listenTo(list, options.resetEvent, eachResetListener);
            view.listenTo(list, options.removeEvent, eachRemoveListener);

            var sort = options.sort;
            if (sort) {
                view.listenTo(list, sort.event || 'sort', eachSortHandler);
            }

            var sortByViews = options.sortByViews;
            if (sortByViews) {
                var sortEvent = typeof sortByViews === 'string' ? sortByViews : sortByViews.event;
                view.on(sortEvent, eachSortListByViewsHandler);
            }

            list.each(eachAddListener);

            function eachAddListener (model) {
                var View = isClass(options.view) ? options.view : options.view.call(view, model),
                    childView = View;

                if (isClass(View)) {
                    var viewOps = {
                        model: model
                    };

                    if (viewEl) {
                        viewOps.el = viewEl.clone();
                    }

                    childView = new View(viewOps);
                }

                childView.parent = childView.parent || view;
                viewList[model.cid] = childView;
                addHandler.call(view, holder, childView);
                childView.trigger(options.addedEvent);
            }

            function eachResetListener(model, ops) {
                ops.previousModels.forEach(eachRemoveListener);
                list.each(eachAddListener);
            }

            function eachRemoveListener (model) {
                var subView = viewList[model.cid];

                delHandler.call(view, holder, subView);

                subView.trigger(options.removeEvent, view);

                if (subView.parent === view) {
                    subView.parent = null;
                }

                if (options.offOnRemove) {
                    subView
                        .off()
                        .stopListening()
                    ;
                }

                delete viewList[model.cid];
            }

            function eachSortHandler() {
                if (sort.field) {
                    list.toArray().sort(sortByField).reduce(sortViews);
                }
                else {
                    list.reduce(sortViews);
                }
            }

            function sortViews(prev, model, i) {
                if (i === 1) {
                    var first = viewList[prev.cid].$el;
                    holder.prepend(first);
                    prev = first;
                }

                return viewList[model.cid].$el.insertAfter(prev);
            }

            function sortByField(a, b) {
                a = a.get(sort.field);
                b = b.get(sort.field);

                return a < b ? -1 : a === b ? 0 : 1;
            }

            function eachSortListByViewsHandler() {
                if (sortByViews.field) {
                    list.forEach(function (model) {
                        model.set(sortByViews.field, modelViewIndex(model));
                    });
                }
                else {
                    list.models = list.sortBy(modelViewIndex);
                }
            }

            function modelViewIndex(model) {
                return viewList[model.cid].$el.index();
            }
        }

        eachHelper.addHandlers = {
            append: function(ul, view) {
                ul.append(view.$el);
            },
            prepend: function(ul, view) {
                ul.prepend(view.$el);
            },
            fadeIn: function(ul, view) {
                view.$el.hide().appendTo(ul).fadeIn();
            },
            slideDown: function(ul, view) {
                view.$el.hide().appendTo(ul).slideDown();
            }
        };

        eachHelper.delHandlers = {
            remove: function(ul, view) {
                view.$el.remove();
            },
            fadeOut: function(ul, view) {
                view.$el.fadeOut(function() {
                    return view.$el.remove();
                });
            },
            slideUp: function(ul, view) {
                view.$el.slideUp(function() {
                    return view.$el.remove();
                });
            }
        };

        eachHelper.EachViewList = EachViewList;

        function EachViewList() {

        }

        extend(EachViewList.prototype, {
            filter: function (cb) {
                return _.filter(this, cb, this);
            },
            find: function (cb) {
                return _.find(this, cb, this);
            },
            where: function (attrs, first) {
                return this[first ? 'find' : 'filter'](function (view) {
                    for (var key in attrs) {
                        if (!view.has(key)) return false;

                        if (attrs[key] instanceof RegExp) {
                            if (!attrs[key].test(view.get(key))) return false;
                        }
                        else if (attrs[key] !== view.get(key)) return false;
                    }
                    return true;
                });
            },
            findWhere: function (attrs) {
                return this.where(attrs, true);
            }
        });

        function isClass(func) {
            return has(func, '__super__');
        }

        function getViewExtendedFieldList(viewClass, field, context) {
            var value = viewClass.prototype[field] || {};
            if (typeof value === 'function') {
                value = value.call(context);
            }
            var result = [value];
            return viewClass.__super__ ? result.concat(getViewExtendedFieldList(viewClass.__super__.constructor, field, context)) : result;
        }

        function mergeExtendedField(context, field) {
            var viewClass = context.constructor;
            return extend.apply(null, [true, {}].concat(getViewExtendedFieldList(viewClass, field, context).reverse()));
        }

        function extend() {
            return $.extend.apply($, arguments);
        }

        function has(obj, field) {
            return _.has(obj, field);
        }

        return DOMView;
    }

})();