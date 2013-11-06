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

LinksView.prototype.bindEvent = function bindEvent() {
    this.$el.querySelector('.add-link-btn').addEventListener('click', this.showAddLinkForm.bind(this));

    this.$el.querySelector('.add-link-form').addEventListener('submit', this.addLink.bind(this));

    this.$el.querySelector('.add-link-form .cancel-add-link').addEventListener('click', this.hideAddLinkForm.bind(this));
};

LinksView.prototype.render = function render() {
    this.$el.innerHTML = _.template(this.tpl, {});
    this.renderTop();
    this.renderLinkList();

    this.bindEvent();
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

LinksView.prototype.showAddLinkForm = function showAddLinkForm(e) {
    e.preventDefault();
    this.$el.querySelector('.add-link-form').classList.remove('height0');
};

LinksView.prototype.hideAddLinkForm = function hideAddLinkForm() {
    this.$el.querySelector('.add-link-form').classList.add('height0');
};

LinksView.prototype.addLink = function addLink(e) {
    var name = e.target.querySelector('[name="name"]').value;
    var url = e.target.querySelector('[name="url"]').value;
    var tags = e.target.querySelector('[name="tags"]').value;

    var link = {
        name: name,
        url: url,
        tags: tags
    }

    this.socket.post('/links/create', JSON.stringify(link), function(res) {
        console.log(res);
    });
};


module.exports = LinksView;