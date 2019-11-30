const {Runtime} = require('@parcel/plugin');

module.exports = new Runtime({
  async apply({bundle}) {
    if( bundle.type!=='js' ){
      return;
    }
    return {
      filePath: __filename,
      code: [
        "const pageView = require('../../example/pages/Hello.page.js').default;",
        "console.log(pageView);",
      ].join('\n'),
    };
  }
});
