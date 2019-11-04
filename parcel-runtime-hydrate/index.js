const {Runtime} = require('@parcel/plugin');
const path = require('path');

module.exports = new Runtime({
  apply({bundle, bundleGraph, options}) {
    const src = bundle.getMainEntry();
    const filePath = src.filePath;
    const filePathRelative = path.relative(__dirname, filePath);
    if( filePath.endsWith('LandingPage.js') ) {
 // if( bundle.filePath.endsWith('.page.js') ) {
      return {
        filePath: __filename,
        code: "const page = require('"+filePathRelative+"');console.log('helo frm prl rtm', page);",
        isEntry: true
      };
    }
  }
});

function log(msg) {
  process.stdout.write(msg+'\n');
}
