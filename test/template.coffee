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

        it 'should handle & in subselectors', ->
            View = DomView.extend
                el: '''<div>
                            <div data-item>
                                <div data-item-test>
                                    <span></span>
                                    <div data-item-test-value></div>
                                </div>
                                <div data-item-name></div>
                                <div data-item-count>
                                    <div data-value></div>
                                </div>
                            </div>
                            <div data-title></div>
                            <div data-test></div>
                            <div data-test data-name></div>
                        </div>'''
                ui:
                    test: '[data-test]'
                template:
                    '[data-item':
                        '&-test':
                            '&] span':
                                text: -> 0.1
                            '&-value]':
                                text: -> 0.2

                        template:
                            '&-name]':
                                text: -> 1
                            '&-count]':
                                '& [data-value]':
                                    text: -> 2

                    '[data-title]':
                        text: -> 3

                    'test':
                        template:
                            '&[data-name]':
                                text: -> 4

            view = new View()
            expect(view.$('[data-item-test] span')).to.have.text '0.1'
            expect(view.$('[data-item-test-value]')).to.have.text '0.2'
            expect(view.$('[data-item-name]')).to.have.text '1'
            expect(view.$('[data-item-count] [data-value]')).to.have.text '2'
            expect(view.$('[data-title]')).to.have.text '3'
            expect(view.$('[data-test]').eq(0)).to.have.text ''
            expect(view.$('[data-test][data-name]')).to.have.text '4'
