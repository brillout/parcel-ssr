const {Transformer} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Transformer({
  async transform({asset, options, config}) {
    assert(['node', 'browser'].includes(asset.env.context));
    if( asset.env.context ==='browser' ){
   // const code = await asset.getCode();
      console.log('111'+code+'222333333333333333333333333333333333333333\n\n');
      return [
        asset,
        addHydrationRuntime(asset),
     // renderToHtmlAsset(asset),
      ];
    }
    return [asset];
  }
});

function addHydrationRuntime(asset) {
  return {
    type: 'js',
    code: 'console.log("hello from hydri");',
  };
}

function renderToHtmlAsset(asset) {
  return {
    type: 'html',
    code: '<html>transformer plugin test<div>__STATIC_RENDER_TRANSFORMER__</div></html>',
    uniqueKey: (asset.uniqueKey||asset.id)+'_transformer-static-render-plugin',
    isIsolated: false,
    isInline: false,
    meta: {
      type: 'tag',
   // node
    }
  };
}
