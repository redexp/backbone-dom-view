require.config do
    shim:
        jquery:
            exports: 'jQuery'

        underscore:
            exports: '_'

        backbone:
            deps: [\underscore \jquery]
            exports: 'Backbone'

        'chai-jquery': [\jquery \chai]

        mocha:
            exports: 'mocha'

    paths:
        jquery:        '../libs/jquery/jquery.min'
        underscore:    '../libs/underscore/underscore-min'
        backbone:      '../libs/backbone/backbone'
        'dom-view':    '../backbone-dom-view'
        mocha:         '../libs/mocha/mocha'
        chai:          '../libs/chai/chai'
        'chai-jquery': '../libs/chai-jquery/chai-jquery'


(require, chai, chaiJquery, mocha) <- require ['require', 'chai', 'chai-jquery', 'mocha']

chai.use chaiJquery

mocha.setup \bdd

tests = [
    'main'
]

<- require tests

mocha.run!