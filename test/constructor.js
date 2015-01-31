// Generated by CoffeeScript 1.8.0
(function() {
  define(['chai', 'backbone', 'backbone-dom-view'], function(_arg, Backbone, DomView) {
    var expect, model;
    expect = _arg.expect;
    model = null;
    beforeEach(function() {
      return model = new Backbone.Model();
    });
    return describe('constructor', function() {
      it('should extend parent template:', function() {
        var View, XView, YView, ZView, el1, el2, el3, view, xView, yView, zView;
        View = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        XView = View.extend({
          template: {
            '': {
              prop: {
                "test": '@name'
              }
            }
          }
        });
        YView = XView.extend({
          template: {
            '': {
              attr: {
                "test": '@name'
              }
            }
          }
        });
        view = new View({
          model: model
        });
        el1 = view.$el;
        xView = new XView({
          model: model
        });
        el2 = xView.$el;
        yView = new YView({
          model: model
        });
        el3 = yView.$el;
        model.set('name', 'Jack');
        expect(el1).to.have.text('Jack');
        expect(el2).to.have.text('Jack');
        expect(el3).to.have.text('Jack');
        expect(el1).not.to.have.prop('test');
        expect(el2).to.have.prop('test', 'Jack');
        expect(el3).to.have.prop('test', 'Jack');
        expect(el1).not.to.have.attr('test');
        expect(el2).not.to.have.attr('test');
        expect(el3).to.have.attr('test', 'Jack');
        ZView = YView.extend({
          template: {
            '': {
              attr: {
                "test": '@age'
              }
            }
          }
        });
        zView = new ZView({
          model: model
        });
        model.set('age', 20);
        return expect(zView.$el).to.have.attr('test', '20');
      });
      return it('should extend parent ui:', function() {
        var View, XView, YView, el1, el2, el3, view, xView, yView;
        View = DomView.extend({
          el: '<li><span></span><a href="#"></a></li>',
          ui: {
            root: ''
          },
          template: {
            root: {
              prop: {
                'test': '@name'
              }
            }
          }
        });
        XView = View.extend({
          ui: {
            deleteButton: 'a'
          },
          template: {
            deleteButton: {
              html: '@name'
            }
          }
        });
        YView = XView.extend({
          ui: {
            name: 'span'
          },
          template: {
            name: {
              html: '@name'
            }
          }
        });
        view = new View({
          model: model
        });
        el1 = view.$el;
        xView = new XView({
          model: model
        });
        el2 = xView.$el;
        yView = new YView({
          model: model
        });
        el3 = yView.$el;
        model.set('name', 'Jack');
        expect(el1).to.have.prop('test', 'Jack');
        expect(view.ui.root).to.have.prop('test', 'Jack');
        expect(el2).to.have.prop('test', 'Jack');
        expect(xView.ui.root).to.have.prop('test', 'Jack');
        expect(el3).to.have.prop('test', 'Jack');
        expect(yView.ui.root).to.have.prop('test', 'Jack');
        expect(el1.find('a')).not.to.have.text('Jack');
        expect(view.ui.deleteButton).to.be.undefined;
        expect(el2.find('a')).to.have.text('Jack');
        expect(xView.ui.deleteButton).to.have.text('Jack');
        expect(el3.find('a')).to.have.text('Jack');
        expect(yView.ui.deleteButton).to.have.text('Jack');
        expect(el1.find('span')).not.to.have.text('Jack');
        expect(view.ui.name).to.be.undefined;
        expect(el2.find('span')).not.to.have.text('Jack');
        expect(xView.ui.name).to.be.undefined;
        expect(el3.find('span')).to.have.text('Jack');
        return expect(yView.ui.name).to.have.text('Jack');
      });
    });
  });

}).call(this);