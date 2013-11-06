var _ = require('../tools/underscore');

function LinksView($el, socket) {
    this.$el = $el;
    this.socket = socket;
    this.tpl = document.getElementById('link-view').innerHTML;
    this.topTpl = document.getElementById('link-top').innerHTML;
    this.listTpl = document.getElementById('link-list').innerHTML
    this.links = [];
    this._displayedLinks = [];
}

LinksView.prototype.init = function init() {
    this.socket.get('/links', function(resp) {
        this.links = resp;
        this.setDisplayedLinks([]);
        this.render();
    }.bind(this));
};

LinksView.prototype.bindEvent = function bindEvent() {

    // Display mode
    var $listWrapper = this.$el.querySelector('#list-wrapper');
    this.$el.querySelector('.btn-list').addEventListener('click', function(e) {
        $listWrapper.classList.remove('display-grid');
        $listWrapper.classList.add('display-list');
        this.$el.querySelector('.btn-grid').classList.remove('active');
        this.$el.querySelector('.btn-list').classList.add('active');
    }.bind(this));
    this.$el.querySelector('.btn-grid').addEventListener('click', function(e) {
        $listWrapper.classList.remove('display-list');
        $listWrapper.classList.add('display-grid');
        this.$el.querySelector('.btn-list').classList.remove('active');
        this.$el.querySelector('.btn-grid').classList.add('active');
    }.bind(this));

    // Show add link form
    this.$el.querySelector('.add-link-btn').addEventListener('click', this.showAddLinkForm.bind(this));

    // Submit link form
    this.$el.querySelector('.add-link-form').addEventListener('submit', this.addLink.bind(this));

    // Cancel link form
    this.$el.querySelector('.add-link-form .cancel-add-link').addEventListener('click', this.hideAddLinkForm.bind(this));

    // Show edit link
    var links = this.$el.querySelectorAll('.link');
    Array.prototype.forEach.call(links, function(link) {
        link.addEventListener('dblclick', this.showAddLinkForm.bind(this));
    }, this);

    // Delete link
    var deleteBtns = this.$el.querySelectorAll('.link-delete');
    Array.prototype.forEach.call(deleteBtns, function(btn) {
        btn.addEventListener('click', this.deleteLink.bind(this));
    }, this);

    // Recherche
    this.$el.querySelector('.search').addEventListener('keyup', this.search.bind(this));

};

LinksView.prototype.render = function render() {
    this.$el.innerHTML = _.template(this.tpl, {});
    this.renderTop();
    this.renderLinkList();

    this.bindEvent();
};

LinksView.prototype.renderTop = function renderTop() {
    var $linkTop = this.$el.querySelector('#top-wrapper');
    $linkTop.innerHTML = _.template(this.topTpl, {nbLinks: this.links.length});
};

LinksView.prototype.renderLinkList = function renderLinkList() {
    var $linkList = this.$el.querySelector('#list-wrapper');
    var html = _.template(this.listTpl, {links: this.getDisplayedLinks()});
    $linkList.innerHTML = html;
};

LinksView.prototype.search = function search(e) {
    var query = new RegExp(e.target.value, 'i');

    var links = this.links.filter(function(link) {
        return query.test(link.label) || query.test(link.url) || query.test(link.tags);
    });

    this.setDisplayedLinks(links);

    this.renderLinkList();
};

LinksView.prototype.getDisplayedLinks = function getDisplayedLinks() {
    return this._displayedLinks.length > 0 ? this._displayedLinks : this.links;
};

LinksView.prototype.setDisplayedLinks = function setDisplayedLinks(links) {
    this._displayedLinks = links;
};

LinksView.prototype.showAddLinkForm = function showAddLinkForm(e) {
    e.preventDefault();

    var formWrapper = this.$el.querySelector('.add-link-form');

    var $link = null;
    if (e.target.classList.contains('link')) {
        $link = e.target
    } else {
        var node = e.target;
        while(!$link && node.parentNode) {
            if (node.classList.contains('link')) {
                $link = node;
            } else {
                node = node.parentNode;
            }
        }
    }

    if ($link) {
        var id = $link.getAttribute('data-link-id');
        var link = this.links.filter(function(link) {
            return Number(id) === Number(link.id);
        })[0];
        formWrapper.querySelector('[name="label"]').value = link.label;
        formWrapper.querySelector('[name="url"]').value = link.url;
        formWrapper.querySelector('[name="tags"]').value = link.tags;
        formWrapper.querySelector('[name="id"]').value = link.id;
    }

    formWrapper.classList.remove('height0');
};

LinksView.prototype.hideAddLinkForm = function hideAddLinkForm() {
    this.$el.querySelector('.add-link-form').classList.add('height0');
};

LinksView.prototype.addLink = function addLink(e) {
    e.preventDefault();

    var label = e.target.querySelector('[name="label"]').value;
    var url = e.target.querySelector('[name="url"]').value;
    var tags = e.target.querySelector('[name="tags"]').value;
    var id = e.target.querySelector('[name="id"]').value;

    var link = {
        label: label,
        url: url,
        tags: tags
    }

    var view = this;

    if (id !== "") {
        this.socket.put('/links/' + id, link, function(res) {
            view.init();
        });
    } else {
        this.socket.post('/links/create', link, function(res) {
            view.init();
        });
    }

};

LinksView.prototype.deleteLink = function deleteLink(e) {
    var linkId = e.target.getAttribute('data-link-id');
    var view = this;
    socket.delete('/links/' + linkId, function(resp) {
        view.init();
    });
};


module.exports = LinksView;