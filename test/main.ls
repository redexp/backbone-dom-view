(chai, Backbone, DomView) <- define [\chai \backbone \dom-view]

{expect} = chai

(...) <-! describe 'DOMView'

model = null

beforeEach ->
    model := new Backbone.Model()

describe 'class helper' (...) !->
    it 'should toggle class for model events', !->
        View = DomView.extend do
            template: '': class: 'test': 'test eventName'

        view = new View model
        el = view.$el

        expect el .not.to.have.class \test

        model.trigger \test yes
        expect el .to.have.class \test

        model.trigger \eventName no
        expect el .not.to.have.class \test

    it 'should toggle class for model events with changed arg number |arg(1)', !->
        View = DomView.extend do
            template: '': class: 'test': 'test|arg(1) eventName|arg(2)'

        view = new View model
        el = view.$el

        expect el .not.to.have.class \test

        model.trigger \test no yes
        expect el .to.have.class \test

        model.trigger \eventName yes yes no
        expect el .not.to.have.class \test

    it 'should toggle class for model field @fieldName', !->
        View = DomView.extend do
            template: '': class: 'test': '@test'

        model.set \test yes

        view = new View model
        el = view.$el

        expect el .to.have.class \test

        model.set \test no
        expect el .not.to.have.class \test

        model.set \test yes
        expect el .to.have.class \test

    it 'should toggle class for view event #viewEvent', !->
        View = DomView.extend do
            template: '': class: 'test': '#test #eventName|arg(1)'

        view = new View
        el = view.$el

        expect el .not.to.have.class \test

        view.trigger \test yes
        expect el .to.have.class \test

        view.trigger \eventName yes no
        expect el .not.to.have.class \test

    it 'should toggle class for function', !->
        View = DomView.extend do
            template: '': class:
                'test': 'test': -> @model.get \field

        view = new View model
        el = view.$el

        expect el .not.to.have.class \test

        model.set \field 1
        model.trigger \test
        expect el .to.have.class \test

        model.set \field ''
        model.trigger \test
        expect el .not.to.have.class \test