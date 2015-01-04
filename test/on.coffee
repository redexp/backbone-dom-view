define ['chai', 'backbone', 'backbone-dom-view', 'jquery'], ({expect}, Backbone, DomView, $) ->

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

        it 'should run function on delegate event', ->
            eventsCalled = 0

            View = DomView.extend
                el: '<li><a href="#"></a><button></button></li>'
                template: '':
                    on: 'click':
                        'a': (e) ->
                            eventsCalled++
                            expect(this).to.be.instanceOf View
                            expect($(e.currentTarget)).to.match 'a'

                        'button': (e) ->
                            eventsCalled++
                            expect(this).to.be.instanceOf View
                            expect($(e.currentTarget)).to.match 'button'

            view = new View model: model
            view.$el.click()
            view.$el.find('a').click()
            view.$el.find('button').click()

            expect(eventsCalled).to.be.equal 2