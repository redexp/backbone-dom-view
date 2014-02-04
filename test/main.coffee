define ['chai', 'backbone', 'dom-view'], ({expect}, Backbone, DomView) ->

    describe 'DOMView', ->

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

        describe 'on helper', ->
            it 'should run function on dom event', (done) ->
                View = DomView.extend
                    template: '':
                        on: 'click': ->
                            expect(this).to.be.instanceOf View
                            done()

                view = new View model
                view.$el.click()

        describe 'connect helper', ->
            it 'should bind prop and field', ->
                View = DomView.extend
                    template: '':
                        connect:
                            'id|click': 'id'

                model.set 'id', 'test'

                view = new View model
                el = view.$el

                expect(el).to.have.prop 'id', 'test'

                el.prop 'id', 'max'
                el.click()

                expect(model.get 'id').to.be.equal 'max'

                model.set 'id', 'bob'

                expect(el).to.have.prop 'id', 'bob'

        describe 'each helper', ->
            it 'should create view for each item in collection', ->
                View = DomView.extend
                    tagName: 'li'
                    template: '':
                        html: '@name'

                ListView = DomView.extend
                    tagName: 'ul'
                    template: '':
                        each:
                            view: View

                list = new Backbone.Collection [{name: 'Jack'}, {name: 'Bob'}]

                listView = new ListView list
                el = listView.$el

                expect(el.find 'li').to.be.of.length 2

                list.add {name: 'Max'}

                expect(el.find 'li').to.be.of.length 3

                list.at(1).remove()

                expect(el).to.have.text 'JackMax'

            it 'should run custom insertion/remove function', ->
                View = DomView.extend
                    tagName: 'li'
                    template: '':
                        html: '@name'

                ListView = DomView.extend
                    tagName: 'ul'
                    template: '':
                        each:
                            view: View
                            addHandler: (ul, li, item) ->
                                expect(this).to.be.instanceOf ListView
                                expect(item).to.be.instanceOf Backbone.Model
                                ul.prepend li

                            delHandler: (ul, li, item) ->
                                expect(this).to.be.instanceOf ListView
                                expect(item).to.be.instanceOf Backbone.Model

                list = new Backbone.Collection [{name: 'Jack'}, {name: 'Bob'}]

                listView = new ListView list
                el = listView.$el

                expect(el).to.have.text 'BobJack'

                list.at(0).remove()

                expect(el).to.have.text 'BobJack'