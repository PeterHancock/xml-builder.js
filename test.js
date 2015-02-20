var _ = require('underscore');

var xml = require('./index.js');

var serializer = require('./serializer.js');

function external_contrib() {
    _.chain(3).range().each(function(i) {
        this('provided_' + i)('child_' + i)()()
    }, this);
}


xml(serializer( { indent: '  '} ))
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
