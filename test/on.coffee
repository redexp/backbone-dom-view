define ['chai', 'backbone', 'backbone-dom-view', 'jquery'], ({expect}, Backbone, DomView, $) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'on/once helpers', ->
        it 'should run function on dom event', () ->
            n = 0

            View = DomView.extend
                template: '':
                    on: 'click': ->
                        expect(this).to.be.instanceOf View
                        n++

            view = new View model: model

            view.$el.click()
            expect(n).to.equal 1

            view.$el.click()
            expect(n).to.equal 2

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

        it 'should run view method if string passed', ->
            n = 0

            View = DomView.extend
                test: -> n++

                run: -> n = 'test'

                template: 'root':
                    on:
                        'click': 'test'
                        'test': 'run'

            view = new View model: model

            view.$el.click()
            expect(n).to.equal 1

            view.$el.trigger('test')
            expect(n).to.equal 'test'

        it 'should run function once', ->
            n = 0

            View = DomView.extend
                test: -> n++

                template: 'root':
                    once:
                        'click': 'test'

            view = new View model: model

            view.$el.click()
            expect(n).to.equal 1

            view.$el.click()
            expect(n).to.equal 1

        it 'should handle ! as preventDefault', ->
            n = 0

            View = DomView.extend
                test: -> n++

                template: 'root':
                    on:
                        'click': '!test'
                        'test': '!'

            view = new View

            view.$el.on 'click', (e) ->
                n++
                expect(e.isDefaultPrevented()).to.equal true

            view.$el.on 'test', (e) ->
                n = 'test'
                expect(e.isDefaultPrevented()).to.equal true

            view.$el.click()

            expect(n).to.equal 2

            view.$el.trigger('test')

            expect(n).to.equal 'test'

        it 'should handle click helper', ->
            n = 0

            View = DomView.extend
                test: -> n++

                template: 'root':
                    click: 'test'

            view = new View
            view.$el.click()
            expect(n).to.equal 1
