console.log("I'm a swallowed console.log");

const {Reporter} = require('@parcel/plugin');

module.exports = new Reporter({
  async report(event) {
     log(event.type);
     if( event.type === 'buildSuccess' ){
       log('s1');
       try {
       const bundles = event.bundleGraph.getBundles();
       log(bundles.length);
       log(Object.keys(bundles[0]).length);
       log(bundles[0].id);
       log(bundles[0].type);
       log(bundles[0].filePath);
       log(bundles[0].env.engines.browsers);
       log(bundles[0].stats.size);
         log('s2');
       } catch(err) {
         log('err');
         log(err.stack);
       }
       log('s3');
     }
  }
});

function log(msg) {
  process.stdout.write(msg+'\n');
}
