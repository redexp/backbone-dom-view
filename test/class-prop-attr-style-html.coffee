define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'class, prop, attr, style, html helpers', ->

        it 'should toggle class for model events', ->
            View = DomView.extend
                template: '':
                    class: 'cTest': 'test eventName'
                    prop:  'pTest': 'test eventName'
                    attr:  'aTest': 'test eventName'
                    style: 'opacity': 'test eventName'
                    html: 'test eventName'

            view = new View model: model
            el = view.$el

            expect(el).not.to.have.class 'aTest'
            expect(el).not.to.have.prop 'pTest'
            expect(el).not.to.have.attr 'aTest'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.be.empty

            model.trigger 'test', 1
            expect(el).to.have.class 'cTest'
            expect(el).to.have.prop 'pTest', 1
            expect(el).to.have.attr 'aTest', '1'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.have.html '1'

            model.trigger 'eventName', 0
            expect(el).not.to.have.class 'aTest'
            expect(el).to.have.prop 'pTest', 0
            expect(el).to.have.attr 'aTest', '0'
            expect(el).to.have.css 'opacity', '0'
            expect(el).to.have.html '0'

        it 'should toggle class for model field @fieldName', ->
            View = DomView.extend
                template: '':
                    class: 'cTest': '@test'
                    prop: 'pTest': '@test'
                    attr: 'aTest': '@test'
                    style: 'opacity': '@test'
                    html: '@test'

            model.set 'test', yes

            view = new View model: model
            el = view.$el

            expect(el).to.have.class 'cTest'
            expect(el).to.have.prop 'pTest'
            expect(el).to.have.attr 'aTest'
            expect(el).to.have.css 'opacity'
            expect(el).to.have.html 'true'

            model.set 'test', 0
            expect(el).not.to.have.class 'aTest'
            expect(el).to.have.prop 'pTest', 0
            expect(el).to.have.attr 'aTest', '0'
            expect(el).to.have.css 'opacity', '0'
            expect(el).to.have.html '0'

            model.set 'test', 1
            expect(el).to.have.class 'cTest'
            expect(el).to.have.prop 'pTest', 1
            expect(el).to.have.attr 'aTest', '1'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.have.html '1'

        it 'should toggle class for view event #viewEvent', ->
            View = DomView.extend
                template: '':
                    class: 'cTest': '#test'
                    prop: 'pTest': '#test'
                    attr: 'aTest': '#test'
                    style: 'opacity': '#test'
                    html: '#test'

            view = new View
            el = view.$el

            expect(el).not.to.have.class 'aTest'
            expect(el).not.to.have.prop 'pTest'
            expect(el).not.to.have.attr 'aTest'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.be.empty

            view.trigger 'test', 1
            expect(el).to.have.class 'cTest'
            expect(el).to.have.prop 'pTest', 1
            expect(el).to.have.attr 'aTest', '1'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.have.html '1'

        it 'should toggle class for function', ->
            View = DomView.extend
                template: '':
                    class: 'cTest': 'test': -> @model.get 'field'
                    prop: 'pTest': 'test': -> @model.get 'field'
                    attr: 'aTest': 'test': -> @model.get 'field'
                    style: 'opacity': 'test': -> @model.get 'field'
                    html: 'test': -> @model.get 'field'

            view = new View model: model
            el = view.$el

            expect(el).not.to.have.class 'aTest'
            expect(el).not.to.have.prop 'pTest'
            expect(el).not.to.have.attr 'aTest'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.be.empty

            model.set 'field', 1
            model.trigger 'test'
            expect(el).to.have.class 'cTest'
            expect(el).to.have.prop 'pTest', 1
            expect(el).to.have.attr 'aTest', '1'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.have.html '1'

            model.set 'field', ''
            model.trigger 'test'
            expect(el).not.to.have.class 'aTest'
            expect(el).to.have.prop 'pTest', ''
            expect(el).to.have.attr 'aTest', ''
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.be.empty

        it 'should react on view event with function', ->
            View = DomView.extend
                template: '':
                    prop: 'pTest': 'test #vtest': -> @model.get 'field'
                    html: 'test #vtest': -> @model.get 'field'

            view = new View model: model
            el = view.$el

            expect(el).not.to.have.prop 'pTest'
            expect(el).to.be.empty

            model.set 'field', 1
            model.trigger 'test'
            expect(el).to.have.prop 'pTest', 1
            expect(el).to.have.html '1'

            model.set 'field', '2'
            view.trigger 'vtest'
            expect(el).to.have.prop 'pTest', '2'
            expect(el).to.have.html '2'

        it 'should react on view attributes', ->
            View = DomView.extend
                defaults:
                    selected: false
                template: '':
                    'class': 'test': '@selected'

            view = new View model: model
            el = view.$el

            expect(el).not.to.have.class 'test'

            view.set('selected', true);

            expect(el).to.have.class 'test'

            view.set('selected', false);

            expect(el).not.to.have.class 'test'

        it 'should return attr value without binding to event', ->
            View = DomView.extend
                defaults:
                    selected: true
                    active: false
                template: 'root':
                    'class':
                        'selected-test': '=selected'
                        'active-test': '=active'

            view = new View model: model
            el = view.$el

            expect(el).to.have.class 'selected-test'
            expect(el).not.to.have.class 'active-test'
            view.set('selected', false)
            view.set('active', true)
            expect(el).to.have.class 'selected-test'
            expect(el).not.to.have.class 'active-test'
            view.set('selected', true)
            view.set('active', false)
            expect(el).to.have.class 'selected-test'
            expect(el).not.to.have.class 'active-test'

        it 'should return negate value on !event', ->
            View = DomView.extend
                defaults:
                    selected: false
                    active: false
                template: 'root':
                    'class':
                        'test': '!name !#test !@selected'
                        'active': '!=active'

            view = new View model: model
            el = view.$el

            expect(el).to.have.class 'test'
            view.set('selected', true)
            expect(el).not.to.have.class 'test'
            view.set('selected', false)
            expect(el).to.have.class 'test'

            view.model.trigger('name', true)
            expect(el).not.to.have.class 'test'
            view.model.trigger('name', false)
            expect(el).to.have.class 'test'

            view.trigger('test', true)
            expect(el).not.to.have.class 'test'
            view.trigger('test', false)
            expect(el).to.have.class 'test'

            expect(el).to.have.class 'active'

        it 'should accept function as return value', ->
            View = DomView.extend
                el: '<ul><li></li><li></li><li></li></ul>'
                template: 'li':
                    class: 'cTest': 'test': -> return (i, li) -> i % 2
                    prop: 'pTest': 'test': -> return (i, value) -> i
                    attr: 'aTest': 'test': -> return (i, value) -> i
                    style: 'opacity': 'test': -> return (i, value) -> i / 10
                    html: 'test': -> return (i, li) -> i

            view = new View model: model

            model.trigger('test')

            li = view.$el.find('> li')

            expect(li.eq(0)).not.to.have.class 'cTest'
            expect(li.eq(1)).to.have.class 'cTest'
            expect(li.eq(2)).not.to.have.class 'cTest'

            expect(li.eq(0)).to.have.prop 'pTest', 0
            expect(li.eq(1)).to.have.prop 'pTest', 1
            expect(li.eq(2)).to.have.prop 'pTest', 2

            expect(li.eq(0)).to.have.attr 'aTest', '0'
            expect(li.eq(1)).to.have.attr 'aTest', '1'
            expect(li.eq(2)).to.have.attr 'aTest', '2'

            expect(li.eq(0)).to.have.css 'opacity', '0'
            expect(li.eq(1)).to.have.css 'opacity', '0.1'
            expect(li.eq(2)).to.have.css 'opacity', '0.2'

            expect(li.eq(0)).to.have.html '0'
            expect(li.eq(1)).to.have.html '1'
            expect(li.eq(2)).to.have.html '2'

