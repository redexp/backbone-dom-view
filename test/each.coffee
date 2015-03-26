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

            listView = new ListView model: list
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

            listView = new ListView model: list
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

            listView = new ListView model: list
            el = listView.$el

            expect(el).to.have.text 'BobJack'

            list.at(0).destroy()

            expect(el).to.have.text 'BobJack'

        it 'should create view with el:', ->
            View = DomView.extend
                template: '':
                    html: '@name'

            ListView = DomView.extend
                el: $('<ul><li class="test"></li></ul>')
                template: '':
                    each:
                        view: View
                        el: '> *'

            list = new Backbone.Collection()

            listView = new ListView model: list
            el = listView.$el

            expect(el.find('li').length).to.equal 0

            list.set([{name: 'Jack'}, {name: 'Bob'}])

            expect(el.find('li').length).to.equal 2

            expect(el.find('li')).to.have.class 'test'

        it 'should have `parent` field', ->
            views = []

            ListView = DomView.extend
                el: '<ul></ul>'
                template: '':
                    each:
                        view: (model) ->
                            view = new Backbone.View(model: model)
                            view.parent = true if model.get('parent')
                            views.push(view);
                            return view

            list = new Backbone.Collection([{parent: false}, {parent: true}])

            listView = new ListView model: list

            expect(views[0].parent).to.be.equal listView
            expect(views[1].parent).to.be.equal true

        it 'should to be sorted by event', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        view: Item
                        el: '> *'
                        sort: true

            list = new Backbone.Collection()
            list.comparator = 'name';

            view = new ListView model: list

            list.set([{name: 1}, {name: 3}, {name: 2}])

            li = view.$el.children()
            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'
            expect(li.eq(2)).to.have.text '3'

        it 'should to be sorted by custom event and field', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        view: Item
                        el: '> *'
                        sort:
                            event: 'test'
                            field: 'name'

            list = new Backbone.Collection()

            view = new ListView model: list

            list.set([{name: 1}, {name: 3}, {name: 2}])

            li = view.$el.children()

            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '3'
            expect(li.eq(2)).to.have.text '2'

            list.trigger('test')

            li = view.$el.children()

            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'
            expect(li.eq(2)).to.have.text '3'

            expect(list.at(0).get('name')).to.equal 1
            expect(list.at(1).get('name')).to.equal 3
            expect(list.at(2).get('name')).to.equal 2

        it 'should sort list by views event on event', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        view: Item
                        el: '> *'
                        sortByViews: 'test'

            list = new Backbone.Collection()

            view = new ListView model: list

            list.set([{name: 1}, {name: 2}, {name: 3}])

            li = view.$el.children()

            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'
            expect(li.eq(2)).to.have.text '3'

            li.eq(0).insertAfter(li.eq(2))

            view.trigger('test')

            expect(list.at(0).get('name')).to.equal 2
            expect(list.at(1).get('name')).to.equal 3
            expect(list.at(2).get('name')).to.equal 1

        it 'should sort list by views on event and set index to field', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        view: Item
                        el: '> *'
                        sortByViews:
                            event: 'test'
                            field: 'order'

            list = new Backbone.Collection()

            view = new ListView model: list

            list.set([{name: 1, order: 0}, {name: 2, order: 1}, {name: 3, order: 2}])

            li = view.$el.children()

            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'
            expect(li.eq(2)).to.have.text '3'

            li.eq(0).insertAfter(li.eq(2))

            view.trigger('test')

            expect(list.at(0).get('name')).to.equal 1
            expect(list.at(0).get('order')).to.equal 2

            expect(list.at(1).get('name')).to.equal 2
            expect(list.at(1).get('order')).to.equal 0

            expect(list.at(2).get('name')).to.equal 3
            expect(list.at(2).get('order')).to.equal 1

        it 'should iterate over plain array', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        field:
                            name: 'list'
                            wrapper: Backbone.Collection
                        view: Item
                        el: '> *'

            model = new Backbone.Model({
                list: [{name: 1},{name: 2}]
            })

            view = new ListView model: model

            li = view.$el.children()

            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'

        it 'should trigger added event', ->
            num = 0

            Item = DomView.extend
                initialize: ->
                    expect(this.$el.parent().length).to.equal 0

                    this.on 'added', ->
                        num++
                        expect(this.$el.parent().length).to.equal 1

                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        view: Item
                        el: '> *'

            model = new Backbone.Collection([{name: 1},{name: 2}])

            view = new ListView model: model

            expect(num).to.equal 2

            x = 0;

            XItem = Item.extend
                initialize: ->
                    expect(this.$el.parent().length).to.equal 0

                    this.on 'added', ->
                        x++

                    this.on 'tested', ->
                        x++
                        expect(this.$el.parent().length).to.equal 1

            XListView = ListView.extend
                template: '':
                    each:
                        addedEvent: 'tested'
                        view: XItem

            view = new XListView model: model

            expect(x).to.equal 2

        it 'should handle reset event', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        view: Item
                        el: '> *'

            list = new Backbone.Collection([{name: 1}, {name: 2}, {name: 3}])

            view = new ListView model: list

            li = view.$el.children()

            expect(li.length).to.equal 3
            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'
            expect(li.eq(2)).to.have.text '3'

            list.reset([{name: 2}, {name: 3}])

            li = view.$el.children()

            expect(li.length).to.equal 2
            expect(li.eq(0)).to.have.text '2'
            expect(li.eq(1)).to.have.text '3'

        it 'should have viewList as EachViewList', ->
            Item = DomView.extend
                defaults:
                    selected: false

                initialize: ->
                    this.set('selected', this.model.get('name') < 3)

                template:
                    'root':
                        html: '@name'
                        class:
                            'selected': '@selected'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: 'root':
                    each:
                        view: Item
                        el: '> *'

            list = new Backbone.Collection([{name: 1}, {name: 2}, {name: 3}])

            view = new ListView model: list

            viewList = view.template.root.each.viewList
            views = viewList.where({selected: true})

            expect(views.length).to.equal 2
            expect(views[0].$el).to.have.class 'selected'
            expect(views[1].$el).to.have.class 'selected'
            expect(viewList[list.at(2).cid].$el).not.to.have.class 'selected'

            views = viewList.where({selected: /^f/})
            expect(views.length).to.equal 1
            expect(views[0]).to.equal viewList[list.at(2).cid]

            views = viewList.findWhere({selected: false})
            expect(views).to.equal viewList[list.at(2).cid]

        it 'should iterate over model field', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'
                template: '':
                    each:
                        field: 'list'
                        view: Item
                        el: '> *'

            list = new Backbone.Collection([{name: 1}, {name: 2}, {name: 3}])
            model = new Backbone.Model({list: list})

            view = new ListView model: model

            li = view.$el.children()

            expect(li.length).to.equal 3
            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'
            expect(li.eq(2)).to.have.text '3'

            model.get('list').add({name: 4})

            expect(view.$el.children().eq(3)).to.have.text '4'

        it 'should iterate over view field', ->
            Item = DomView.extend
                template:
                    '': html: '@name'

            ListView = DomView.extend
                el: '<ul><li></li></ul>'

                defaults:
                    list: null

                initialize: ->
                    this.set 'list', new Backbone.Collection([{name: 1}, {name: 2}, {name: 3}])

                template: '':
                    each:
                        field: 'list'
                        view: Item
                        el: '> *'

            model = new Backbone.Model()

            view = new ListView model: model

            li = view.$el.children()

            expect(li.length).to.equal 3
            expect(li.eq(0)).to.have.text '1'
            expect(li.eq(1)).to.have.text '2'
            expect(li.eq(2)).to.have.text '3'

            view.get('list').add({name: 4})

            expect(view.$el.children().eq(3)).to.have.text '4'
