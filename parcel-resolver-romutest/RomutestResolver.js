const {Resolver} = require('@parcel/plugin');

module.exports = new Resolver({
  async resolve({dependency, options, filePath}) {
    const result = {};
    result.code = '<html>hti from resol</html>';
    return result;
  }
});
