const {Runtime} = require('@parcel/plugin');
const path = require('path');

module.exports = new Runtime({
  apply({bundle, bundleGraph, options}) {
    const src = bundle.getMainEntry();
    const filePath = src.filePath;
    const filePathRelative = path.relative(__dirname, filePath);
    return {
      filePath: __filename,
      code: "const expValue = require('"+filePathRelative+"');console.log('helo frm prl rtm', expValue);",
      // What does `isEntry` mean in the context? Isn't every runtime an entry?
      isEntry: true
    };
  }
});

function log(msg) {
  process.stdout.write(msg+'\n');
}
