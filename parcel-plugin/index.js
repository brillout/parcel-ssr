throw new Error("I'm a swallowed error");

const {Reporter} = require('@parcel/plugin');

module.exports = new Reporter({
  async report(event) {
     process.stdout.write('\n\n'+event.type+'\n\n');
  }
});
