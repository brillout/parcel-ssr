const {Transformer} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Transformer({
  async transform({asset, options, config}) {
    assert(isPage(asset));
    assert(['node', 'browser'].includes(asset.env.context));
    if( asset.env.context ==='browser' ){
   // const code = await asset.getCode();
   // console.log('111'+code+'222333333333333333333333333333333333333333\n\n');
      return [asset, renderToHtmlAsset(asset)];
    }
    return [asset];
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
    code: '<html>transformer plugin test<div>__STATIC_RENDER_TRANSFORMER__</div></html>',
    uniqueKey: (asset.uniqueKey||asset.id)+'_transformer-static-render-plugin',
    isIsolated: true,
    isInline: true,
    meta: {
      type: 'tag',
   // node
    }
  };
}
