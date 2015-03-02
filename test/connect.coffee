define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'connect helper', ->
        it 'should bind prop and field', ->
            View = DomView.extend
                template: '':
                    connect:
                      'value': 'name'

            model.set 'name', 'test'

            view = new View model: model
            el = view.$el

            expect(el).to.have.prop 'value', 'test'

            el.prop 'value', 'max'
            el.change()

            expect(model.get 'name').to.be.equal 'max'

            model.set 'name', 'bob'

            expect(el).to.have.prop 'value', 'bob'

        it 'should bind prop and view field', ->
            View = DomView.extend
                defaults:
                    name: ''

                template: '':
                    connect:
                      'value': 'name'

            model.set 'name', 'x'

            view = new View model: model
            el = view.$el

            expect(el).to.have.prop 'value', ''

            view.set('name', 'test')

            expect(el).to.have.prop 'value', 'test'

            expect(model.get('name')).to.equal 'x'

            el.prop 'value', 'max'
            el.change()

            expect(view.get 'name').to.be.equal 'max'
            expect(model.get 'name').to.be.equal 'x'

            view.set 'name', 'bob'

            expect(el).to.have.prop 'value', 'bob'
            expect(model.get 'name').to.be.equal 'x'

        it 'should bind prop and field with custom node event', ->
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