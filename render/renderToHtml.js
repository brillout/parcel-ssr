const React = require('react');
const ReactDOMServer = require('react-dom/server');

module.exports = renderToHtml;

function renderToHtml({page, props}) {
  const el = React.createElement(page, props);
  const html = ReactDOMServer.renderToStaticMarkup(el);
  return html;
}
