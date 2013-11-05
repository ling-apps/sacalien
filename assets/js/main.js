require('./tools/console');
var LinksView = require('./views/links');

var App = {
    transitionTo: function(route) {
        this[route].call(this, arguments);
    },
    init: function() {
        this.socket = window.socket;
        this.container = document.querySelector('.content');

        this.transitionTo('index');
    },
    index: function() {
        var linksView = new LinksView(this.container, this.socket);
        linksView.init();
    }
};

App.init();