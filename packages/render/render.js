const devalue = require('devalue');
const {projectDir} = require('@brillout/project-files');
const path = require('path');

// TODO - read from `package.json`
const distDir = path.join(projectDir, './dist/');

const CONTAINER_ID = 'page-view';

module.exports = render;

function render(pageName, {props}={}) {
  const {pageBundle__nodejs, pageBundle__browser} = getPageBundleAddress();
  const page = require(pageBundle__nodejs).default;
  const renderToHtml = require('../render/renderToHtml').default;

  const props__serialized = devalue(props);

  const pageViewHtml = renderToHtml({page, props});

  const html = (
`<div id="${CONTAINER_ID}">${pageViewHtml}</div>
<script>window.__parcel_ssr__props=${props__serialized}</script>
<script src="${pageBundle__browser}"></script>`
  );

  return html;
}

function getPageBundleAddress(pageName) {
  const pageBundle__nodejs = getBundlePath(pageName, {forNodejs: true});
  const forBrowser = getBundlePath(pageName, {forNodejs: false});

  const pageBundle__browser = path.relative(distDir, forBrowser);
  return {
    pageBundle__nodejs,
    page__browser,
  };
}

// TODO - read from `package.json`
function getBundlePath(pageName, {forNodejs}) {
  const suffix = forNodejs ? 'node' : 'browser';
  const fileName = pageName+'.page.'+suffix+'.js';
  const filePath = path.join(distDir, fileName);
  return require.resolve(filePath);
}
