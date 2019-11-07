const express = require('express');
const render = require('@parcel-ssr/render');

const app = express();

app.get('/', (req, res) => {
  const link = url => '<a href="'+url+'">'+url+'</a>';
  const body = ['Lisa', 'John'].map(name => link('/hello/'+name)+'<br/>').join('\n');
  res.send(htmlDoc(body));
});

app.get('/hello/:name', (req, res) => {
  const props = {name: req.params.name};
  const body = render('Hello', {props, doNotHydrate: false});
  res.send(htmlDoc(body));
});

app.use(express.static(__dirname+'/../dist/'));

app.listen(3000, () => {console.log('Server is running.')});

function htmlDoc(body) {
  return (
`<html>
  <body>
  ${body}
  </body>
</html>
`
  );
}
