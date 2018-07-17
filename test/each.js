// Generated by CoffeeScript 1.8.0
(function() {
  define(['chai', 'backbone', 'backbone-dom-view'], function(_arg, Backbone, DomView) {
    var expect, model;
    expect = _arg.expect;
    model = null;
    beforeEach(function() {
      return model = new Backbone.Model();
    });
    return describe('each helper', function() {
      it('should create view for each item in collection', function() {
        var ListView, View, el, list, listView;
        View = DomView.extend({
          tagName: 'li',
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          tagName: 'ul',
          template: {
            '': {
              each: {
                view: View
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            name: 'Jack'
          }, {
            name: 'Bob'
          }
        ]);
        listView = new ListView({
          model: list
        });
        el = listView.$el;
        expect(el.find('li').length).to.equal(2);
        list.add({
          name: 'Max'
        });
        expect(el.find('li').length).to.equal(3);
        list.at(1).destroy();
        return expect(el).to.have.text('JackMax');
      });
      it('should run custom view function', function() {
        var DivView, LiView, ListView, el, list, listView;
        LiView = DomView.extend({
          tagName: 'li'
        });
        DivView = DomView.extend({
          tagName: 'div'
        });
        ListView = DomView.extend({
          tagName: 'ul',
          template: {
            '': {
              each: {
                view: function(model) {
                  if (model.get('type') === 'li') {
                    return LiView;
                  } else {
                    return DivView;
                  }
                }
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            type: 'li'
          }, {
            type: 'div'
          }
        ]);
        listView = new ListView({
          model: list
        });
        el = listView.$el;
        expect(el.find('li').length).to.be.equal(1);
        return expect(el.find('div').length).to.be.equal(1);
      });
      it('should run custom insertion/remove function', function() {
        var ListView, View, el, list, listView;
        View = DomView.extend({
          tagName: 'li',
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          tagName: 'ul',
          template: {
            '': {
              each: {
                view: View,
                addHandler: 'prepend',
                delHandler: function(ul, view) {
                  expect(this).to.be.instanceOf(ListView);
                  return expect(view).to.be.instanceOf(View);
                }
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            name: 'Jack'
          }, {
            name: 'Bob'
          }
        ]);
        listView = new ListView({
          model: list
        });
        el = listView.$el;
        expect(el).to.have.text('BobJack');
        list.at(0).destroy();
        return expect(el).to.have.text('BobJack');
      });
      it('should create view with el:', function() {
        var ListView, View, el, list, listView;
        View = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: $('<ul><li class="test"></li></ul>'),
          template: {
            '': {
              each: {
                view: View,
                el: '> *'
              }
            }
          }
        });
        list = new Backbone.Collection();
        listView = new ListView({
          model: list
        });
        el = listView.$el;
        expect(el.find('li').length).to.equal(0);
        list.set([
          {
            name: 'Jack'
          }, {
            name: 'Bob'
          }
        ]);
        expect(el.find('li').length).to.equal(2);
        return expect(el.find('li')).to.have["class"]('test');
      });
      it('should create view with el: as function', function() {
        var ListView, ViewDef, el, list, listView;
        ViewDef = DomView.extend({
          template: {
            'root': {
              html: '@type'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li class="test1"></li></ul>',
          template: {
            'root': {
              each: {
                view: ViewDef,
                el: function() {
                  return '> .test1';
                }
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            type: 1
          }, {
            type: 2
          }, {
            type: 3
          }, {
            type: 4
          }
        ]);
        listView = new ListView({
          model: list
        });
        el = listView.$el;
        return expect(el.find('li.test1').length).to.equal(4);
      });
      it('should have `parent` field', function() {
        var ListView, list, listView, views;
        views = [];
        ListView = DomView.extend({
          el: '<ul></ul>',
          template: {
            '': {
              each: {
                view: function(model) {
                  var view;
                  view = new Backbone.View({
                    model: model
                  });
                  if (model.get('parent')) {
                    view.parent = true;
                  }
                  views.push(view);
                  return view;
                }
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            parent: false
          }, {
            parent: true
          }
        ]);
        listView = new ListView({
          model: list
        });
        expect(views[0].parent).to.be.equal(listView);
        return expect(views[1].parent).to.be.equal(true);
      });
      it('should to be sorted by event', function() {
        var Item, ListView, li, list, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                view: Item,
                el: '> *',
                sort: true
              }
            }
          }
        });
        list = new Backbone.Collection();
        list.comparator = 'name';
        view = new ListView({
          model: list
        });
        list.set([
          {
            name: 1
          }, {
            name: 3
          }, {
            name: 2
          }
        ]);
        li = view.$el.children();
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        return expect(li.eq(2)).to.have.text('3');
      });
      it('should to be sorted by custom event and field', function() {
        var Item, ListView, li, list, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                view: Item,
                el: '> *',
                sort: {
                  event: 'test',
                  field: 'name'
                }
              }
            }
          }
        });
        list = new Backbone.Collection();
        view = new ListView({
          model: list
        });
        list.set([
          {
            name: 1
          }, {
            name: 3
          }, {
            name: 2
          }
        ]);
        li = view.$el.children();
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('3');
        expect(li.eq(2)).to.have.text('2');
        list.trigger('test');
        li = view.$el.children();
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        expect(li.eq(2)).to.have.text('3');
        expect(list.at(0).get('name')).to.equal(1);
        expect(list.at(1).get('name')).to.equal(3);
        return expect(list.at(2).get('name')).to.equal(2);
      });
      it('should sort list by views event on event', function() {
        var Item, ListView, li, list, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                view: Item,
                el: '> *',
                sortByViews: 'test'
              }
            }
          }
        });
        list = new Backbone.Collection();
        view = new ListView({
          model: list
        });
        list.set([
          {
            name: 1
          }, {
            name: 2
          }, {
            name: 3
          }
        ]);
        li = view.$el.children();
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        expect(li.eq(2)).to.have.text('3');
        li.eq(0).insertAfter(li.eq(2));
        view.trigger('test');
        expect(list.at(0).get('name')).to.equal(2);
        expect(list.at(1).get('name')).to.equal(3);
        return expect(list.at(2).get('name')).to.equal(1);
      });
      it('should sort list by views on event and set index to field', function() {
        var Item, ListView, li, list, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                view: Item,
                el: '> *',
                sortByViews: {
                  event: 'test',
                  field: 'order'
                }
              }
            }
          }
        });
        list = new Backbone.Collection();
        view = new ListView({
          model: list
        });
        list.set([
          {
            name: 1,
            order: 0
          }, {
            name: 2,
            order: 1
          }, {
            name: 3,
            order: 2
          }
        ]);
        li = view.$el.children();
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        expect(li.eq(2)).to.have.text('3');
        li.eq(0).insertAfter(li.eq(2));
        view.trigger('test');
        expect(list.at(0).get('name')).to.equal(1);
        expect(list.at(0).get('order')).to.equal(2);
        expect(list.at(1).get('name')).to.equal(2);
        expect(list.at(1).get('order')).to.equal(0);
        expect(list.at(2).get('name')).to.equal(3);
        return expect(list.at(2).get('order')).to.equal(1);
      });
      it('should iterate over plain array with collection class', function() {
        var Item, ListView, li, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                field: {
                  name: 'list',
                  wrapper: Backbone.Collection
                },
                view: Item,
                el: '> *'
              }
            }
          }
        });
        model = new Backbone.Model({
          list: [
            {
              name: 1
            }, {
              name: 2
            }
          ]
        });
        view = new ListView({
          model: model
        });
        li = view.$el.children();
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        model.set('list', [
          {
            name: 3
          }, {
            name: 4
          }, {
            name: 5
          }
        ]);
        li = view.$el.children();
        expect(li.length).to.equal(3);
        expect(li.eq(0)).to.have.text('3');
        expect(li.eq(1)).to.have.text('4');
        expect(li.eq(2)).to.have.text('5');
        model.set('list', [
          {
            name: 6
          }
        ]);
        li = view.$el.children();
        expect(li.length).to.equal(1);
        return expect(li.eq(0)).to.have.text('6');
      });
      it('should iterate over plain array with wrapper function', function() {
        var Item, ListView, li, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                field: {
                  name: 'list',
                  wrapper: function(list) {
                    expect(this).to.be.instanceOf(DomView);
                    return new Backbone.Collection(list);
                  }
                },
                view: Item,
                el: '> *'
              }
            }
          }
        });
        model = new Backbone.Model({
          list: [
            {
              name: 1
            }, {
              name: 2
            }
          ]
        });
        view = new ListView({
          model: model
        });
        li = view.$el.children();
        expect(li.length).to.equal(2);
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        model.set('list', [
          {
            name: 3
          }, {
            name: 4
          }, {
            name: 5
          }
        ]);
        li = view.$el.children();
        expect(li.length).to.equal(3);
        expect(li.eq(0)).to.have.text('3');
        expect(li.eq(1)).to.have.text('4');
        expect(li.eq(2)).to.have.text('5');
        model.set('list', [
          {
            name: 6
          }
        ]);
        li = view.$el.children();
        expect(li.length).to.equal(1);
        return expect(li.eq(0)).to.have.text('6');
      });
      it('should trigger added event', function() {
        var Item, ListView, XItem, XListView, num, view, x;
        num = 0;
        Item = DomView.extend({
          initialize: function() {
            expect(this.$el.parent().length).to.equal(0);
            return this.on('added', function() {
              num++;
              return expect(this.$el.parent().length).to.equal(1);
            });
          },
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                view: Item,
                el: '> *'
              }
            }
          }
        });
        model = new Backbone.Collection([
          {
            name: 1
          }, {
            name: 2
          }
        ]);
        view = new ListView({
          model: model
        });
        expect(num).to.equal(2);
        x = 0;
        XItem = Item.extend({
          initialize: function() {
            expect(this.$el.parent().length).to.equal(0);
            this.on('added', function() {
              return x++;
            });
            return this.on('tested', function() {
              x++;
              return expect(this.$el.parent().length).to.equal(1);
            });
          }
        });
        XListView = ListView.extend({
          template: {
            '': {
              each: {
                addedEvent: 'tested',
                view: XItem
              }
            }
          }
        });
        view = new XListView({
          model: model
        });
        return expect(x).to.equal(2);
      });
      it('should handle reset event', function() {
        var Item, ListView, li, list, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                view: Item,
                el: '> *'
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            name: 1
          }, {
            name: 2
          }, {
            name: 3
          }
        ]);
        view = new ListView({
          model: list
        });
        li = view.$el.children();
        expect(li.length).to.equal(3);
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        expect(li.eq(2)).to.have.text('3');
        list.reset([
          {
            name: 2
          }, {
            name: 3
          }
        ]);
        li = view.$el.children();
        expect(li.length).to.equal(2);
        expect(li.eq(0)).to.have.text('2');
        return expect(li.eq(1)).to.have.text('3');
      });
      it('should iterate over model field', function() {
        var Item, ListView, li, list, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            '': {
              each: {
                field: 'list',
                view: Item,
                el: '> *'
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            name: 1
          }, {
            name: 2
          }, {
            name: 3
          }
        ]);
        model = new Backbone.Model({
          list: list
        });
        view = new ListView({
          model: model
        });
        li = view.$el.children();
        expect(li.length).to.equal(3);
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        expect(li.eq(2)).to.have.text('3');
        model.get('list').add({
          name: 4
        });
        return expect(view.$el.children().eq(3)).to.have.text('4');
      });
      it('should iterate over view field', function() {
        var Item, ListView, li, view;
        Item = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          defaults: {
            list: null
          },
          initialize: function() {
            return this.set('list', new Backbone.Collection([
              {
                name: 1
              }, {
                name: 2
              }, {
                name: 3
              }
            ]));
          },
          template: {
            '': {
              each: {
                field: 'list',
                view: Item,
                el: '> *'
              }
            }
          }
        });
        model = new Backbone.Model();
        view = new ListView({
          model: model
        });
        li = view.$el.children();
        expect(li.length).to.equal(3);
        expect(li.eq(0)).to.have.text('1');
        expect(li.eq(1)).to.have.text('2');
        expect(li.eq(2)).to.have.text('3');
        view.get('list').add({
          name: 4
        });
        return expect(view.$el.children().eq(3)).to.have.text('4');
      });
      it('should have viewList as EachViewList', function() {
        var Item, ListView, list, view, viewList, views;
        Item = DomView.extend({
          defaults: {
            selected: false
          },
          initialize: function() {
            return this.set('selected', this.model.get('name') < 3);
          },
          template: {
            'root': {
              html: '@name',
              "class": {
                'selected': '@selected'
              }
            }
          }
        });
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            'root': {
              each: {
                view: Item,
                el: '> *'
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            id: 1,
            name: 1
          }, {
            id: 2,
            name: 2
          }, {
            id: 3,
            name: 3
          }
        ]);
        view = new ListView({
          model: list
        });
        viewList = view.getViewList('root');
        views = viewList.where({
          selected: true
        });
        expect(views.length).to.equal(2);
        expect(views[0].$el).to.have["class"]('selected');
        expect(views[1].$el).to.have["class"]('selected');
        expect(viewList[list.at(2).cid].$el).not.to.have["class"]('selected');
        views = viewList.where({
          selected: /^f/
        });
        expect(views.length).to.equal(1);
        expect(views[0]).to.equal(viewList[list.at(2).cid]);
        views = viewList.findWhere({
          selected: false
        });
        expect(views).to.equal(viewList[list.at(2).cid]);
        views = viewList.getByEl(view.$el.children().eq(1));
        expect(views).to.equal(viewList[list.at(1).cid]);
        views = viewList.getByEl(view.$el.children().get(2));
        expect(views).to.equal(viewList[list.at(2).cid]);
        expect(list.at(0)).to.equal(viewList.get(list.at(0)).model);
        expect(list.at(0)).to.equal(viewList.get(list.at(0).id).model);
        return expect(list.at(0)).to.equal(viewList.get(list.at(0).cid).model);
      });
      it('should handle "at" option', function() {
        var ListView, View, el, list, listView;
        View = DomView.extend({
          tagName: 'li',
          template: {
            '': {
              html: '@name'
            }
          }
        });
        ListView = DomView.extend({
          tagName: 'ul',
          template: {
            '': {
              each: {
                view: View,
                addHandler: 'appendAt'
              }
            }
          }
        });
        list = new Backbone.Collection([
          {
            name: 'Jack'
          }, {
            name: 'Bob'
          }
        ]);
        listView = new ListView({
          model: list
        });
        el = listView.$el;
        expect(el).to.have.text('JackBob');
        list.add({
          name: 'Max'
        }, {
          at: 1
        });
        return expect(el).to.have.text('JackMaxBob');
      });
      it('should create view own prop with viewList', function() {
        var ListView, view;
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          template: {
            'root': {
              each: {
                view: DomView,
                viewProp: 'list'
              }
            }
          }
        });
        view = new ListView({
          model: new Backbone.Collection([{}, {}])
        });
        return expect(view.list).to.equal(view.getViewList('root'));
      });
      it('should trigger change:field', function() {
        var ListView, num, view;
        ListView = DomView.extend({
          el: '<ul><li></li></ul>',
          defaults: function() {
            return {
              list: new Backbone.Collection()
            };
          },
          template: {
            'root': {
              each: {
                field: 'list',
                view: DomView,
                el: '> *'
              }
            }
          }
        });
        view = new ListView();
        num = 0;
        view.bind('@list', function() {
          return num++;
        });
        expect(num).to.equal(1);
        view.get('list').add({
          id: 1
        });
        expect(num).to.equal(2);
        view.get('list').remove(1);
        expect(num).to.equal(3);
        view.get('list').reset([{}, {}, {}]);
        return expect(num).to.equal(4);
      });
      it('should accept el as jQuery object', function() {
        var ListView, view;
        ListView = DomView.extend({
          el: '<div></div>',
          defaults: function() {
            return {
              list: new Backbone.Collection()
            };
          },
          template: {
            'root': {
              each: {
                field: 'list',
                view: DomView,
                el: function(ul) {
                  expect(this).to.be.an["instanceof"](ListView);
                  expect(ul).to.be.an["instanceof"](jQuery);
                  return jQuery('<span>');
                }
              }
            }
          }
        });
        view = new ListView();
        view.get('list').add([{}, {}]);
        return expect(view.$el.find('> span').length).to.equal(2);
      });
      it('should accept el as object of types', function() {
        var ListView, items, view;
        ListView = DomView.extend({
          el: '<div><span class="type-test1"></span><span data-type="test2"></span><span data-type="test3"></span></div>',
          defaults: function() {
            return {
              list: new Backbone.Collection()
            };
          },
          template: {
            'root': {
              each: {
                field: 'list',
                view: DomView,
                el: {
                  'data-type': 'type',
                  'class': function(model) {
                    return 'type-' + model.get('type');
                  }
                }
              }
            }
          }
        });
        view = new ListView();
        view.get('list').add([
          {
            type: 'test2'
          }, {
            type: 'test3'
          }, {
            type: 'test1'
          }
        ]);
        items = view.$el.children();
        expect(items.length).to.equal(3);
        expect(items.eq(0)).to.have.attr('data-type', 'test2');
        expect(items.eq(1)).to.have.attr('data-type', 'test3');
        return expect(items.eq(2)).to.have["class"]('type-test1');
      });
      return it('should remove class from clone', function() {
        var ListView, view;
        ListView = DomView.extend({
          el: '<ul><li class="hidden test"></li></ul>',
          defaults: function() {
            return {
              list: new Backbone.Collection([{}, {}])
            };
          },
          template: {
            'root': {
              each: {
                field: 'list',
                view: DomView,
                el: '> *',
                removeClass: 'hidden'
              }
            }
          }
        });
        view = new ListView();
        expect(view.$el.children().length).to.equal(2);
        expect(view.$el.find('.hidden').length).to.equal(0);
        return expect(view.$el.find('.test').length).to.equal(2);
      });
    });
  });

}).call(this);
