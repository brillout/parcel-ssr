const express = require('express');
const render = require('@parcel-ssr/render');

const app = express();

const distDir = __dirname+'/../dist/';
app.use(express.static(distDir));

app.get('/', (req, res) => {
  const body = (
    ['Lisa', 'John']
    .map(name => '<a href="/hello/'+name+'">/hello/'+name+'</a><br/>')
    .join('\n')
  );
  res.send(htmlDoc(body));
});

app.get('/hello/:name', (req, res) => {
  const props = {
    name: req.params.name,
  };
  const body = render('Hello', {props, doNotHydrate: false});
  res.send(htmlDoc(body));
});

app.listen(3000, () => {console.log('Server is running.')});

function htmlDoc(body) {
  return (
`<html>
  <head>
  </head>
  <body>
  ${body}
  </body>
</html>
`
  );
}
