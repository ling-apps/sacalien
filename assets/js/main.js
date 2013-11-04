require('./tools/console');

var App = {
    transitionTo: function(route) {
        this[route].call(this, arguments);
    },
    init: function() {
        this.socket = window.socket;

        this.transitionTo('index');
    },
    index: function() {
        this.socket.get('users', function(users) {
            console.log(users);
        });
    }
};

App.init();