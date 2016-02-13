;(function(app){

    function RadioGroup() {
        Backbone.DOMView.apply(this, arguments);
    }

    Backbone.DOMView.extend({
        constructor: RadioGroup,

        defaults: {
            value: ''
        },

        template: {
            '[data-value]': {
                'class': {
                    'active': {
                        '@value': function (value) {
                            return function (i, btn) {
                                return btn.getAttribute('data-value') === value;
                            };
                        }
                    }
                },

                on: {
                    'click': function (e) {
                        this.set('value', e.currentTarget.getAttribute('data-value'));
                    }
                }
            }
        }
    });

    app.RadioGroup = RadioGroup;

})(window.app);
