;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['backbone', 'underscore'], factory);
	} else {
		Backbone.DOMView = factory(Backbone, _);
	}
}(function (BB, _) {

	"use strict";

	var _DEV_ = true; // false in min file

	DOMView.v = '1.58.2';

	var View = BB.View,
		$ = BB.$;

	function DOMView(ops) {
		ops = ops || {};

		if (has(ops, 'parent')) {
			this.parent = ops.parent;
		}

		this.attributes = {};
		this.callbacks = {};

		for (var name in ops) {
			if (!has(ops, name)) continue;

			if (typeof ops[name] === 'function') {
				this.callbacks[name] = ops[name];
			}
		}

		if (this.defaults) {
			this.set(mergeExtendedField(this, 'defaults'));
		}

		View.apply(this, arguments);

		helpers.template.call(this, '', this.template);

		this.trigger(DOMView.readyEvent);
	}

	BB.DOMView = View.extend({
		constructor: DOMView,

		ui: {
			root: ''
		},

		selectorsSorter: _.keys,

		setElement: function () {
			View.prototype.setElement.apply(this, arguments);

			var ui = this.ui = mergeExtendedField(this, 'ui');

			for (var name in ui) {
				if (!has(ui, name) || typeof ui[name] !== 'string') continue;

				ensureUI(this, name);
			}

			this.template = mergeExtendedField(this, 'template', true);

			this.trigger(DOMView.elementEvent);

			return this;
		},

		find: function (selector) {
			if (!selector) return this.$el;

			if (this.ui[selector]) {
				return ensureUI(this, selector);
			}

			if (selector.indexOf('{') > -1) {
				var view = this,
					rootSelectorLength = this.$el.selector && this.$el.selector.length;

				selector = selector.replace(uiSelectors, function (x, name) {
					var selector = ensureUI(view, name).selector || '';

					return rootSelectorLength ? selector.slice(rootSelectorLength) : selector;
				});
			}

			var node = this.$el.find(selector);

			// bring back deprecated .selector
			if (!node.selector) {
				node.selector = selector;
			}

			return node;
		},

		bind: function (events, callback) {
			var view = this,
				model = view.model;

			if (arguments.length === 1 && typeof events === 'object') {
				var ops = events;
				events = ops.events;
				callback = ops.callback;

				if (has(ops, 'model')) {
					model = ops.model;
				}
			}

			events = events.trim().split(/\s+/);

			for (var i = 0, len = events.length; i < len; i++) {
				parseEvent(events[i]);
			}

			function parseEvent(event) {
				var target = model,
					argNum = null,
					argNot = event.charAt(0) === '!';

				if (argNot) {
					event = event.slice(1);
				}

				if (event.charAt(0) === '=') {
					event = event.slice(1);
					target = has(view.attributes, event) ? view : model;
					bindApplyCallback(target.get(event));
					return;
				}

				if (event.charAt(0) === '@') {
					event = event.slice(1);
					target = has(view.attributes, event) ? view : model;
					argNum = 1;
					bindApplyCallback(target, target.get(event));
					event = 'change:' + event;
				}

				if (event.charAt(0) === '#') {
					event = event.slice(1);
					target = view;
				}

				if (!event) {
					console.warn('Empty event name');
				}

				if (target === model) {
					view.listenTo(model, event, bindApplyCallback);
				}
				else {
					view.on(event, bindApplyCallback);
				}

				function bindApplyCallback() {
					var args = argNum === null ? arguments : [arguments[argNum]];

					if (argNot) {
						args[0] = !args[0];
					}

					return callback.apply(view, args);
				}
			}

			return this;
		},

		bindTo: function (model, events, callback) {
			return this.bind({
				model: model,
				events: events,
				callback: callback
			});
		},

		matches: function (attrs) {
			for (var key in attrs) {
				if (!has(attrs, key)) continue;

				if (attrs[key] === this.get(key)) continue;

				if (attrs[key] instanceof RegExp) {
					if (!attrs[key].test(this.get(key))) return false;
				}
				else {
					return false;
				}
			}
			return true;
		},

		get: BB.Model.prototype.get,
		set: BB.Model.prototype.set,
		has: BB.Model.prototype.has,
		_validate: BB.Model.prototype._validate,

		getViewList: function (selector) {
			return this.template[selector].each.viewList;
		},

		listenElement: listenElement('on'),

		listenElementOnce: listenElement('one'),

		stopListeningElement: function (node, events) {
			if (!this._listenElement) return this;

			var ns = '.listenBy' + this.cid;

			if (node) {
				node = node instanceof $ ? node : $(node);
			}

			if (events) {
				events = events
					.split(/\s+/)
					.map(function (event) {
						return event + ns;
					})
					.join(' ')
				;
			}

			var i, len;

			switch (arguments.length) {
			case 0:
				for (i = 0, len = this._listenElement.length; i < len; i++) {
					$(this._listenElement[i]).off(ns);
				}
				this._listenElement = null;
				break;

			case 1:
				node.off(ns);
				break;

			case 2:
				node.off(events);
				break;

			default:
				var view = this;

				var args = _.rest(arguments).map(function (arg) {
					if (typeof arg === 'function' && arg['_bindWith' + view.cid]) {
						return arg['_bindWith' + view.cid];
					}
					else {
						return arg;
					}
				});

				args[0] = events;

				node.off.apply(node, args);
				break;
			}

			return this;
		}
	});

	function ensureUI(view, name) {
		var selector = view.ui[name];

		if (typeof selector === 'string') {
			view.ui[name] = view.find(selector);
		}

		return view.ui[name];
	}

	function listenElement(method) {
		return function (node, events) {
			if (_DEV_) {
				if (node instanceof $ === false && node instanceof window.HTMLElement === false) {
					throw new Error("node should be instance of jQuery or HTMLElement");
				}
			}

			if (!this._listenElement) this._listenElement = [];

			var ns = '.listenBy' + this.cid;

			if (this._listenElement.indexOf(node) === -1) {
				this._listenElement.push(node);
			}

			node = node instanceof $ ? node : $(node);

			if (events) {
				events = events
					.split(/\s+/)
					.map(function (event) {
						return event + ns;
					})
					.join(' ')
				;
			}

			var view = this;

			var args = _.rest(arguments).map(function (arg) {
				if (typeof arg === 'function') {
					var key = '_bindWith' + view.cid;

					if (!arg[key]) {
						arg[key] = _.bind(arg, view);
					}

					return arg[key];
				}
				else {
					return arg;
				}
			});

			args[0] = events;

			node[method].apply(node, args);

			return this;
		}
	}

	DOMView.readyEvent = 'template-ready';
	DOMView.elementEvent = 'element-ready';

	var helpers = DOMView.helpers = {
		template: templateHelper,
		'class': classHelper,
		toggleClass: classHelper,
		attr: attrHelper,
		prop: propHelper,
		style: styleHelper,
		html: htmlHelper,
		safeHtml: safeHtmlHelper,
		text: textHelper,
		on: onHelper('listenElement'),
		once: onHelper('listenElementOnce'),
		click: clickHelper,
		connect: connectHelper,
		visible: visibleHelper,
		hidden: hiddenHelper,
		each: eachHelper
	};

	var uiSelectors = /\{([^}]+)}/g;

	function templateHelper(rootSelector, template) {
		var selectors = this.selectorsSorter(template),
			selector;

		if (rootSelector && has(this.ui, rootSelector)) {
			rootSelector = '{' + rootSelector + '}';
		}

		for (var i = 0, len = selectors.length; i < len; i++) {
			selector = selectors[i];

			var helpersList = template[selector];

			if (rootSelector) {
				if (selector.charAt(0) === '&') {
					selector = selector.slice(1);
				}
				else {
					selector = ' ' + selector;
				}
			}

			for (var helper in helpersList) {
				if (!has(helpersList, helper)) continue;

				if (helper.charAt(0) === '&') {
					var ops = {};
					ops[helper] = helpersList[helper];
					templateHelper.call(this, rootSelector + selector, ops);
					continue;
				}

				if (_DEV_) {
					if (!has(helpers, helper)) {
						throw new Error('Unknown helper "' + helper + '" in template of ' + this.constructor.name);
					}
				}

				helpers[helper].call(this, rootSelector + selector, helpersList[helper]);
			}
		}
	}

	function classHelper(selector, options) {
		callJquerySetterMethod({
			view: this,
			node: this.find(selector),
			method: 'toggleClass',
			options: options,
			wrapper: function (v) {
				if (_.isFunction(v)) {
					return function () {
						return !!v.apply(this, arguments);
					};
				}

				return !!v;
			}
		});
	}

	function attrHelper(selector, options) {
		callJquerySetterMethod({
			view: this,
			node: this.find(selector),
			method: 'attr',
			options: options
		});
	}

	function propHelper(selector, options) {
		callJquerySetterMethod({
			view: this,
			node: this.find(selector),
			method: 'prop',
			options: options
		});
	}

	function styleHelper(selector, options) {
		callJquerySetterMethod({
			view: this,
			node: this.find(selector),
			method: 'css',
			options: options
		});
	}

	function htmlHelper(selector, options) {
		callJqueryMethod({
			view: this,
			node: this.find(selector),
			method: 'html',
			options: options
		});
	}

	function safeHtmlHelper(selector, options) {
		var dangerTagStart = /<(?:script|style|link|meta|iframe|frame)\b/ig,
			dangerTagEnd = /<\/(?:script|style|link|meta|iframe|frame)\b/ig,
			isWord = /\w/;

		callJqueryMethod({
			view: this,
			node: this.find(selector),
			method: 'html',
			options: options,
			wrapper: function (html) {
				html = html
					.replace(dangerTagStart, '<div style="display: none;"')
					.replace(dangerTagEnd, '</div');

				/**
				 * 0 - text
				 * 1 - tag
				 * 2 - attribute name start
				 * 3 - attribute name
				 * 4 - attribute value start
				 * 5 - attribute value
				 */
				var context = 0;
				var attr;
				var char;

				for (var i = 0, len = html.length; i < len; i++) {
					char = html[i];
					if (context === 0 && char === '<' && isWord.test(html[i + 1])) {
						context = 1;
					}
					else if (char === '>' && (context !== 5 || attr === ' ')) {
						context = 0;
					}
					else if (char === ' ' && context === 1) {
						context = 2;
					}
					else if (char !== ' ' && context === 2) {
						context = 3;
						if (char === 'o' && html[i + 1] === 'n') {
							html = html.slice(0, i) + 'x-' + html.slice(i + 2);
						}
					}
					else if (char === '=' && context === 3) {
						context = 4;
					}
					else if ((char === '"' || char === "'") && context === 4) {
						attr = char;
						context = 5;
					}
					else if (char !== ' ' && context === 4) {
						attr = ' ';
						context = 5;
					}
					else if (char === attr && context === 5) {
						attr = false;
						context = 2;
					}
				}

				return html;
			}
		});
	}

	function textHelper(selector, options) {
		callJqueryMethod({
			view: this,
			node: this.find(selector),
			method: 'text',
			options: options,
			wrapper: function (value) {
				return _.isNull(value) || _.isUndefined(value) ? '' : value;
			}
		});
	}

	function onHelper(listenMethod) {
	    return function (selector, options) {
			var view = this,
				node = this.find(selector),
				ops;

			for (var event in options) {
				if (!has(options, event)) continue;

				ops = options[event];

				switch (typeof ops) {
					case 'function':
						this[listenMethod](node, event, ops);
						break;

					case 'object':
						for (var target in ops) {
							if (!has(ops, target)) continue;

							this[listenMethod](node, event, target, ops[target]);
						}
						break;

					case 'string':
						(function (method) {
							var prevent = method.charAt(0) === '!';

							if (prevent) {
								method = method.slice(1);
							}

							if (_DEV_) {
								if (method && typeof view[method] !== 'function') {
									console.warn('View "%s" do not have method "%s"', view.constructor.name, method);
								}
							}

							view[listenMethod](node, event, function (e) {
								if (prevent) {
									e.preventDefault();
								}
								if (method) {
									this[method]();
								}
							});
						})(ops);
						break;
				}
			}
		};
	}

	function clickHelper(selector, options) {
		helpers['on'].call(this, selector, {click: options});
	}

	function connectHelper(selector, options) {
		var view = this,
			node = view.find(selector);

		for (var prop in options) {
			if (!has(options, prop)) continue;

			connectHelperBind(prop, options[prop]);
		}

		function connectHelperBind(prop, field) {
			var event = 'change',
				propEvent = prop.split('|');

			if (propEvent.length === 2) {
				prop = propEvent[0];
				event = propEvent[1];
			}

			var target = view.has(field) ? view : view.model;

			view.listenElement(node, event, function () {
				target.set(field, node.prop(prop));
			});

			view.listenTo(target, 'change:' + field, function (model, value) {
				if (value !== node.prop(prop)) {
					node.prop(prop, value);
				}
			});

			node.prop(prop, target.get(field));
		}
	}

	function visibleHelper(selector, options) {
		callJquerySetterMethod({
			view: this,
			node: this.find(selector),
			method: 'css',
			options: {'display': options},
			wrapper: function (v) {
				return v ? '' : 'none';
			}
		});
	}

	function hiddenHelper(selector, options) {
		callJquerySetterMethod({
			view: this,
			node: this.find(selector),
			method: 'css',
			options: {'display': options},
			wrapper: function (v) {
				return v ? 'none': '';
			}
		});
	}

	function callJqueryMethod(ops) {
		var view = ops.view,
			model = view.model,
			options = ops.options;

		ops = _.extend({
			model: model
		}, ops);

		switch (typeof options) {
		case 'string':
			bindEvents(options);
			break;

		case 'object':
			if (options === null) break;

			for (var events in options) {
				if (!has(options, events) || options[events] === null) continue;

				bindEvents(events, options[events]);
			}
			break;

		case 'function':
			ops.value = options.apply(view, arguments);
			applyJqueryMethod(ops);
			break;

		default:
			throw new Error('Unknown options type');
		}

		function bindEvents(events, func) {
			view.bind(events, function () {
				ops.value = func ? func.apply(view, arguments) : arguments[0];
				applyJqueryMethod(ops);
			});
		}
	}

	function applyJqueryMethod(ops) {
		var view = ops.view,
			node = ops.node,
			method = ops.method,
			fieldName = ops.fieldName,
			value = ops.value,
			wrapper = ops.wrapper;

		if (_DEV_) {
			if (node.length === 0) {
				console.warn('Empty node. Be sure that you set correct selector to template of ' + ops.view.constructor.name);
			}
		}

		if (_.isFunction(value)) {
			node.each(function (i, item) {
				var val = value.call(view, i, item);

				if (wrapper) {
					val = wrapper(val);
				}

				if (fieldName) {
					$(item)[method](fieldName, val);
				}
				else {
					$(item)[method](val);
				}
			});
		}
		else {
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
	}

	function callJquerySetterMethod(ops) {
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
	 * @property {String} viewProp
	 */

	/**
	 * @param {string} selector
	 * @param {EachHelperOptions} options
	 */
	function eachHelper(selector, options) {
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

		options.eachAddListener = eachAddListener;
		options.eachResetListener = eachResetListener;
		options.eachRemoveListener = eachRemoveListener;

		var view = this,
			holder = view.find(selector),
			list = view.model,
			viewEl,
			viewElMap,
			fieldName,
			fieldClass;

		if (typeof options.el === 'function') {
			options.el = options.el.call(view);
		}

		switch (typeof options.el) {
		case 'string':
			viewEl = holder.find(options.el).detach();
			break;

		case 'object':
			if (options.el instanceof $) {
				viewEl = options.el.detach();
			}
			else {
				viewElMap = _.map(options.el, function (field, attr) {
					var nodes = {};

					holder.find('> [' + attr + ']').detach().each(function (i, node) {
						nodes[node.getAttribute(attr)] = $(node);
					});

					return {
						field: field,
						nodes: nodes
					};
				});
			}

			break;
		}

		if (options.field) {
			var field = options.field;

			fieldName = field;

			if (typeof field === 'object') {
				fieldName = field.name;
				fieldClass = field.wrapper;
			}

			list = view.get(fieldName) || view.model.get(fieldName);
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

		var sort = options.sort;
		if (sort) {
			view.listenTo(list, sort.event || 'sort', eachSortHandler);
		}

		var sortByViews = options.sortByViews;
		if (sortByViews) {
			var sortEvent = typeof sortByViews === 'string' ? sortByViews : sortByViews.event;
			view.on(sortEvent, eachSortListByViewsHandler);
		}

		if (!fieldClass) {
			if (_DEV_) {
				if (!list) {
					throw new Error('Collection is not specified');
				}

				if (list instanceof BB.Collection === false) {
					throw new Error('Object is not instance of Backbone Collection');
				}
			}

			view.listenTo(list, options.addEvent, eachAddListener)
				.listenTo(list, options.resetEvent, eachResetListener)
				.listenTo(list, options.removeEvent, eachRemoveListener);

			if (options.field) {
				view.listenTo(list, [options.addEvent, options.removeEvent, options.resetEvent].join(' '), eachTriggerChangeEvent);
			}

			list.each(eachAddListener);
		}
		else { // means plain array
			if (isClass(fieldClass)) {
				list = new fieldClass();
				view.bind('@' + fieldName, function (data) {
					list.each(eachRemoveListener);
					list.reset(data);
					list.each(eachAddListener);
				});
			}
			else {
				list = null;
				view.bind('@' + fieldName, function (data) {
					if (list) {
						list.each(eachRemoveListener);
						list.reset([]);
					}

					list = fieldClass.call(view, data);
					list.each(eachAddListener);
				});
			}
		}

		if (options.viewProp) {
			if (_DEV_) {
				if (this[options.viewProp]) {
					console.warn('view already has property "' + options.viewProp + '"');
				}
			}

			this[options.viewProp] = viewList;
		}

		function eachAddListener(model, collection, ops) {
			var View = isClass(options.view) ? options.view : options.view.call(view, model),
				childView = View;

			if (isClass(View)) {
				var viewOps = {
					model: model,
					parent: view
				};

				var el;

				if (viewElMap) {
					_.find(viewElMap, function (item) {
						var field = _.isFunction(item.field) ? item.field(model) : model.get(item.field);

						el = item.nodes[field];

						return !!el;
					});
				}

				if (!el) {
					el = viewEl;
				}

				if (el) {
					viewOps.el = el.clone();
				}

				childView = new View(viewOps);
			}

			childView.parent = childView.parent || view;
			viewList[model.cid] = childView;
			addHandler.call(view, holder, childView, ops);
			childView.trigger(options.addedEvent);
		}

		function eachResetListener(model, ops) {
			ops.previousModels.forEach(eachRemoveListener);
			list.each(eachAddListener);
		}

		function eachRemoveListener(model) {
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
					.stopListeningElement()
				;
			}

			delete viewList[model.cid];
		}

		function eachTriggerChangeEvent() {
			view.trigger('change:' + options.field, view, list);
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
		append: function (ul, view) {
			ul.append(view.$el);
		},
		appendAt: function (ul, view, ops) {
			if (has(ops, 'at')) {
				if (ops.at === 0) {
					ul.prepend(view.$el);
				}
				else {
					view.$el.insertAfter(ul.children().get(ops.at - 1));
				}
			}
			else {
				ul.append(view.$el);
			}
		},
		prepend: function (ul, view) {
			ul.prepend(view.$el);
		},
		fadeIn: function (ul, view) {
			view.$el.hide().appendTo(ul).fadeIn();
		},
		slideDown: function (ul, view) {
			view.$el.hide().appendTo(ul).slideDown();
		}
	};

	eachHelper.delHandlers = {
		remove: function (ul, view) {
			view.$el.remove();
		},
		fadeOut: function (ul, view) {
			view.$el.fadeOut(function () {
				return view.$el.remove();
			});
		},
		slideUp: function (ul, view) {
			view.$el.slideUp(function () {
				return view.$el.remove();
			});
		}
	};

	eachHelper.EachViewList = EachViewList;

	function EachViewList() {}

	_.extend(EachViewList.prototype, {
		where: function (attrs, first) {
			return this[first ? 'find' : 'filter'](function (view) {
				return view.matches(attrs);
			});
		},
		findWhere: function (attrs) {
			return this.where(attrs, true);
		},
		count: function (attrs) {
			var count = 0;

			this.forEach(function (view) {
				if (view.matches(attrs)) {
					count++;
				}
			});

			return count;
		},
		getModels: function () {
			return this.map(function (view) {
				return view.model;
			});
		},
		getByEl: function (el) {
			if (el instanceof $) {
				el = el.get(0);
			}

			return this.find(function (view) {
				return view.el === el;
			});
		},
		get: function (id) {
			return this[id] || this[id.cid] || this.find(function (item) {
					return item.cid === id || item.model === id || item.model.id === id || item.model.id === id.id;
				});
		}
	});

	_.forEach(
		['forEach', 'map', 'reduce',
			'reduceRight', 'find', 'filter',
			'reject', 'every', 'some',
			'max', 'min'],
		function (name) {
			EachViewList.prototype[name] = function (cb) {
				return _[name](this, cb, this);
			};
		}
	);

	_.forEach(
		['contains', 'invoke',
			'toArray', 'size',
			'without', 'difference',
			'isEmpty', 'chain'],
		function (name) {
			EachViewList.prototype[name] = function () {
				var args = _.toArray(arguments);
				args.unshift(this);
				return _[name].apply(_, args);
			};
		}
	);

	function isClass(func) {
		return has(func, 'prototype') && _.isFunction(func.prototype.initialize);
	}

	function getViewExtendedFieldList(viewClass, field, context) {
		var value = viewClass.prototype[field] || {};

		if (_.isFunction(value)) {
			value = value.call(context, cloneDeep);
		}

		var result = [value];

		return viewClass.__super__ ? result.concat(getViewExtendedFieldList(viewClass.__super__.constructor, field, context)) : result;
	}

	function mergeExtendedField(context, field, deep) {
		var viewClass = context.constructor;

		return (deep ? cloneDeep : clone).apply(null, getViewExtendedFieldList(viewClass, field, context).reverse());
	}

	function clone() {
		var target = {};

		for (var i = 0, len = arguments.length; i < len; i++) {
			$.extend(target, arguments[i]);
		}

		return target;
	}

	function cloneDeep() {
		var target = {};

		for (var i = 0, len = arguments.length; i < len; i++) {
			$.extend(true, target, arguments[i]);
		}

		return target;
	}

	var has = _.has;

	return DOMView;
}));