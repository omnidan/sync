exports.root = function(req, res) {
    res.jsonp({message: "Use /sessions or /version"});
}

exports.version = function(req, res) {
    res.jsonp({name: "TouchLay Sync", version: "0.0.1"});
}
