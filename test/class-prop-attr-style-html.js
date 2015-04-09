// Generated by CoffeeScript 1.8.0
(function() {
  define(['chai', 'backbone', 'backbone-dom-view'], function(_arg, Backbone, DomView) {
    var expect, model;
    expect = _arg.expect;
    model = null;
    beforeEach(function() {
      return model = new Backbone.Model();
    });
    return describe('class, prop, attr, style, html helpers', function() {
      it('should toggle class for model events', function() {
        var View, el, view;
        View = DomView.extend({
          template: {
            '': {
              "class": {
                'cTest': 'test eventName'
              },
              prop: {
                'pTest': 'test eventName'
              },
              attr: {
                'aTest': 'test eventName'
              },
              style: {
                'opacity': 'test eventName'
              },
              html: 'test eventName'
            }
          }
        });
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).not.to.have["class"]('aTest');
        expect(el).not.to.have.prop('pTest');
        expect(el).not.to.have.attr('aTest');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.be.empty;
        model.trigger('test', 1);
        expect(el).to.have["class"]('cTest');
        expect(el).to.have.prop('pTest', 1);
        expect(el).to.have.attr('aTest', '1');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.have.html('1');
        model.trigger('eventName', 0);
        expect(el).not.to.have["class"]('aTest');
        expect(el).to.have.prop('pTest', 0);
        expect(el).to.have.attr('aTest', '0');
        expect(el).to.have.css('opacity', '0');
        return expect(el).to.have.html('0');
      });
      it('should toggle class for model events with changed arg number |arg(1)', function() {
        var View, el, view;
        View = DomView.extend({
          template: {
            '': {
              "class": {
                'cTest': 'test|arg(1) eventName|arg(2)'
              },
              prop: {
                'pTest': 'test|arg(1) eventName|arg(2)'
              },
              attr: {
                'aTest': 'test|arg(1) eventName|arg(2)'
              },
              style: {
                'opacity': 'test|arg(1) eventName|arg(2)'
              },
              html: 'test|arg(1) eventName|arg(2)'
            }
          }
        });
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).not.to.have["class"]('aTest');
        expect(el).not.to.have.prop('pTest');
        expect(el).not.to.have.attr('aTest');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.be.empty;
        model.trigger('test', false, 1);
        expect(el).to.have["class"]('cTest');
        expect(el).to.have.prop('pTest', 1);
        expect(el).to.have.attr('aTest', '1');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.have.html('1');
        model.trigger('eventName', true, true, 0);
        expect(el).not.to.have["class"]('aTest');
        expect(el).to.have.prop('pTest', 0);
        expect(el).to.have.attr('aTest', '0');
        expect(el).to.have.css('opacity', '0');
        return expect(el).to.have.html('0');
      });
      it('should toggle class for model field @fieldName', function() {
        var View, el, view;
        View = DomView.extend({
          template: {
            '': {
              "class": {
                'cTest': '@test'
              },
              prop: {
                'pTest': '@test'
              },
              attr: {
                'aTest': '@test'
              },
              style: {
                'opacity': '@test'
              },
              html: '@test'
            }
          }
        });
        model.set('test', true);
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).to.have["class"]('cTest');
        expect(el).to.have.prop('pTest');
        expect(el).to.have.attr('aTest');
        expect(el).to.have.css('opacity');
        expect(el).to.have.html('true');
        model.set('test', 0);
        expect(el).not.to.have["class"]('aTest');
        expect(el).to.have.prop('pTest', 0);
        expect(el).to.have.attr('aTest', '0');
        expect(el).to.have.css('opacity', '0');
        expect(el).to.have.html('0');
        model.set('test', 1);
        expect(el).to.have["class"]('cTest');
        expect(el).to.have.prop('pTest', 1);
        expect(el).to.have.attr('aTest', '1');
        expect(el).to.have.css('opacity', '1');
        return expect(el).to.have.html('1');
      });
      it('should toggle class for view event #viewEvent', function() {
        var View, el, view;
        View = DomView.extend({
          template: {
            '': {
              "class": {
                'cTest': '#test #eventName|arg(1)'
              },
              prop: {
                'pTest': '#test #eventName|arg(1)'
              },
              attr: {
                'aTest': '#test #eventName|arg(1)'
              },
              style: {
                'opacity': '#test #eventName|arg(1)'
              },
              html: '#test #eventName|arg(1)'
            }
          }
        });
        view = new View;
        el = view.$el;
        expect(el).not.to.have["class"]('aTest');
        expect(el).not.to.have.prop('pTest');
        expect(el).not.to.have.attr('aTest');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.be.empty;
        view.trigger('test', 1);
        expect(el).to.have["class"]('cTest');
        expect(el).to.have.prop('pTest', 1);
        expect(el).to.have.attr('aTest', '1');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.have.html('1');
        view.trigger('eventName', true, 0);
        expect(el).not.to.have["class"]('aTest');
        expect(el).to.have.prop('pTest', 0);
        expect(el).to.have.attr('aTest', '0');
        expect(el).to.have.css('opacity', '0');
        return expect(el).to.have.html('0');
      });
      it('should toggle class for function', function() {
        var View, el, view;
        View = DomView.extend({
          template: {
            '': {
              "class": {
                'cTest': {
                  'test': function() {
                    return this.model.get('field');
                  }
                }
              },
              prop: {
                'pTest': {
                  'test': function() {
                    return this.model.get('field');
                  }
                }
              },
              attr: {
                'aTest': {
                  'test': function() {
                    return this.model.get('field');
                  }
                }
              },
              style: {
                'opacity': {
                  'test': function() {
                    return this.model.get('field');
                  }
                }
              },
              html: {
                'test': function() {
                  return this.model.get('field');
                }
              }
            }
          }
        });
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).not.to.have["class"]('aTest');
        expect(el).not.to.have.prop('pTest');
        expect(el).not.to.have.attr('aTest');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.be.empty;
        model.set('field', 1);
        model.trigger('test');
        expect(el).to.have["class"]('cTest');
        expect(el).to.have.prop('pTest', 1);
        expect(el).to.have.attr('aTest', '1');
        expect(el).to.have.css('opacity', '1');
        expect(el).to.have.html('1');
        model.set('field', '');
        model.trigger('test');
        expect(el).not.to.have["class"]('aTest');
        expect(el).to.have.prop('pTest', '');
        expect(el).to.have.attr('aTest', '');
        expect(el).to.have.css('opacity', '1');
        return expect(el).to.be.empty;
      });
      it('should react on view event with function', function() {
        var View, el, view;
        View = DomView.extend({
          template: {
            '': {
              prop: {
                'pTest': {
                  'test #vtest': function() {
                    return this.model.get('field');
                  }
                }
              },
              html: {
                'test #vtest': function() {
                  return this.model.get('field');
                }
              }
            }
          }
        });
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).not.to.have.prop('pTest');
        expect(el).to.be.empty;
        model.set('field', 1);
        model.trigger('test');
        expect(el).to.have.prop('pTest', 1);
        expect(el).to.have.html('1');
        model.set('field', '2');
        view.trigger('vtest');
        expect(el).to.have.prop('pTest', '2');
        return expect(el).to.have.html('2');
      });
      it('should react on view attributes', function() {
        var View, el, view;
        View = DomView.extend({
          defaults: {
            selected: false
          },
          template: {
            '': {
              'class': {
                'test': '@selected'
              }
            }
          }
        });
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).not.to.have["class"]('test');
        view.set('selected', true);
        expect(el).to.have["class"]('test');
        view.set('selected', false);
        return expect(el).not.to.have["class"]('test');
      });
      it('should return negate value on !event', function() {
        var View, el, view;
        View = DomView.extend({
          defaults: {
            selected: false
          },
          template: {
            'root': {
              'class': {
                'test': '!name !#test !@selected'
              }
            }
          }
        });
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).to.have["class"]('test');
        view.set('selected', true);
        expect(el).not.to.have["class"]('test');
        view.set('selected', false);
        expect(el).to.have["class"]('test');
        view.model.trigger('name', true);
        expect(el).not.to.have["class"]('test');
        view.model.trigger('name', false);
        expect(el).to.have["class"]('test');
        view.trigger('test', true);
        expect(el).not.to.have["class"]('test');
        view.trigger('test', false);
        return expect(el).to.have["class"]('test');
      });
      return it('should accept function as return value', function() {
        var View, li, view;
        View = DomView.extend({
          el: '<ul><li></li><li></li><li></li></ul>',
          template: {
            'li': {
              "class": {
                'cTest': {
                  'test': function() {
                    return function(i, li) {
                      return i % 2;
                    };
                  }
                }
              },
              prop: {
                'pTest': {
                  'test': function() {
                    return function(i, value) {
                      return i;
                    };
                  }
                }
              },
              attr: {
                'aTest': {
                  'test': function() {
                    return function(i, value) {
                      return i;
                    };
                  }
                }
              },
              style: {
                'opacity': {
                  'test': function() {
                    return function(i, value) {
                      return i / 10;
                    };
                  }
                }
              }
            }
          }
        });
        view = new View({
          model: model
        });
        model.trigger('test');
        li = view.$el.find('> li');
        expect(li.eq(0)).not.to.have["class"]('cTest');
        expect(li.eq(1)).to.have["class"]('cTest');
        expect(li.eq(2)).not.to.have["class"]('cTest');
        expect(li.eq(0)).to.have.prop('pTest', 0);
        expect(li.eq(1)).to.have.prop('pTest', 1);
        expect(li.eq(2)).to.have.prop('pTest', 2);
        expect(li.eq(0)).to.have.attr('aTest', '0');
        expect(li.eq(1)).to.have.attr('aTest', '1');
        expect(li.eq(2)).to.have.attr('aTest', '2');
        expect(li.eq(0)).to.have.css('opacity', '0');
        expect(li.eq(1)).to.have.css('opacity', '0.1');
        return expect(li.eq(2)).to.have.css('opacity', '0.2');
      });
    });
  });

}).call(this);
