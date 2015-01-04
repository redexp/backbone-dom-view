// Generated by CoffeeScript 1.8.0
(function() {
  require.config({
    urlArgs: '_=19',
    shim: {
      jquery: {
        exports: 'jQuery'
      },
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'chai-jquery': ['jquery', 'chai'],
      mocha: {
        exports: 'mocha'
      }
    },
    paths: {
      jquery: '../libs/jquery/dist/jquery.min',
      underscore: '../libs/underscore/underscore',
      backbone: '../libs/backbone/backbone',
      'backbone-dom-view': '../backbone-dom-view',
      mocha: '../libs/mocha/mocha',
      chai: '../libs/chai/chai',
      'chai-jquery': '../libs/chai-jquery/chai-jquery'
    }
  });

  require(['chai', 'chai-jquery', 'mocha'], function(chai, chaiJquery, mocha) {
    var tests;
    chai.use(chaiJquery);
    mocha.setup('bdd');
    tests = ['constructor', 'class-prop-attr-style-html', 'on', 'connect', 'each'];
    return require(tests, function() {
      return mocha.run();
    });
  });

}).call(this);
