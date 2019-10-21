# zdog-svg-importer

Rudimentary SVG importer for [Zdog](https://zzz.dog)

- Takes a dom collection of svg line & path nodes as a parameter. (Just those two implemented, ignores rects etc.)
- Parses x/y & path attributes and adds the shapes to the given Zdog object.
- Gets color, stroke & fill from each svg node.
- Supports giving a z depth to a shape by appending -z100 (-z) to your svg node ID.
- Returns an object indexed by shape ID's, with references to each added Zdog object, so it's easy to reference and animate the imported stuff.

Quite a few caveats:

- Only tested with Sketch exports so far.
- The path d attribute parsing is not up to spec. (ignores arcs and some other stuff probably)
- Ignores groups & transforms, so better to export a flat file with just shapes.
- Developed while running Chrome, not tested with anything else yet. (I do need this to work cross browser myself.)
- No documentation either yet, sorry.

## Usage

Add Zdog and the import script to your page. (TODO: ES6 module)

```js
const illo = new Zdog.Illustration({
  element: "#canvas",
});
SVGtoZDOG(document.querySelectorAll('svg path'), illo)
illo.updateRenderGraph();
```