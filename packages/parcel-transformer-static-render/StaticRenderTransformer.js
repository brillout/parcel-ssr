const {Transformer} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Runtime({
  transform({asset, options}) {
    assert(isPage(asset));
    return [asset, renderToHtmlAsset(asset)];
  }
});

function isPage(mainEntry) {
  const fileName = path.basename(mainEntry.filePath);
  assert(isPageFile('LandingPage.js')===false);
  assert(isPageFile('landing.page.js')===true);
  assert(isPageFile('landing.page.jsx')===true);
  assert(isPageFile('landing.page.tsx')===true);
  return isPageFile(fileName);
  function isPageFile(fileName) { return fileName.split('.').includes('page'); }
}

function renderToHtmlAsset(asset) {
  return {
    type: 'html',
    code: '<html>transformer plugin test</html>',
    uniqueKey: asset.uniqueKey+'_transformer-static-render-plugin',
    /*
    isIsolated: true,
    isInline: true,
    meta: {
      type: 'tag',
      node
    }
    */
  };
}
