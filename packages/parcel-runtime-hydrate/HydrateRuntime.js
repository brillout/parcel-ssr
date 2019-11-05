const {Runtime} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Runtime({
  apply({bundle, options}) {
    const mainEntry = bundle.getMainEntry();
    const fileName = path.basename(mainEntry.filePath);
    if( fileName.split('.').includes('page') ) {
      return {
        filePath: __filename,
        code: generateRuntimeCode(mainEntry),
        isEntry: true
      };
    }
  }
});

/*
function log(msg) {
  process.stdout.write(msg+'\n');
}
*/

function generateRuntimeCode(pageAsset) {
  return [
    "const page = require('"+getRequirePath(pageAsset.filePath)+"').default;",

    // TODO - how can we automatically get the path of the user's `renderToDom`?
    "const renderToDom = require('"+getRequirePath(require.resolve('../../example/render/renderToDom'))+"').default;",

    "const hydratePage = require('./hydratePage').default;",
    "hydratePage({page, renderToDom});",
  ].join('\n');
};

function getRequirePath(filePath) {
  assert(path.isAbsolute(filePath));
  return path.relative(__dirname, filePath);
}
