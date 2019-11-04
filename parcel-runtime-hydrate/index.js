const {Runtime} = require('@parcel/plugin');
const path = require('path');

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
    const filePathRelative = path.relative(__dirname, filePath);
    log(filePath);
    log(filePathRelative);
    log('bb');
    log('cc');
    return {
      filePath: __filename,
      code: "const expValue = require('"+filePathRelative+"');console.log('helo frm prl rtm', expValue);",
      isEntry: false
    };
  }
});

function log(msg) {
  process.stdout.write(msg+'\n');
}
