define ['chai', 'backbone', 'backbone-dom-view', 'jquery'], ({expect}, Backbone, DomView, $) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'template helper', ->
        it 'should combine parent selector and children selectors', () ->
            View = DomView.extend
                el: '''<div>
                            <div data-item>
                                <div data-name></div>
                                <div data-count>
                                    <div data-value></div>
                                </div>
                            </div>
                            <div data-title></div>
                            <div data-test>
                                <div data-name></div>
                            </div>
                        </div>'''
                ui:
                    test: '[data-test]'
                template:
                    '[data-item]':
                        template:
                            '[data-name]':
                                text: -> 1
                            '[data-count]':
                                template:
                                    '[data-value]':
                                        text: -> 2
                    '[data-title]':
                        text: -> 3

                    'test':
                        template:
                            '[data-name]':
                                text: -> 4

            view = new View()

            expect(view.$('[data-item] [data-name]')).to.have.text '1'
            expect(view.$('[data-item] [data-count] [data-value]')).to.have.text '2'
            expect(view.$('[data-title]')).to.have.text '3'
            expect(view.$('[data-test] [data-name]')).to.have.text '4'

