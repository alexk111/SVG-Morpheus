/*
 * Helper functions
 */

'use strict';

var _reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
var _cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame;


// Calculate attrs
function attrsNormCalc(attrsNormFrom, attrsNormTo, progress) {
  var i, len, attrsNorm={};
  for(i in attrsNormFrom) {
    switch (i) {
      case 'fill':
      case 'stroke':
        attrsNorm[i]=clone(attrsNormFrom[i]);
        attrsNorm[i].r=attrsNormFrom[i].r+(attrsNormTo[i].r-attrsNormFrom[i].r)*progress;
        attrsNorm[i].g=attrsNormFrom[i].g+(attrsNormTo[i].g-attrsNormFrom[i].g)*progress;
        attrsNorm[i].b=attrsNormFrom[i].b+(attrsNormTo[i].b-attrsNormFrom[i].b)*progress;
        attrsNorm[i].opacity=attrsNormFrom[i].opacity+(attrsNormTo[i].opacity-attrsNormFrom[i].opacity)*progress;
        break;
      case 'stroke-width':
        attrsNorm[i]=attrsNormFrom[i]+(attrsNormTo[i]-attrsNormFrom[i])*progress;
        break;
    }
  }
  return attrsNorm;
}

function attrsNormToString(attrsNorm) {
  var i;
  var styleAttrs={};
  for(i in attrsNorm) {
    switch (i) {
      case 'fill':
      case 'stroke':
        styleAttrs[i]=rgbToString(attrsNorm[i]);
        break;
      case 'stroke-width':
        styleAttrs[i]=attrsNorm[i];
        break;
    }
  }
  return styleAttrs;
}

function attrsToNorm(attrsFrom, attrsTo) {
  var attrsNorm=[{},{}];
  var i;
  for(i in attrsFrom) {
    switch(i) {
      case 'fill':
      case 'stroke':
        attrsNorm[0][i]=getRGB(attrsFrom[i]);
        if(attrsTo[i]===undefined) {
          attrsNorm[1][i]=getRGB(attrsFrom[i]);
          attrsNorm[1][i].opacity=0;
        }
        break;
      case 'stroke-width':
        attrsNorm[0][i]=attrsFrom[i];
        if(attrsTo[i]===undefined) {
          attrsNorm[1][i]=1;
        }
        break;
    }
  }
  for(i in attrsTo) {
    switch(i) {
      case 'fill':
      case 'stroke':
        attrsNorm[1][i]=getRGB(attrsTo[i]);
        if(attrsFrom[i]===undefined) {
          attrsNorm[0][i]=getRGB(attrsTo[i]);
          attrsNorm[0][i].opacity=0;
        }
        break;
      case 'stroke-width':
        attrsNorm[1][i]=attrsTo[i];
        if(attrsFrom[i]===undefined) {
          attrsNorm[0][i]=1;
        }
        break;
    }
  }
  return attrsNorm;
}

// Calculate transform progress
function transCalc(transFrom, transTo, progress) {
  var res={};
  for(var i in transFrom) {
    switch(i) {
      case 'rotate':
        res[i]=[0,0,0];
        for(var j=0;j<3;j++) {
          res[i][j]=transFrom[i][j]+(transTo[i][j]-transFrom[i][j])*progress;
        }
        break;
    }
  }
  return res;
}

function trans2string(trans) {
  var res='';
  if(!!trans.rotate) {
    res+='rotate('+trans.rotate.join(' ')+')';
  }
  return res;
}

// Calculate curve progress
function curveCalc(curveFrom, curveTo, progress) {
  var curve=[];
  for(var i=0,len1=curveFrom.length;i<len1;i++) {
    curve.push([curveFrom[i][0]]);
    for(var j=1,len2=curveFrom[i].length;j<len2;j++) {
      curve[i].push(curveFrom[i][j]+(curveTo[i][j]-curveFrom[i][j])*progress);
    }
  }
  return curve;
}

function clone(obj) {
  var copy;

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr]);
      }
    }
    return copy;
  }

  return obj;
}


