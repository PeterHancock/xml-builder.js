var _ = require('underscore');

module.exports =  function (config) {
    config = config || {};
    var indent = config.indent || '    ';
    var padding  = [''];
    var writer = config.writer || console.log.bind(console);
    var start = function(name, atts) {
        var pad = padding[padding.length - 1]
        padding.push(pad + indent)
        var attstr = ''
        if (atts) {
            attstr = _(atts).reduce(function(memo, v, k) {
                return memo + ' ' + k + '="' + v + '"';
            }, '')
        }
        writer(pad + '<' + name + attstr + '>')
    }
    var end = function (name) {
        padding.pop();
        writer(padding[padding.length - 1] + '</' + name + '>');
    }
    var text = function(text) {
        writer(padding[padding.length - 1] + text);
    }

    return function() {
        this.on('start', start)
        .on('end', end)
        .on('text', text);
    }
};
