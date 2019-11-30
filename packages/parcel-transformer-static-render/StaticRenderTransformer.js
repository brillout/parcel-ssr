const {Transformer} = require('@parcel/plugin');

module.exports = new Transformer({
  async transform({asset}) {
    return [asset, renderToHtmlAsset(asset)];
  }
});

function renderToHtmlAsset(asset) {
  return {
    type: 'html',
    code: '<html>transformer plugin test<div>__STATIC_RENDER_TRANSFORMER__</div></html>',
  };
}
