'use strict';

function SVGMorpheus(container, state, dur, easing) {
  if(!container) {
    return null;
  }

  if(typeof container === typeof '') {
    container=document.getElementById(container);
  }

  return new Morpher(container, state, dur, easing);
}

return SVGMorpheus;