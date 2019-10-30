const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const app = express();

const distDir = __dirname+'/../dist/';
app.use(express.static(distDir));

app.get('/', (req, res) => {
  const LandingPage = require(distDir+'LandingPage.node.js').default;

  const el = React.createElement(LandingPage);

  const viewHtml = ReactDOMServer.renderToStaticMarkup(el);

  const html = (
`<html>
<head>
</head>
<body>
test
<div id="page-view">${viewHtml}</div>
<script src="/LandingPage.browser.js"></script>
<script src="/hydratePage.js"></script>
</body>
</html>`
  );
  res.send(html);
});

app.listen(3000, () => {console.log('Server is running.')});
