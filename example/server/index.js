const express = require('express');
const render = require('@parcel-ssr/render');

const app = express();

const distDir = __dirname+'/../dist/';
app.use(express.static(distDir));

app.get('/', (req, res) => {
  const html = renderHtml(
    distDir+'LandingPage.node.js',
    {props: {name: 'John'}}
  );

  res.send(html);
});

function renderHtml(page , opts) {
  return(
`<html>
  <head>
  </head>
  <body>
  ${render(page, opts)}
  </body>
</html>
`
  );
  renderPage
}

app.listen(3000, () => {console.log('Server is running.')});

