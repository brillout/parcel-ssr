const {Runtime} = require('@parcel/plugin');
const path = require('path');
const assert = require('assert');

module.exports = new Runtime({
  async apply({bundle, options}) {
    const mainEntry = bundle.getMainEntry();
    const pkg = await mainEntry.getPackage();
    log(Object.keys(pkg));
    log(pkg.parcelSSR.renderToHtml);
    log(pkg.parcelSSR.renderToDom);
    log(pkg.name);
    const baseDir = getBaseDir(options);
    log(baseDir);
    log(baseDir==='');
    log(JSON.stringify(baseDir));
    const renderToDomPath = await options.packageManager.resolve('./render/renderToDom.js'/*pkg.parcelSSR.renderToDom*/, baseDir);
    console.log(renderToDomPath);
    if( !isPage(mainEntry) ) {
      return;
    }
    return {
      filePath: __filename,
      code: generateRuntimeCode(mainEntry),
      isEntry: true
    };
  }
  /* Parcel runtimes have no `loadConfig`
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
  },
  //*/
});

function isPage(mainEntry) {
  const fileName = path.basename(mainEntry.filePath);
  assert(isPageFile('landing.page.js')===true);
  assert(isPageFile('LandingPage.js')===false);
  assert(isPageFile('landing.page.jsx')===true);
  assert(isPageFile('landing.page.tsx')===true);
  return isPageFile(fileName);
  function isPageFile(fileName) { return fileName.split('.').includes('page'); }
}

function getBaseDir(options) {
  assert(options.projectRoot===options.rootDir);
  return options.projectRoot;
}

function generateRuntimeCode(pageAsset) {
  return [
    // TODO - use `loadConfig` and `options.packageManager.resolve`
    "const page = require('"+getRequirePath(pageAsset.filePath)+"').default;",
    "const renderToDom = require('"+getRequirePath(require.resolve('../../example/render/renderToDom'))+"').default;",

    "const hydratePage = require('./hydratePage').default;",
    "hydratePage({page, renderToDom});",
  ].join('\n');
};
function getRequirePath(filePath) {
  assert(path.isAbsolute(filePath));
  return path.relative(__dirname, filePath);
}

function log(msg) {
  process.stdout.write('----'+'\n');
  process.stdout.write(msg+'\n');
  process.stdout.write('----'+'\n');
}
