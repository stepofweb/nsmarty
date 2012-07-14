exports.fileNotFound = function (tpl_path, filename, error) {
  return {
    rootError: error,
    key: 'file_not_found',
    message: 'File not found to compile: ' + path.join(tpl_path, filename)
  }
};

exports.templateNotInCache = function (filename) {
  return {
    key: 'template_not_in_cache',
    message: filename + ' was not found in cache. Has it been compiled?'
  }
};
