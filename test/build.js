({
    baseUrl: ".",
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
    },
    include: ['class-prop-attr-style-html', 'on', 'connect', 'each'],
    name: 'config-and-run-tests',
    out: 'main-build.js'
})