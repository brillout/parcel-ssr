# `@parcel-ssr`

`@parcel-ssr` is an SSR tool based on Parcel v2. It's tiny yet powerful:
- Tiny &mdash; only few hundreds LOCs.
- Powerful:
  - It works with
    any view library (React, Vue, RNW, Svelte, etc.),
    any view tool (Redux, Vuex, etc.),
    and any server framework (Express, Koa, Hapi, etc.).
  - You can choose when and where your pages are rendered: one page can be rendered to HTML and to the DOM (classic SSR), another page can be rendered to HTML only (no browser-side JavaScript for blazing fast mobile performance), and a third page can be rendered to the DOM only.
  - You can use `@parcel-ssr` to generate a static website.

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

const HelloPage = ({name}) => (
  <div>
    Hello {name}
    <Counter/>
  </div>
);

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default HelloPage;
~~~

~~~js
const render = require('@parcel-ssr/render');

// The `render` function:
const htmlBody = render(
  'HelloPage',
  {
    props: {name: 'John'},
    // Set `doNoHydrate: true` for non-interactive pages. (The page is rendered only to HTML.)
    // Set `doNoHydrate: false` for interactive pages. (The page is rendered to HTML and to the DOM.)
    doNoHydrate: false
  }
);
assert(htmlBody===[
  '<div id="page-view">',
  'Hello John',
  '<div>0<button>Click me</button></div>'
  '</div>',
  // The `HelloPage-hydrate.js` script hydrates the page, enabling interactivity
  // such as `<Counter/>`, a like button, a date picker, etc.
  '<script src="/HelloPage-hydrate.js"></script>',
].join(''));

const html = (
`<html>
  <body>${htmlBody}</body>
</html>`
);
~~~

The `render` function uses two functions `renderToHtml` and `renderToDom` that *you* define.
This gives you
full control over how your pages are rendered
and allows you to use `@parcel-srr` with any view library/tool you want.

~~~js
// render/renderToDom.js

// We use React to render our pages but we could use Vue, RNW, etc.

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

With the `render` function,
you can easily perform Server-Side Rendering (SSR) and Static Rendering (SR).

### Server-Side Rendering (SSR)

To achieve SSR, simply use the `render` function with your server's router:

~~~js
// server/index.js

const express = require('express');
const render = require('@parcel-ssr/render');

const app = express();

app.get('/hello/:name', (req, res) => {
  const props = {name: req.params.name};
  const body = render('Hello', {props});
  res.send(htmlDoc(body));
});

function htmlDoc(body) {
  return (
`<html>
  <body>${body}</body>
</html>`
  );
}
~~~

Build your pages:
~~~shell
$ parcel build
~~~
Then run your server:
~~~shell
$ node server/index.js
~~~

### Static Rendering (SR)

> :warning: This feature is not implemented yet.

You generate pages at build-time by defining `staticRender`:

~~~js
// render/staticRender.js

const render = require('@parcel-ssr/render');

module.exports = staticRender;

async function staticRender() {
  [
    {slug: 'intro', title: 'Introducing @parcel-ssr',
     markdown: '`parcel-ssr` is a tiny yet powerful tool...'},
    {slug: 'why-parcel', title: 'Why SSR with Parcel',
     markdown: "Parcel's zero-config philosophy..."},
  ].forEach(({slug, title, markdown}) => {
    const props = {title, markdown};
    // We render each blog post to an HTML file `blog/${slug}.html`.
    // The blog post is then available at `https://example.org/blog/${slug}`.
    pages['/blog/'+slug] = render('BlogPost', {props});
  });

  // Generate `index.html` and `about.html`
  pages['/'] = render('Landing', {doNoHydrate: true});
  pages['/about'] = render('About', {doNoHydrate: true});

  return pages;
}
~~~

Note that we use `doNoHydrate: true` for `/about` and `/`:
these pages are not rendered to the DOM but only to HTML and have zero browser-side JavaScript.
(Good old plain HTML like in the 90s!)
We do hydrate our blog to enable interactive blog posts.

`staticRender` allows you to build a static website.
If you render all your pages with `staticRender` then your app is static:
your app's HTML is fully rendered at build-time.
No Node.js server is required and you can deploy your app to a static host such as Netlify.

Run Parcel to build your static website:
~~~shell
$ parcel build
~~~
