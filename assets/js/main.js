var store = {
    baseUrl: "/",
    data: [],

    load: function(data) {
        store.data = data;
        $(store).trigger('data.loaded');
    },
    add: function(data) {
        $(store).trigger('data.added');
        $.post(this.baseUrl, data, function(json) {
            store.data.push(data);
        }, 'json').complete(function() {
            $(store).trigger("data.added");
        });
    },
    update: function(id, data) {
        var obj = this.findById(id);
        obj = _.extend(obj, data);
        $.ajax({
            url: this.baseUrl + "/" + id,
            method: "put",
            data: obj
        }).complete(function() {
            $(store).trigger("data.added");
        });
    },
    destroy: function(obj) {
        var index = _.indexOf(store.data, obj);
        store.data.splice(index, 1);
        $.ajax({
            url: this.baseUrl + "/" + obj._id + "/delete",
            method: "get"
        });
    },
    findById: function(id) {
        return _.filter(store.data, function(data) {
            return data._id == id
        })[0];
    },
    search: function(query) {
        if (query instanceof Function) {
            return _.filter(store.data, query);
        } else {
            return _.filter(store.data, function(data) {
                return data.label.match(query)
            });
        }
    }
};

var loadLinks = function() {
    $.getJSON("/links", $.proxy(function(json) {
        store.load(json);
    }, this));
};

var getTags = function() {
    $.getJSON("/tags", $.proxy(function(json) {
        $(document).trigger("tagsLoaded", [json]);
    }, this));
}

var display = function(data) {
    // Search template
    var tpl = $("#link-list-template").html();
    var html = _.template(tpl, {links: data});
    $(".page-wrapper").html(html);
};
var displayTagTool = function(tagList) {
    var tpl = $("#tags-tool-template").html();
    var html = _.template(tpl, {tags: tagList});
    $(".tool.tags").html(html);
}

var linkForm = function(link) {
    var tpl = $("#link-form-template").html();
    if (link == undefined) {
        var link = {label:"", url:""};
    }
    var html = _.template(tpl, {link: link});
    $("#form-placeholder").html(html);
};

$(document).ready(function() {
    $.ajax({async: false});

    $(document).on("tagsLoaded", function(e, json) {
        displayTagTool(json);
    });

    $("body").on('change', '#tags-filter', function(e) {
        var query = $(this).val();
        var rs = store.search(function(data) {
            console.log(data, query, data.tags);
            return data.tags.match(query);
        });
        display(rs);
    });

    loadLinks();
    getTags();

    store.baseUrl = "/links";

    $(store).on("data.loaded", function() {
        display(store.data);
    });

    $(store).on("data.added", function() {
        display(store.data);
    });

    $("#search").on("keyup", function(e) {
        if ($(this).val() == "") {
            display(store.data);
        } else {
            display(store.search($(this).val()));
        }
    });

    $(".toolbar").on('click', "#add-link", function(e) {
        e.preventDefault();
        linkForm();
    });

    $(".page-wrapper").on("reset", "#link-form", function(e) {
       display(store.data);
    });

    $(".page-wrapper").on("submit", "#link-form", function(e) {
        console.log("submit form");
        e.preventDefault();

        var formObj = {
            label: $(this).find("input[name='label']").val(),
            url: $(this).find("input[name='url']").val(),
            tags:$(this).find("input[name='tags']").val()
        }

        if ($(this).find("input[name='id']").length) {
            var id = $(this).find("input[name='id']").val();
            store.update(id, formObj);
            display(store.data);
        } else {
            store.add(formObj);
        }
    });

    $(".page-wrapper").on("click", ".edit", function(e) {
        e.preventDefault();
        var linkId = $(this).attr("data-link-id");
        var link = store.findById(linkId);
        linkForm(link);
    });

    $(".page-wrapper").on("click", ".delete", function(e) {
        e.preventDefault();
        var linkId = $(this).attr("data-link-id");
        var link = store.findById(linkId);
        store.destroy(link);
        display(store.data);
    });

    $(".page-wrapper").on("click", ".link-item input[type='checkbox']", function(e) {
        $linkItem = $(this).parents(".link-item");
        $linkItem.data("selected", ! $(this).data("selected"));
        $linkItem.toggleClass("selected");
        $(document).trigger("item.selected", $(this));
    });

    $(document).on("item.selected", function(item) {
        var nbItem = $(".selected").length;
        $("#info").html(nbItem+" items selected");
    });
});