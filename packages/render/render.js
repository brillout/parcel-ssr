const devalue = require('devalue');
const {projectDir} = require('@brillout/project-files');
const path = require('path');

const CONTAINER_ID = 'page-view';

module.exports = render;

function render(pageName, {props, doNotHydrate=false}={}) {
  const {pageBundle__nodejs, pageBundle__browser} = getPageBundleAddress(pageName);
  const page = require(pageBundle__nodejs).default;

  // TODO - make `renderToHtml` a proper config
  const renderToHtmlFile = require.resolve(path.join(projectDir, './render/renderToHtml'));
  const renderToHtml = require(renderToHtmlFile);

  const props__serialized = devalue(props);

  const pageViewHtml = renderToHtml({page, props});

  const pageHtml = `<div id="${CONTAINER_ID}">${pageViewHtml}</div>`;
  const pageHydration = [
    `<script>window.__parcel_ssr__props=${props__serialized}</script>`,
    `<script src="${pageBundle__browser}"></script>`,
  ].join('\n');

  if( doNotHydrate ) {
    return pageHtml;
  } else {
    return pageHtml + '\n' + pageHydration;
  }
}

// TODO - get bundle filenames by:
//  - reading from `package.json`, or
//  - by using a reporter plugin to persist the source <=> bundle mapping
const distDir = path.join(projectDir, './dist/');
function getPageBundleAddress(pageName) {
  const pageBundle__nodejs = getBundlePath(pageName, {forNodejs: true});
  const forBrowser = getBundlePath(pageName, {forNodejs: false});

  const pageBundle__browser = '/'+path.relative(distDir, forBrowser);
  return {
    pageBundle__nodejs,
    pageBundle__browser,
  };
}
function getBundlePath(pageName, {forNodejs}) {
  const suffix = forNodejs ? 'node' : 'browser';
  const fileName = pageName+'.page.'+suffix+'.js';
  const filePath = path.join(distDir, fileName);
  return require.resolve(filePath);
}
