# `@parcel-ssr`

`@parcel-ssr` is a tiny yet powerful SSR tool based on Parcel.

- Tiny: it's only few hundreds LOCs.
- Powerful:
  - It works with
    any view library (React, Vue, RNW, Svelte, etc.),
    any view tool (Redux, Vuex, etc.),
    any server framework (Express, Koa, Hapi, etc.).
  - You can choose when and where you render your pages. For examle, one page can be rendered to HTML and the DOM (classic SSR), another page can be rendered to HTML only (no browser-side JavaScript for blazing fast mobile performance), and a third page can be rendered to the DOM only.
  - It can generate a Static Website.

`@parcel-ssr` is a low-level tool aimed for:
- End-users that want control and freedom.
- High-level framework authors, such as Next.js or Nuxt.

> :warning: This project is experimental.

<br/>

## Usage

**Contents**
- [`render`](#render)
- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
- [Static Rendering (SR)](#static-rendering-sr)

### `render`

At the heart of `@parcel-ssr` is the `render` function:

~~~jsx
// pages/hello/Hello.page.js

// We first define a page.

// We use React in this example but we could use
// any other view library such as Vue, RNW, etc.
import React, {useState} from 'react';

const HelloPage = ({name}) => <>
  Hello {name}
  <Counter/>
</>;

function Counter() {
  const [count, setCount] = useState(0);

  return <div>
    {count}
    <button onClick={() => setCount(count + 1)}>
      Click me
    </button>
  <div/>;
}

export default HelloPage;
~~~

~~~js
const render = require('@parcel-ssr/render');

const htmlBody = render(
  'HelloPage',
  {
    props: {name: 'John'},
    // Whether or not we want to hydrate our page.
    // Set `doNoHydrate: true` for non-interactive pages.
    // (The page is then rendered only to HTML.)
    // Set `doNoHydrate: false` for interactive pages
    // (The page is then rendered to HTML and to the DOM.)
    doNoHydrate: false
  }
);

// The `HelloPage-hydrate.js` script hydrates the page, enabling
// interactivity such as `<Counter/>`, a like button, a date picker, etc.
assert(htmlBody===[
  '<div id="page-view">',
  'Hello John',
  '<div>0<button>Click me</button>'
  '</div>',
  '<script src="/HelloPage-hydrate.js"></script>',
].join(''));

const html = (
`<html>
  <body>${htmlBody}</body>
</html>
`
);
~~~

The `render` function uses two functions `renderToHtml` and `renderToDom` that *you* define.
This gives you
full control over how your pages are rendered
and allows you to use `@parcel-srr` with any view library/tool you want;
you can use
React, Vue, RNW, Svelte, etc. and easily integrate
Redux, Vuex, React Router, Vuex, GraphQL, etc.

~~~js
// render/renderToDom.js

// We use React to render our pages but we could use any other
// view library such as Vue, RNW, etc.

import React from 'react';
import ReactDOM from 'react-dom';

export default renderToDom;

function renderToDom({page, props, CONTAINER_ID}) {
  const el = React.createElement(page, props);
  const container = window.document.getElementById(CONTAINER_ID);
  ReactDOM.hydrate(el, container);
}
~~~

~~~js
// render/renderToHtml.js

const React = require('react');
const ReactDOMServer = require('react-dom/server');

module.exports = renderToHtml;

function renderToHtml({page, props}) {
  const el = React.createElement(page, props);
  const html = ReactDOMServer.renderToStaticMarkup(el);
  return html;
}
~~~

The `render` function enables you to easily achieve Server-Side Rendering (SSR) and Static Rendering (SR).

### Server-Side Rendering (SSR)

To do SSR, simply use your server's router and apply the `render` function:

~~~js
// server/start.js

const express = require('express');
const render = require('@parcel-ssr/render');

const app = express();

app.get('/hello/:name', (req, res) => {
  const props = {name: req.params.name};
  const body = render('Hello', {props});
  res.send(htmlDoc(body));
});

app.use(express.static(__dirname+'/../dist/'));

app.listen(3000, () => {console.log('Server is running.')});

function htmlDoc(body) {
  return (
`<html>
  <body>${body}</body>
</html>
`
  );
}
~~~

Build your pages:
~~~shell
$ parcel build
~~~
Then run your server:
~~~shell
$ node server/start.js
~~~

### Static Rendering (SR)

> :warning: This feature is not implemented yet.

By defining the `staticRender` function you can generate pages at build-time.
This allows you to build a Static Website: if you render all your pages with `staticRender` then you app is static and no Node.js server is required; you can deploy your app to a static host such as Netlify.

~~~js
// render/staticRender.js

const render = require('@parcel-ssr/render');

module.exports = staticRender;

async function staticRender() {
  [
    {slug: 'intro', title: 'Introducing @parcel-ssr',
     markdown: '`parcel-ssr` is a SSR tiny yet powerful tool...'},
    {slug: 'why-parcel', title: 'Why SSR with Parcel',
     markdown: "Parcel's Zero-config philosophy..."},
  ].forEach(({slug, title, markdown}) => {
    // We render each blog post to an HTML file `blog/${slug}.html`:
    const props = {title, markdown};
    pages['/blog/'+slug] = render('BlogPost', {props});
  });

  // Generates the `index.html`
  pages['/'] = render('Landing', {doNoHydrate: true});

  // Generates `about.html`
  pages['/about'] = render('About', {doNoHydrate: true});

  return pages;
}
~~~

Note how we use the `doNoHydrate` option to make our pages `/about` and `/` static:
they are not rendered to the DOM but only to HTML and have zero browser-side JavaScript.
(Good old plain HTML like in the 90s!)
We do hydrate our blog posts to enable interactive blog posts.

You can now run Parcel to build your static website:
~~~shell
$ parcel build
~~~
