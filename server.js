var express = require("express");
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var app = module.exports = express();

app.use(express.static(__dirname));
app.use(express.bodyParser());

/* --- home page --- */
app.get("/", function(req, res) {
    res.send(fs.readFileSync(__dirname+"/views/home.html").toString());
});

/* --- tag list --- */
app.get("/tags", function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/links", function(err, db) {
        if(!err) {
            var links = db.collection('links');
            links.find().toArray(function(err, items) {
                if (err) {
                    res.send(500);
                }

                var tags = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].tags && items[i].tags != "") {
                        var aTags = items[i].tags.split(';');
                        for (y in aTags) {
                            if (tags.indexOf(aTags[y]) < 0) {
                                tags.push(aTags[y]);
                            }
                        }
                    }
                }
                res.send(tags);
            });
        }
    });
});

/* --- Links --- */
app.get("/links", function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/links", function(err, db) {
        if(!err) {
            var links = db.collection('links');
            links.find().toArray(function(err, items) {
                if (err) {
                    res.send(500);
                }
                res.json(items);
            });
        }
    });
});
app.post("/links", function(req, res) {
    var link = {};
    link.label = req.body.label;
    link.url = req.body.url;
    link.tags = req.body.tags;

    MongoClient.connect("mongodb://localhost:27017/links", function(err, db) {
        if(!err) {
            var links = db.collection('links');
            links.insert(link, function(err, result) {
                res.json(result[0]);
            });
        }
    });
});
app.put("/links/:id", function(req, res) {
    var id = req.params.id;
    var link = req.body;

    MongoClient.connect("mongodb://localhost:27017/links", function(err, db) {
        if(!err) {
            var links = db.collection('links');
            links.update({_id: ObjectID(link._id)}, {$set: {label: link.label, url: link.url, tags: link.tags}}, function(err, result) {
                if (err) {
                    res.send(500);
                } else {
                    res.send(200);
                }
            })
        }
    });
});
app.delete("/links/:id", function(req, res) {
    res.send(200);
    var id = req.params.id;

    MongoClient.connect("mongodb://localhost:27017/links", function(err, db) {
        if(!err) {
            var links = db.collection('links');
            links.remove({_id: ObjectID(id)}, function(err, rs) {});
        }
    });
});

app.listen(3000);