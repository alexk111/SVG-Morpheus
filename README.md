# SVG Morpheus

JavaScript library enabling SVG icons to morph from one to the other. It implements Material Design's [Delightful Details](http://www.google.com/design/spec/animation/delightful-details.html) transitions.

## Live demo

[Launch Live Demo](http://alexk111.github.io/SVG-Morpheus/)

## Installing

Simply add the svg-morpheus.js script to your website/application. No other scripts are needed. Both the minified and uncompressed (for development) versions are in the /compile folder.

```html
<script src="svg-morpheus.js"></script>
```

## Usage

1. Add an icon set SVG to the HTML file where you want to show the morphing icon.
2. Initialize SVG Morpheus for the icon by calling `SVGMorpheus(DOM)` or `SVGMorpheus(ID)`. *DOM is Object/IFrame/SVG element containing an iconset; ID is an id of Object/IFrame/SVG element containing an iconset*. For example:

```javascript
var myIcons = SVGMorpheus('myIconSet');
```

3. After initializing, SVG Morpheus returns an object having `to(ID)` function. *ID is an id of Icon in the icon set*. Use it to morph the icon to another icon in the icon set.

```javascript
myIcons.to('icon1');
```

## Icon Set structure

SVG should have the following structure to be a valid icon set:

- 1st tier nodes are `<g>` elements having 'id' attribute. They define icons in the icon set.
- 2nd tier nodes are shape elements (`<path>`, `circle`, `rect`, `ellipse`, `polygon`, `line`). They define the icon graphics.

```xml
<svg>
  <g id="icon1">
    Shape elements
  </g>
  <g id="icon2">
    Shape elements
  </g>
</svg>
```

## SVGMorpheus()

```javascript
var myIcons = SVGMorpheus(DOM, iconId, duration, easing);

```

### DOM

Object/IFrame/SVG element containing an iconset. Can be a DOM element or element id.

### iconId

*Optional*. Id of an icon shown after initialization. Default: last icon in the icon set.

### duration

*Optional*. Set a default duration for transitions, in msec. Default: 1000.

### easing

*Optional*. Set a default easing for transitions. Default: linear.


## to()

```javascript
myIcons.to(iconId, duration, easing);

```

#### iconId

Id of an icon to transition to.

#### duration

*Optional*. Set a duration for the transition, in msec.

#### easing

*Optional*. Set an easing for the transition.


## Supported Easings

`circ-in`, `circ-out`, `circ-in-out`, `cubic-in`, `cubic-out`, `cubic-in-out`, `elastic-in`, `elastic-out`, `elastic-in-out`, `expo-in`, `expo-out`, `expo-in-out`, `linear`, `quad-in`, `quad-out`, `quad-in-out`, `quart-in`, `quart-out`, `quart-in-out`, `quint-in`, `quint-out`, `quint-in-out`, `sine-in`, `sine-out`, `sine-in-out`


## Example code

Check the Demos directory for examples.


## License

See the [LICENSE](https://github.com/alexk111/SVG-Morpheus/blob/master/LICENSE) file.

