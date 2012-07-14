/** ******************************************* **
 *	@Author		Dorin Grigoras	[www.stepofweb.com]
 *	@Date		Monday, July 09, 2012
 *	@Info		Code come from moustache because of cache! 
				Should be rewritten soon!
 ** ******************************************* **/
var util     		= require('util'),
    fs       		= require('fs'),
    path     		= require('path'),
    Stream   		= require('./nsmarty/stream'),
    parser   		= require('./nsmarty/parser'),
    renderer 		= require('./nsmarty/renderer'),
    errors   		= require('./nsmarty/errors');

var nsmarty 		= module.exports = {};

nsmarty.tpl_path 	= process.cwd();
nsmarty.cache 		= {};

nsmarty.fs = function (filename, callback) {
  filename = filename.indexOf('/') === 0 || filename.indexOf(':\\') === 1 ? filename : path.join(nsmarty.tpl_path, filename);
  fs.readFile(filename, 'utf8', callback);
}

/** ******************************************* **
 *	@Template Compiler
 ** ******************************************* **/
nsmarty.compile = function(filename, params, callback, unique) {
  var parsed,
      unique = unique || {};

  nsmarty.fs(filename, function (err, contents) {
    if (err) {
      return callback(err);
    }
    
    parsed = parser.parse(contents, params, nsmarty.tpl_path);
	// console.log(parsed);
    nsmarty.cache[filename] = [parsed, unique];
    var i = 0;
    (function next(err) {
      if (err) {
        return callback(err);
      }

      if (i < parsed.partials.length) {
        nsmarty.compile(parsed.partials[i], next, unique);
        i++;
        
      } else {
        callback(undefined, [parsed, {}]);
      }
    }());
  });
}

/** ******************************************* **
 *	@Compile Text
 ** ******************************************* **/
nsmarty.compileText = function(name, template, callback) {
  var parsed;
  
  if (typeof template === 'undefined') {
    template = name;
    name = undefined;
  }
  
  try {
    parsed = parser.parse(template);
    
    if (name) {
      nsmarty.cache[name] = [parsed, {}];
    }

    if (callback) callback(undefined, parsed); else return parsed;
    
  } catch (err) {
    if (callback) callback(err); else throw err;
  }
}

/** ******************************************* **
 *	@Renders the previously parsed
 ** ******************************************* **/
nsmarty.render = function (filenameOrParsed, params) {
  var stream,
      parsed = typeof filenameOrParsed === 'object' ?
                  filenameOrParsed :
                  nsmarty.cache[filenameOrParsed];
  
  if (parsed) {
    return beginRender(parsed[0].tokens, params, nsmarty.cache);
  } else {
    throw new Error('template_not_in_cache'); //errors.templateNotInCache(filename)));
  }
}

nsmarty.renderText = function (template, params, partials) {
  var name, parsed, tokens, stream;
  
  partials = partials || {};
  partials = shallowCopy(partials);
  partials.__proto__ = nsmarty.cache;
  
  for (name in partials) {
    if (partials.hasOwnProperty(name) && !partials[name].tokens) {
      partials[name] = parser.parse(partials[name]);
    }
  }
  
  parsed = parser.parse(template);
  tokens = parsed.tokens;
  
  return beginRender(tokens, params, partials);
}

/** ******************************************* **
 *	@Clear Cache
 ** ******************************************* **/
nsmarty.clearCache = function (templateName) {
  if (templateName) {
    delete nsmarty.cache[templateName];
  } else {
    nsmarty.cache = {};
  }
};

/** ******************************************* **
 *	@Assign
 ** ******************************************* **/
nsmarty.assign = function (templateName, params) {
  var stream = new Stream();
  var parsed = nsmarty.cache[templateName];
  
  if (parsed) {
    beginRenderWithStream(parsed[0].tokens, params, nsmarty.cache, stream);
  } else {
    nsmarty.compile(templateName, params, function (err, parsed) {
      if (err) return stream.emit('error', err);
      beginRenderWithStream(parsed[0].tokens, params, nsmarty.cache, stream);
    });
  }
  
  return stream;
};


/** ******************************************* **
 *	@PRIVATE API
 ** ******************************************* **/
var BUFFER_LENGTH = 1024 * 8;

function beginRender(tokens, params, partials) {
  var stream = new Stream();
  beginRenderWithStream(tokens, params, partials, stream);
  return stream;
}

function beginRenderWithStream(tokens, params, partials, stream) {
  var count = 0;
  
  process.nextTick(function () {
    try {
      renderer.render(tokens, params, partials, stream, function () {
        stream.emit('end');
      });
    } catch (err) {
      stream.emit('error', err);
    }
  });
}

function shallowCopy(obj) {
  var o = {};
  
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      o[key] = obj[key];
    }
  }
  
  return o;
}