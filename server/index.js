const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const devalue = require('devalue');

const app = express();

const distDir = __dirname+'/../dist/';
app.use(express.static(distDir));

app.get('/', (req, res) => {
  const html = render(
    distDir+'LandingPage.node.js',
    {props: {name: 'John'}}
  );

  res.send(html);
});

app.listen(3000, () => {console.log('Server is running.')});

function render(pageFilePath, {props}={}) {
  const pageView = require(pageFilePath).default;

  const props__serialized = devalue(props);

  const el = React.createElement(pageView, props);

  const viewHtml = ReactDOMServer.renderToStaticMarkup(el);

  const html = (
`<html>
<head>
</head>
<body>
test
<div id="page-view-root">${viewHtml}</div>
<script>window.__parcel_ssr__props=${props__serialized}</script>
<script src="/LandingPage.browser.js"></script>
</body>
</html>`
  );

  return html;
}
