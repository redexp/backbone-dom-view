;(function() {

    if (typeof define === 'function' && define.amd) {
        define('backbone-dom-view', ['backbone'], module);
    } else {
        module(Backbone);
    }

    function module (BB) {

        var View = BB.View,
            $ = BB.$;

        var dividedField = /^(.+)\|(.+)/,
            fieldEvent = /@([\w-]+)/,
            viewEvent = /#([\w\-:\.]+)/,
            argSelector = /\|arg\((\d+)\)/;

        var DOMView = BB.DOMView = View.extend({
            constructor: function(ops) {
                var view = this;

                View.apply(view, arguments);

                var ui = mergeExtendedField(view.constructor, 'ui');
                view.ui = {};

                for (var name in ui) {
                    if (!has(ui, name)) continue;

                    view.ui[name] = view.find(ui[name]);
                }

                if (typeof view.template !== 'object') return;

                var template = view.template = mergeExtendedField(view.constructor, 'template');

                for (var selector in template) {
                    if (!has(template, selector)) continue;

                    var helpersList = template[selector];

                    for (var helper in helpersList) {
                        if (!has(helpersList, helper)) continue;

                        helpers[helper].call(view, selector, helpersList[helper]);
                    }
                }

                view.trigger(DOMView.readyEvent);
            },

            find: function(selector) {
                return selector ? this.ui[selector] || this.$el.find(selector) : this.$el;
            },

            bind: function (events, func) {
                var view = this,
                    model = view.model;

                events = events.split(/\s+/);

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
                        target = model;
                        argNum = 1;
                        bindApplyFunc(target, model.get(field));
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
            }
        });

        DOMView.readyEvent = 'template-ready';

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

                node.on(event, function() {
                    view.model.set(field, node.prop(prop));
                });

                view.listenTo(view.model, 'change:' + field, function(model, value) {
                    if (value !== node.prop(prop)) {
                        node.prop(prop, value);
                    }
                });

                node.prop(prop, view.model.get(field));
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
                    bindEvents(options, ops.func);
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
            var view = ops.view,
                node = ops.node,
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

        function eachHelper (selector, options) {
            var view = this,
                holder = view.find(selector),
                viewEl = options.el ? holder.find(options.el).detach() : false,
                field = options.field,
                list = field ? view.model.get(field) : view.model;

            var viewList = options.viewList = {};
            var addHandler = options.addHandler || 'append';
            var delHandler = options.delHandler || 'remove';

            if (typeof addHandler === 'string') {
                addHandler = eachHelper.addHandlers[addHandler];
            }

            if (typeof delHandler === 'string') {
                delHandler = eachHelper.delHandlers[delHandler];
            }

            view.listenTo(list, options.addEvent || 'add', eachAddListener);
            view.listenTo(list, options.removeEvent || 'remove', eachRemoveListener);

            if (options.sort) {
                view.listenTo(list, options.sort.event || 'sort', eachSortHandler);
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
            }

            function eachRemoveListener (model) {
                var subView = viewList[model.cid];

                delHandler.call(view, holder, subView);

                viewList[model.cid] = null;

                if (subView.parent === view) {
                    subView.parent = null;
                }
            }

            function eachSortHandler() {
                if (options.sort.field) {
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
                a = a.get(options.sort.field);
                b = b.get(options.sort.field);

                return a < b ? -1 : a === b ? 0 : 1;
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

        function isClass(func) {
            return func.hasOwnProperty('__super__');
        }

        function getViewExtendedFieldList(viewClass, field) {
            var result = [viewClass.prototype[field] || {}];
            return viewClass.__super__ ? result.concat(getViewExtendedFieldList(viewClass.__super__.constructor, field)) : result;
        }

        function mergeExtendedField(viewClass, field) {
            return extend.apply(null, [true, {}].concat(getViewExtendedFieldList(viewClass, field)));
        }

        function extend() {
            return $.extend.apply($, arguments);
        }

        function has(obj, field) {
            return obj.hasOwnProperty(field);
        }

        var requestAnimationFrame = (function(){
            return  window.requestAnimationFrame   ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function requestAnimationFrame(callback){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        DOMView.requestAnimationFrame = function (func) {
            requestAnimationFrame(func);
        };

        return DOMView;
    }

})();