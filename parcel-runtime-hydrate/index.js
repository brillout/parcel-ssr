const {Runtime} = require('@parcel/plugin');

module.exports = new Runtime({
  apply({bundle, bundleGraph, options}) {
    log('aa');
    log(bundle.name);
    log(bundle.filePath);
    const entries = bundle.getEntryAssets();
    log(entries.length);
    const src = bundle.getMainEntry();
    log('ii1');
    log(entries[0].id);
    log(src.id);
    log('ii2');
    const filePath = src.filePath;
    log(filePath);
    log('bb');
    log('cc');
    if( filePath.endsWith('LandingPage.js') ) {
 // if( bundle.filePath.endsWith('.page.js') ) {
      return {
        filePath: __filename,
        code: "const p = parcelRequire('"+src.id+"');console.log('helo frm prl rtm', p);",
        isEntry: true
      };
    }
  }
});

function log(msg) {
  process.stdout.write(msg+'\n');
}
