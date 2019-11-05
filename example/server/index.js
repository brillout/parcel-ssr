const express = require('express');
const render = require('@parcel-ssr/render');

const app = express();

const distDir = __dirname+'/../dist/';
app.use(express.static(distDir));

app.get('/hello/:name', (req, res) => {
  const props = {
    name: req.params.name,
  };
  const html = renderHtml('Hello', {props});
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
