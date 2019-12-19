const {Transformer} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

let codes = [
];

module.exports = new Transformer({
  async transform({asset, options, config}) {
    const {filePath} = asset;
    log(filePath);
    assert(['node', 'browser'].includes(asset.env.context));
    if( asset.env.context !== 'browser' ){
      return [asset];
    }
    if( ! filePath.endsWith('hello.js') ){
      return [asset];
    }

    /*
    const moduleSpecifier = './dummy.js';
    asset.addDependency({moduleSpecifier});
    */
    let code = await asset.getCode();
    code = code.replace("require('./msg');", "require('./msg2');");
    code = "require('./msg2.js');";
    code = "require('./dummy.js');";
    log(code);
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
  console.log('');
  console.log(...msg);
  console.log('');
}
