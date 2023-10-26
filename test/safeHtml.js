const View = require('../backbone-dom-view');
const {test} = require('node:test');
const {deepEqual} = require('node:assert');

test('safeHtml', function () {
	deepEqual(
		View.helpers.safeHtml.wrapper(
			`Test <script src="app.js"/> `+
			`<script src="app.js"></script> `+
			`<div onclick = "1 > 2; '<div>'; alert()" class="test" onkeyup=>`+
				`<font color="red" onclick = alert onkeyup='alert()'>Name</font>`+
			`</div>`+
			`<input asd onclick="qwe"/>`+
			`<input asd asd onclick="qwe" asd/>`
		),
			`Test <div style="display: none;" src="app.js"/> `+
			`<div style="display: none;" src="app.js"></div> `+
			`<div x-click = "1 > 2; '<div>'; alert()" class="test" x-keyup=>`+
				`<font color="red" x-click = alert x-keyup='alert()'>Name</font>`+
			`</div>`+
			`<input asd x-click="qwe"/>`+
			`<input asd asd x-click="qwe" asd/>`
	);
});