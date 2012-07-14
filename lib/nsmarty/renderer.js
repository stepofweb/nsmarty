var BUFFER_LENGTH = 1024 * 8;

var parser = require('./parser');

exports.render = render;

function render(tokens, context, partials, stream, callback) {
  if (!Array.isArray(context)) {
    context = [context];
  }

  return _render(tokens, context, partials, stream, callback);
}

function _render(tokens, context, partials, stream, callback) {
	var i = 1;
  
	function next() {
		try {

			var token = tokens[i++];

			if (!token) {
				return callback ? callback() : true;
			}

			stream.emit('data', token[2]);
			return next();

		} catch (err) {
			stream.emit('error', err);
			next();
		}
	}
  
  next();
}
