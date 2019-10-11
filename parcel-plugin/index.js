console.log("I'm a swallowed console.log");

const {Reporter} = require('@parcel/plugin');

module.exports = new Reporter({
  async report(event) {
     process.stdout.write('\n\n'+event.type+'\n\n');
  }
});
