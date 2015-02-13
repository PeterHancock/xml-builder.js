var _ = require('underscore')

Handler = function (writer) {
    this.writer = writer;
    this.padding = [''];
}

Handler.prototype = {
  start: function (name, atts) {
  var padding = this.padding
  var pad = padding[padding.length - 1]
  padding.push(pad + Handler.indent)
  var attstr = ''
  if (atts) {
    attstr = _(atts).reduce(function(memo, v, k) {
      return memo + ' ' + k + '="' + v + '"';
    }, '')
  }
  this.writer(pad + '<' + name + attstr + '>')
},
  end: function (name) {
    this.padding.pop()
    this.writer(this.padding[this.padding.length - 1] + '</' + name + '>')
  },
  text: function (text) {
    this.writer(this.padding[this.padding.length - 1] + text)
  }
}

Handler.indent = '   '

function xml(handler) {
  var context = {
    start: function(name, atts) {
      context.stack.push(name)
      handler.start(name, atts)
    },
    end: function() {
      handler.end(context.stack.pop())
    },
    text: function(text) {
      handler.text(text)
      return builder
    },
    stack: []
  }

  var builder = function () {
    var args =  Array.prototype.slice.call(arguments);
    switch (args.length) {
      case 0:
        context.end()
        break;
      case 1:
        if (_(args[0]).isString()) {
          context.start.apply(context, args)
        } else if (_(args[0]).isFunction()) {
          args[0].call(builder)
        } else if (_.isArray(args[0])) {
          _(args[0]).each(function(text) {
            context.text(text)
          })
        }
        break;
      case 2:
        context.start.apply(context, args)
        break;

      default:
    }
    return builder;
  }

  builder.text = context.text;

    return builder;
  }


//----------------

var handler = new Handler(console.log.bind(console))

function configure () {
  _.chain(10).range().each(function (i) { this('provided_' + i)('child_' + i)()() }, this);
}

xml(handler)
('root', {'name': 'value'})
  ('empty child')()
  ('child with text')
    .text('xxxxxx xxxxxxx')
  ()
  ('child with text 2')
    (['xxxxxx xxxxxxx', 'yyyy yyyyyyy'])
  ()
  (configure)
  (function () { this('inline')() })
  ('parent')
    ('child')
    ()
  ()
();
