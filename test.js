var _ = require('underscore');

xml = require('./index.js');

function external_contrib() {
    _.chain(3).range().each(function(i) {
        this('provided_' + i)('child_' + i)()()
    }, this);
}


xml(eventListeners( { indent: '  '} ))
('root', {
    'name': 'value'
})
    ('empty child')()
    ('child with text')
        .text('xxxxxx xxxxxxx')
    ()
    ('child with text 2')
        (['xxxxxx xxxxxxx', 'yyyy yyyyyyy'])
    ()
    (external_contrib)
    (function inline_contrib() {
        this('inline')()
    })
    ('parent')
        ('child')
        ()
    ()
();

function eventListeners(config) {
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
}
