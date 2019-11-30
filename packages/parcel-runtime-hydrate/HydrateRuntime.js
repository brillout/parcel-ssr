const {Runtime} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Runtime({
  async apply({bundle, options}) {
    const mainEntry = bundle.getMainEntry();
    console.log('mm');
    console.log(mainEntry.filePath);
    console.log(bundle.type);
    console.log(mainEntry.type);
    const assets = bundle.getEntryAssets();
    assets.forEach(asset => {
      console.log('ep', asset.type);
    });
    console.log('ll', assets.length);
    console.log('-----------');
    console.log('-----------');
    console.log('-----------');
    console.log('-----------');
    console.log('-----------');
    console.log('-----------');
    console.log('mm2');
    if( mainEntry.type!=='js' ){
      return;
    }
    if( !isPage(mainEntry) ){
      return;
    }
    // getUserFiles({options});
    return {
      filePath: __filename,
      code: await generateRuntimeCode({mainEntry, options}),
      isEntry: true
    };
  }
  /* Parcel runtimes have no `loadConfig`
  loadConfig,
  */
});

function isPage(mainEntry) {
  const fileName = path.basename(mainEntry.filePath);
  assert(isPageFile('LandingPage.js')===false);
  assert(isPageFile('landing.page.js')===true);
  assert(isPageFile('landing.page.jsx')===true);
  assert(isPageFile('landing.page.tsx')===true);
  return isPageFile(fileName);
  function isPageFile(fileName) { return fileName.split('.').includes('page'); }
}

function getBaseDir(options) {
  assert(options.projectRoot===options.rootDir);
  return options.projectRoot;
}

async function generateRuntimeCode({mainEntry, options}) {
  const page__path = mainEntry.filePath;
  const renderToDom__path = await get_renderToDom__path({mainEntry, options});
  return [
    // TODO - use `addIncludedFile` to enable watching for `page__path` and `renderToDom__path`
    //  - But: `config.addIncludedFile` is not availble to Runtime
    "const page = require('"+getRequirePath(page__path)+"').default;",
    "const renderToDom = require('"+getRequirePath(renderToDom__path)+"').default;",

    "const hydratePage = require('./hydratePage').default;",
    "hydratePage({page, renderToDom});",
  ].join('\n');
};
function getRequirePath(filePath) {
  assert(path.isAbsolute(filePath));
  // Ensure that file exists
  require.resolve(filePath);
  return path.relative(__dirname, filePath);
}
async function get_renderToDom__path({mainEntry, options}) {
  // TODO: use `loadConfig` to load a `.parcel-ssr.json` file
  //  - But: `loadConfig` is not available to Runtime
  const pkg = await mainEntry.getPackage();
  const ssrConfig = pkg['.parcel-ssr.json'];
  assert(ssrConfig);
  let renderToDom__path = ssrConfig.renderToDom;
  assert(renderToDom__path);

  let baseDir = getBaseDir(options);
  assert(path.isAbsolute(baseDir));
  // TODO - right a proper fix
  //  - But: there seem to be no way to get the package.json path
  baseDir = path.join(baseDir, 'example');
  // Ensure that baseDir is correct
  assert(require(path.join(baseDir, 'package.json'))['.parcel-ssr.json'].renderToDom === renderToDom__path);

  renderToDom__path = path.join(baseDir, renderToDom__path);
  assert(path.isAbsolute(renderToDom__path));

  return renderToDom__path;
}

function log(msg) {
  process.stdout.write('----'+'\n');
  process.stdout.write(msg+'\n');
  process.stdout.write('----'+'\n');
}


/* Experimental attempts */

/*
async loadConfig({config, options}) {
  const configResult = await config.getConfig(['.parcel-ssr.json']);
  let renderToDomFile = (
    configResult && configResult.renderToDom ? (
      path.join(path.dirname(config.resolvedPath), configResult.renderToDom)
    ) : (
      path.join(options.projectRoot, './render/renderToDom')
    )
  );
  try {
    renderToDomFile = await resolve(renderToDomFile);
  } catch(err) {
    // TODO: how to add error log?
    console.error("No `renderToDom` function found. You should define one at "+renderToDomFile+".");
    throw err;
  }
  config.addIncludedFile(renderToDomFile);
  config.setResult({renderToDomFile});

  return;

  function resolve(id) {
    return options.packageManager.resolve(id, config.searchPath);
  }
}
*/
