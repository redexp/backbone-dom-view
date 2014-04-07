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

            view = new View model
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

        it 'should toggle class for model events with changed arg number |arg(1)', ->
            View = DomView.extend
                template: '':
                    class: 'cTest': 'test|arg(1) eventName|arg(2)'
                    prop:  'pTest': 'test|arg(1) eventName|arg(2)'
                    attr:  'aTest': 'test|arg(1) eventName|arg(2)'
                    style: 'opacity': 'test|arg(1) eventName|arg(2)'
                    html: 'test|arg(1) eventName|arg(2)'

            view = new View model
            el = view.$el

            expect(el).not.to.have.class 'aTest'
            expect(el).not.to.have.prop 'pTest'
            expect(el).not.to.have.attr 'aTest'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.be.empty

            model.trigger 'test', no, 1
            expect(el).to.have.class 'cTest'
            expect(el).to.have.prop 'pTest', 1
            expect(el).to.have.attr 'aTest', '1'
            expect(el).to.have.css 'opacity', '1'
            expect(el).to.have.html '1'

            model.trigger 'eventName', yes, yes, 0
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

            view = new View model
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
                    class: 'cTest': '#test #eventName|arg(1)'
                    prop: 'pTest': '#test #eventName|arg(1)'
                    attr: 'aTest': '#test #eventName|arg(1)'
                    style: 'opacity': '#test #eventName|arg(1)'
                    html: '#test #eventName|arg(1)'

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

            view.trigger 'eventName', yes, 0
            expect(el).not.to.have.class 'aTest'
            expect(el).to.have.prop 'pTest', 0
            expect(el).to.have.attr 'aTest', '0'
            expect(el).to.have.css 'opacity', '0'
            expect(el).to.have.html '0'

        it 'should toggle class for function', ->
            View = DomView.extend
                template: '':
                    class: 'cTest': 'test': -> @model.get 'field'
                    prop: 'pTest': 'test': -> @model.get 'field'
                    attr: 'aTest': 'test': -> @model.get 'field'
                    style: 'opacity': 'test': -> @model.get 'field'
                    html: 'test': -> @model.get 'field'

            view = new View model
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

            view = new View model
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