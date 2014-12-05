define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'on helper', ->
        it 'should run function on dom event', (done) ->
            View = DomView.extend
                template: '':
                    on: 'click': ->
                        expect(this).to.be.instanceOf View
                        done()

            view = new View model: model
            view.$el.click()