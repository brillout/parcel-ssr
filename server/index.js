const express = require('express');
const React = require('react');
const ReactDOM = require('react-dom');

const app = express();

app.use(express.static('../dist'));

app.get('/', (req, res) => {
  const html = (
`<html>
<head>
<script src="/LandingPage.browser.js"></script>
<script src="/hydratePage.js"></script>
</head>
<body>
test
</body>
</html>`
  );
  res.send(html);
});

app.listen(3000, () => {console.log('Server is running.')});
