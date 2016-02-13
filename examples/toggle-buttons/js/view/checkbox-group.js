;(function(app){

    function CheckboxGroup() {
        Backbone.DOMView.apply(this, arguments);
    }

    Backbone.DOMView.extend({
        constructor: CheckboxGroup,

        defaults: function () {
            return {
                value: []
            };
        },

        toggleValue: function (value) {
            var index = this.get('value').indexOf(value);

            if (index === -1) {
                this.set('value', this.get('value').concat(value));
            }
            else {
                this.set('value', _.without(this.get('value'), value));
            }
        },

        template: {
            '[data-value]': {
                'class': {
                    'active': {
                        '@value': function (value) {
                            return function (i, btn) {
                                return value.indexOf(btn.getAttribute('data-value')) > -1;
                            }
                        }
                    }
                },
                on: {
                    'click': function (e) {
                        this.toggleValue(e.currentTarget.getAttribute('data-value'));
                    }
                }
            }
        }
    });

    app.CheckboxGroup = CheckboxGroup;

})(window.app);
