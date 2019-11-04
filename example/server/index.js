const express = require('express');
const render = require('@parcel-ssr/render');

const app = express();

const distDir = __dirname+'/../dist/';
app.use(express.static(distDir));

app.get('/', (req, res) => {
  const html = renderHtml(
    'landing',
    {props: {name: 'John'}}
  );
  res.send(html);
});

app.listen(3000, () => {console.log('Server is running.')});

function renderHtml(page , opts) {
  return (
`<html>
  <head>
  </head>
  <body>
  ${render(page, opts)}
  </body>
</html>
`
  );
}
