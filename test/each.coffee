define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

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

            expect(el.find('li').length).to.equal 2

            list.add {name: 'Max'}

            expect(el.find('li').length).to.equal 3

            list.at(1).destroy()

            expect(el).to.have.text 'JackMax'

        it 'should run custom view function', ->
            LiView = DomView.extend
                tagName: 'li'

            DivView = DomView.extend
                tagName: 'div'

            ListView = DomView.extend
                tagName: 'ul'
                template: '':
                     each:
                         view: (model)->
                             if model.get('type') is 'li' then LiView else DivView

            list = new Backbone.Collection [{type: 'li'}, {type: 'div'}]

            listView = new ListView list
            el = listView.$el

            expect(el.find('li').length).to.be.equal 1
            expect(el.find('div').length).to.be.equal 1

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
                         addHandler: 'prepend'
                         delHandler: (ul, view) ->
                             expect(this).to.be.instanceOf ListView
                             expect(view).to.be.instanceOf View

            list = new Backbone.Collection [{name: 'Jack'}, {name: 'Bob'}]

            listView = new ListView list
            el = listView.$el

            expect(el).to.have.text 'BobJack'

            list.at(0).destroy()

            expect(el).to.have.text 'BobJack'
