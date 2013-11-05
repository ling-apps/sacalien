var _ = require('../tools/underscore');

function LinksView($el, socket) {
    this.$el = $el;
    this.socket = socket;
    this.tpl = document.getElementById('link-view').innerHTML;
    this.topTpl = document.getElementById('link-top').innerHTML;
    this.listTpl = document.getElementById('link-list').innerHTML
    this.links = [];
}

LinksView.prototype.init = function init() {
    this.socket.get('/links', function(resp) {
        this.links = resp;
        this.render();
    }.bind(this));
};

LinksView.prototype.render = function render() {
    this.$el.innerHTML = _.template(this.tpl, {});
    this.renderTop();
    this.renderLinkList();
};

LinksView.prototype.renderTop = function renderTop() {
    var $linkTop = this.$el.querySelector('#top-wrapper');
    $linkTop.innerHTML = _.template(this.topTpl, {});
};

LinksView.prototype.renderLinkList = function renderLinkList() {
    var $linkList = this.$el.querySelector('#list-wrapper');
    var html = _.template(this.listTpl, {links: this.links});
    $linkList.innerHTML = html;
};


module.exports = LinksView;