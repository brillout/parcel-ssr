const {Transformer} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Transformer({
  async transform({asset, options, config}) {
    assert(['node', 'browser'].includes(asset.env.context));
    if( asset.env.context !== 'browser' ){
      return [asset];
    }
    if( ! asset.filePath.endsWith('hello.js') ){
      return [asset];
    }

    let code = await asset.getCode();
    code = code.replace("require('./msg');", "require('./msg2');");
    log('code', code);
    return [{
      type: 'js',
      code,
      /*
      addHydrationRuntime(asset),
      asset,
      */
   // renderToHtmlAsset(asset),
    }];
  }
});

function addHydrationRuntime(asset) {
  return {
    type: 'js',
    code: "console.log('hello from hydri');",
  //code: "console.log('hello from hydri'); const ha = require('"+asset.filePath+"'); console.log(ha);",
  //code: "console.log('hello from hydri'); const ha = require('./hello.js'); console.log(ha);",
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

function log(...msg) {
  console.log(...msg);
  console.log('');
}
