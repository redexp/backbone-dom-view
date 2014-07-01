// Generated by CoffeeScript 1.7.1
(function() {
  define(['chai', 'backbone', 'backbone-dom-view'], function(_arg, Backbone, DomView) {
    var expect, model;
    expect = _arg.expect;
    model = null;
    beforeEach(function() {
      return model = new Backbone.Model();
    });
    return describe('on helper', function() {
      return it('should run function on dom event', function(done) {
        var View, view;
        View = DomView.extend({
          template: {
            '': {
              on: {
                'click': function() {
                  expect(this).to.be.instanceOf(View);
                  return done();
                }
              }
            }
          }
        });
        view = new View(model);
        return view.$el.click();
      });
    });
  });

}).call(this);