define(['chai', 'backbone', 'backbone-dom-view'], function (_arg, Backbone, DomView) {
	var expect, model;
	expect = _arg.expect;
	model = null;

	beforeEach(function () {
		return model = new Backbone.Model({
			name: 'Test <b>Name</b>'
		});
	});

	describe('html and text helpers', function () {
		it('should render as html', function () {
			var View, el, view;
			View = DomView.extend({
				template: {
					'root': {
						html: '=name'
					}
				}
			});
			view = new View({
				model: model
			});
			el = view.$el;
			return expect(el).to.have.html('Test <b>Name</b>');
		});

		it('should render as text', function () {
			var View, el, view;
			View = DomView.extend({
				template: {
					'root': {
						text: '=name'
					}
				}
			});
			view = new View({
				model: model
			});
			el = view.$el;
			return expect(el).to.have.text('Test <b>Name</b>');
		});

		it('should render null and undefined as empty text', function () {
			var View, el, view;
			View = DomView.extend({
				template: {
					'root': {
						text: '@name'
					}
				}
			});
			view = new View({
				model: model
			});
			el = view.$el;
			model.set('name', null);
			expect(el).to.have.text('');
			model.set('name', 0);
			expect(el).to.have.text('0');
			model.set('name', void 0);
			expect(el).to.have.text('');
			model.set('name', false);
			return expect(el).to.have.text('false');
		});

		it('should render as safe html', function () {
			var View, el, view;
			View = DomView.extend({
				template: {
					'root': {
						safeHtml: '=name'
					}
				}
			});
			model.set('name', 'Test <script src="app.js"/> <script src="app.js"></script> <div onclick = "1 > 2; \'<div>\'; alert()" class="test" onkeyup=><font color="red" onclick = alert onkeyup=\'alert()\'>Name</font></div><input asd onclick="qwe"/>');
			view = new View({
				model: model
			});
			el = view.$el;
			return expect(el).to.have.html('Test <div style="display: none;" src="app.js"></div> <div style="display: none;" src="app.js"></div> <div x-click="1 > 2; \'<div>\'; alert()" class="test" x-keyup=""><font color="red" x-click="alert" x-keyup="alert()">Name</font></div>');
		});
	});
});