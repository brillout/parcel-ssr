const {Runtime} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Runtime({
  apply({bundle, options}) {
    const mainEntry = bundle.getMainEntry();
    if( mainEntry.filePath.endsWith('LandingPage.js') ) {
 // if( bundle.filePath.endsWith('.page.js') ) {
      const code = generateRuntimeCode(mainEntry);
      return {
        filePath: __filename,
        code,
        isEntry: true
      };
    }
  }
});

function log(msg) {
  process.stdout.write(msg+'\n');
}

function generateRuntimeCode(pageAsset) {
  return [
    "const page = require('"+getRequirePath(pageAsset.filePath)+"').default;",
    "const renderToDom = require('"+getRequirePath(require.resolve('../render/renderToDom'))+"').default;",
    "const hydratePage = require('./hydratePage').default;",
    "hydratePage({page, renderToDom});",
  ].join('\n');
};

function getRequirePath(filePath) {
  assert(path.isAbsolute(filePath));
  return path.relative(__dirname, filePath);
}
