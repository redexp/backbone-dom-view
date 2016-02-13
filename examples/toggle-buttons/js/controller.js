;(function(app){

    var radioGroup = new app.RadioGroup({
        el: '#radio-group'
    });

    radioGroup.set('value', '3');

    radioGroup.on('change:value', function () {
        console.log(radioGroup.get('value'));
    });

    var checkboxGroup = new app.CheckboxGroup({
        el: '#checkbox-group'
    });

    checkboxGroup.set('value', ['2', '3']);

    checkboxGroup.on('change:value', function () {
        console.log(checkboxGroup.get('value'));
    });

})(window.app);
