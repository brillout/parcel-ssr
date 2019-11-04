const devalue = require('devalue');

const CONTAINER_ID = 'page-view';

module.exports = render;

function render(pageName, {props}={}) {
  const {pageBundle__nodejs, pageBundle__browser} = getPageBundles();
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

// TODO
function getPageBundles(pageName) {
  return {
    pageBundle__nodejs: require.resolve('../pages/'+pageName+'.page.js'),
    pageBundle__browser: '/'+pageName+'.browser.js',
  };
}
