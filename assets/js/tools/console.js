if (window) {
    if (!window.hasOwnProperty('console')) {
        window.console = {
            log: function() {},
            info: function() {},
            warn: function() {},
            error: function() {}
        }
    }
}