> :warning: This is an experiment. Do not use in production.

## Intro

`@parcel-ssr` is a tiny yet powerful SSR tool based on Parcel.

- Tiny: it's only few hundreds of LOCs.
- Powerful:
  - Works with any view library (React, Vue, RNW, Svelte, etc.), any server framework (Express, Koa, Hapi, etc.), any view tool (Redux, Vuex, etc.).
  - You can choose to render where to render your pages. For examle, one page can be rendered to HTML and the DOM (classic SSR), another page can be rendered to HTML only (no browser-side JavaScript for blazing fast mobile performance), and a third page can be rendered to the DOM only.
  - You can generate a Static Website.

`@parcel-ssr` is a low-level tool aimed for:
- End-users that want full control and freedom.
- High-level framework authors, such as Next.js or Nuxt.

## Usage



Usage happens in 3 steps.

**1. Define**

We define pages and the render functions.

Pages:

~~~jsx
// pages/hello/Hello.page.js

// Here we use React, but you can use any other view library such as Vue

import React from 'react';

const HelloPage = ({name}) => <>
  Hello {name}
  <Time/>
</>;

export default HelloPage;
~~~

~~~jsx
// pages/hello/Hello.page.js

// A more interesting page to showcase routing and hydration.

import React, {useState} from 'react';

const HelloPage = ({name}) => <>
  Hello {name}
  <Counter/>
</>;

export default HelloPage;

function Counter() {
  const [count, setCount] = useState(0);

  return <>
    {count}
    <button onClick={() => setCount(count + 1)}>
      Click me
    </button>
  </>;
}
~~~

Render functions:

~~~js
// render/renderToDom.js

// *You* define how your pages are rendered. Giving you freedom to choose
// any view library (React, Vue, RNW, Svelte, ...) and
// any view tool (Redux, Vuex, React Router, Vuex, GraphQL, ...).

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

**2. Build**

We build our pages. For that we install Parcel and `@parcel-ssr`:

~~~json5
{
  // Note that `package.json#source` is not finallized and is being discussed
  // at #3302 (https://github.com/parcel-bundler/parcel/issues/3302).
  "source": {
    "pages": {
      "entry": "pages/**/*.page.js",
      "target": ["browser", "node"],
      "outDir": ".build/"
    }
  },
  "scripts": {
    "prod": "parcel build && npm run start",
    "dev": "parcel dev && nodemon ./path/to/server",
    "start": "node ./build/server"
  },
  "devDependencies": {
    "nodemon": "^1.19.4",
    "@parcel-ssr/config": "0.1.0",
    "@parcel-ssr/render": "0.1.0",
    "parcel": "2.0.0-alpha.2.1"
  }
}
~~~

~~~json5
// .parcelrc

{
  "extends": ["@parcel/config-default", "@parcel-ssr/config"]
}
~~~

We can now build our pages:

~~~shell
$ npm run build
~~~

**3. Render**

We can now render our pages to 
~~~js
const render = require('@parcel-ssr/render');

const body = render('Welcome' {doNoHydrate: true});
/* or
const props = {name: 'John'};
const body = render('Hello' {props, doNoHydrate: false});
*/

const html = (
`<html>
  <body>
  ${body}
  </body>
</html>
`
);
~~~

We now show how we can use `@parcel-ssr/render` to do Server-side Rendering and Static Rendering.

# SSR

# SR (Static Rendering)

> :warning: This feature is not implemented yet.

~~~js

// render/staticRender.js

const render = require('@parcel-ssr/render');

module.exports = staticRender;

async function staticRender() {
  const blogPosts = [
    {slug: 'intro', title: 'Introducing @parcel-ssr', markdown: '[Parcel SSR]( is a SSR tiny yet powerful tool...'},
    {slug: 'why-parcel', title: 'Why SSR with Parcel', markdown: "Parcel's Zero-config philosophy..."},
  ]

  blogPosts.forEach(({slug, title, markdown}) => {
    // We render each blog post to an HTML file `blog/${slug}.html`:
    const props = {title, markdown};
    pages['/blog/'+slug] = render('BlogPost', {props, doNoHydrate: false});
  });

  // Generates the `index.html`
  pages['/'] = render('Landing', {doNoHydrate: true});

  // Generates `about.html`
  pages['/about'] = render('About', {doNoHydrate: true});

  // Note how we use `doNoHydrate: true` which means that our page
  // will have zero browser-side JavaScript.
  // `/` and `/about` are only static HTML.
  // Good old plain HTML like in the 90s!

  return pages;
}
