var express = require("express"),
    EE = require('events').EventEmitter,
    fs = require("fs"),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;


var app = module.exports = express();

app.use(express.static(__dirname));
app.use(express.bodyParser());

var Events = new EE;

var db = {
    connect: function() {
        var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost:27017/links";

        MongoClient.connect(mongoUri, function(err, db) {
            Events.emit('db connected', db);
        });
    },
    find: function(collection) {
        Events.on('db connected', function callback(db) {
            var coll = db.collection(collection);
            coll.find().toArray(function (err, items) {
                Events.emit('db find', items);
            });

            Events.removeListener('db connected', callback);
        });
        this.connect();
    }
}

/* --- home page --- */
app.get("/", function(req, res) {
    res.send(fs.readFileSync(__dirname+"/views/home.html").toString());
});

/* --- tag list --- */
app.get("/tags", function(req, res) {
    Events.on('db find', function f (items) {
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
        Events.removeListener('db find', f);
    })
    db.find('links');
});

/* --- Links --- */
app.get("/links", function(req, res) {
    Events.on('db find', function f(items) {
        res.json(items);

        Events.removeListener('db find', f);
    });
    db.find('links');
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