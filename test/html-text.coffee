define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model({name: 'Test <b>Name</b>'})

    describe 'html and text helpers', ->

        it 'should render as html', ->
            View = DomView.extend
                template: 'root':
                    html: '=name'

            view = new View model: model
            el = view.$el

            expect(el).to.have.html 'Test <b>Name</b>'

        it 'should render as text', ->
            View = DomView.extend
                template: 'root':
                    text: '=name'

            view = new View model: model
            el = view.$el

            expect(el).to.have.text 'Test <b>Name</b>'

        it 'should render null and undefined as empty text', ->
            View = DomView.extend
                template: 'root':
                    text: '@name'

            view = new View model: model
            el = view.$el

            model.set('name', null);
            expect(el).to.have.text ''

            model.set('name', 0);
            expect(el).to.have.text '0'

            model.set('name', undefined);
            expect(el).to.have.text ''

            model.set('name', false);
            expect(el).to.have.text 'false'

        it 'should render as safe html', ->
            View = DomView.extend
                template: 'root':
                    safeHtml: '=name'

            model.set('name', 'Test <script src="app.js"/> <script src="app.js"></script> <div onclick="alert()" class="test"><font color="red">Name</font></div>')

            view = new View model: model
            el = view.$el

            expect(el).to.have.html 'Test   <div class="test"><font color="red">Name</font></div>'
