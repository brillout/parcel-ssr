const {Runtime} = require('@parcel/plugin');

module.exports = new Runtime({
  apply({bundle, bundleGraph, options}) {
    log('aa');
    log(bundle.name);
    log(bundle.filePath);
    log('bb');
    return {
      filePath: __filename,
      code: "console.log('helo frm prl rtm');",
      isEntry: true
    };
  }
});

function log(msg) {
  process.stdout.write(msg+'\n');
}
