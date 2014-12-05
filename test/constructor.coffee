define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'constructor', ->
        it 'should extend parent template:', ->
            View = DomView.extend
                tagName: 'li'
                template: '':
                    html: '@name'

            XView = View.extend
                template: '':
                    prop: "test": '@name'

            view = new View model: model
            el1 = view.$el
            xView = new XView model: model
            el2 = xView.$el

            model.set('name', 'Jack')

            expect(el1).to.have.text 'Jack'
            expect(el2).to.have.text 'Jack'
            expect(el1).not.to.have.prop 'test'
            expect(el2).to.have.prop 'test', 'Jack'