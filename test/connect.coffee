define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'connect helper', ->
        it 'should bind prop and field', ->
            View = DomView.extend
                template: '':
                    connect:
                      'id|click': 'id'

            model.set 'id', 'test'

            view = new View model: model
            el = view.$el

            expect(el).to.have.prop 'id', 'test'

            el.prop 'id', 'max'
            el.click()

            expect(model.get 'id').to.be.equal 'max'

            model.set 'id', 'bob'

            expect(el).to.have.prop 'id', 'bob'