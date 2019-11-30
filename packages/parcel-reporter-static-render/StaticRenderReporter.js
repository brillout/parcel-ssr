const {Reporter} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Reporter({
  async report({event, options, logger}) {
    if( event.type !== 'buildSuccess' ) {
      return;
    }
    const bundles = event.bundleGraph.getBundles();
    bundles.forEach(bundle => {
        console.log(bundle.filePath);
        const mainEntry = bundle.getMainEntry();
        const {context} = mainEntry.env;
        assert(['node', 'browser'].includes(context));
        assert(['js', 'html'].includes(mainEntry.type), mainEntry.type);
        /*
        if( context.type==='js' ){
          const pageView = require(filePath);
        }
        */
        console.log(context);
        console.log('me');
        console.log(mainEntry.filePath);
        const entryAssets = bundle.getEntryAssets();
        console.log('entryAssets');
        entryAssets.forEach(asset => {
          console.log(asset.filePath);
        });
        console.log('end');
    });
    /*
    assert(isPage(asset));
    assert(['node', 'browser'].includes(asset.env.context));
    if( asset.env.context ==='node' ){
   // const code = await asset.getCode();
   // console.log('111'+code+'222333333333333333333333333333333333333333\n\n');
      return [asset, renderToHtmlAsset(asset)];
    }
    return [asset];
    */
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


function log(msg) {
  process.stdout.write('----'+'\n');
  process.stdout.write(msg+'\n');
  process.stdout.write('----'+'\n');
}


