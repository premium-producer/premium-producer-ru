# Products

Each visible catalog card is a product folder. The build renders cards only from
folders that contain `product.json`. Products without an image in `assets/` are
not kept in the catalog.

Example:

```text
src/products/cn-03/
  product.json
  assets/
    vk-finopolis-depth.png
```

To replace an image, update the file inside that product's `assets/` folder and
keep `product.json` pointed at it:

```json
{
  "order": 3,
  "code": "CN-03",
  "title": "Content System",
  "visual": {
    "type": "image",
    "asset": "assets/vk-finopolis-depth.png"
  }
}
```

If a product folder or its `product.json` is missing, the card is not rendered.
