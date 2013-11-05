var _ = require('underscore');

_.templateSettings = {
    interpolate: /---=(.+?)---/g,
    evaluate: /---(.+?)---/g
};

module.exports = _;