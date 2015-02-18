var _ = require('underscore');

var EventEmitter2 = require('eventemitter2').EventEmitter2;

function xml(config) {

  var stack = [];

  var start = function(name, atts) {
    stack.push(name);
    builder.emit('start', name, atts);
  }

  var end = function() {
    builder.emit('end', stack.pop());
  }

  var text = function(text) {
    builder.emit('text', text);
    return builder;
  }

  var builder = function() {
    var args = Array.prototype.slice.call(arguments);
    switch (args.length) {
      case 0:
        end()
        break;
      case 1:
        if (_(args[0]).isString()) {
          start.apply(null, args)
        } else if (_(args[0]).isFunction()) {
          args[0].call(builder)
        } else if (_.isArray(args[0])) {
          _(args[0]).each(function(txt) {
            text(txt);
          })
        }
        break;
      case 2:
        start.apply(null, args);
        break;

      default:
    }

    return builder;
  }

  _.extend(builder, EventEmitter2.prototype);

  EventEmitter2.call(builder);

  builder.text = text;

  if (_(config).isFunction()) {
    return builder(config);
  } else {
    return builder;
  }
}

module.exports = xml;
