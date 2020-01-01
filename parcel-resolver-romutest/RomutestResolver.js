const {Resolver} = require('@parcel/plugin');

module.exports = new Resolver({
  async resolve({dependency, options, filePath}) {
    log('resoll', filePath);
    if( filePath!=='|romu-test|virtualHtml.html' ){
      return null;
    }
    const result = {};
 // result.filePath = 'virtual|'+filePath;
    result.filePath = require.resolve('./dummy51.html');
    result.code = '<html>hti from resol</html>';
    log('passiiii '+filePath);
    return result;
  }
});

function log(...msg) {
  console.log('');
  console.log(...msg);
  console.log('');
}
