/*!
 * SVG Morpheus v0.3.2
 * https://github.com/alexk111/SVG-Morpheus
 *
 * Copyright (c) 2016 Alex Kaul
 * License: MIT
 *
 * Generated at Saturday, May 14th, 2016, 5:19:19 PM
 */
(function() {
'use strict';

/*
 * Easing functions
 */

var easings={};
easings['circ-in']=function (t) {
  return -1 * (Math.sqrt(1 - t*t) - 1);
};
easings['circ-out']=function (t) {
  return Math.sqrt(1 - (t=t-1)*t);
};
easings['circ-in-out']=function (t) {
  if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1);
  return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
};
easings['cubic-in']=function (t) { return t*t*t };
easings['cubic-out']=function (t) { return (--t)*t*t+1 };
easings['cubic-in-out']=function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
easings['elastic-in']=function (t) {
  var s=1.70158;var p=0;var a=1;
  if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
  if (a < Math.abs(1)) { a=1; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (1/a);
  return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
};
easings['elastic-out']=function (t) {
  var s=1.70158;var p=0;var a=1;
  if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
  if (a < Math.abs(1)) { a=1; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (1/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t-s)*(2*Math.PI)/p ) + 1;
};
easings['elastic-in-out']=function (t) {
  var s=1.70158;var p=0;var a=1;
  if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
  if (a < Math.abs(1)) { a=1; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (1/a);
  if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
  return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p )*.5 + 1;
};
easings['expo-in']=function (t) {
  return (t==0) ? 0 : Math.pow(2, 10 * (t - 1));
};
easings['expo-out']=function (t) {
  return (t==1) ? 1 : 1-Math.pow(2, -10 * t);
};
easings['expo-in-out']=function (t) {
  if (t==0) return 0;
  if (t==1) return 1;
  if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
  return 1/2 * (-Math.pow(2, -10 * --t) + 2);
};
easings['linear']=function (t) { return t };
easings['quad-in']=function (t) { return t*t };
easings['quad-out']=function (t) { return t*(2-t) };
easings['quad-in-out']=function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t };
easings['quart-in']=function (t) { return t*t*t*t };
easings['quart-out']=function (t) { return 1-(--t)*t*t*t };
easings['quart-in-out']=function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t };
easings['quint-in']=function (t) { return t*t*t*t*t };
easings['quint-out']=function (t) { return 1+(--t)*t*t*t*t };
easings['quint-in-out']=function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t };
easings['sine-in']=function (t) {
  return 1-Math.cos(t * (Math.PI/2));
};
easings['sine-out']=function (t) {
  return Math.sin(t * (Math.PI/2));
};
easings['sine-in-out']=function (t) {
  return 1/2 * (1-Math.cos(Math.PI*t));
};


/*
 * Helper functions
 */

var _reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
var _cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame;

// Calculate style
function styleNormCalc(styleNormFrom, styleNormTo, progress) {
  var i, len, styleNorm={};
  for(i in styleNormFrom) {
    switch (i) {
      case 'fill':
      case 'stroke':
        styleNorm[i]=clone(styleNormFrom[i]);
        styleNorm[i].r=styleNormFrom[i].r+(styleNormTo[i].r-styleNormFrom[i].r)*progress;
        styleNorm[i].g=styleNormFrom[i].g+(styleNormTo[i].g-styleNormFrom[i].g)*progress;
        styleNorm[i].b=styleNormFrom[i].b+(styleNormTo[i].b-styleNormFrom[i].b)*progress;
        styleNorm[i].opacity=styleNormFrom[i].opacity+(styleNormTo[i].opacity-styleNormFrom[i].opacity)*progress;
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[i]=styleNormFrom[i]+(styleNormTo[i]-styleNormFrom[i])*progress;
        break;
    }
  }
  return styleNorm;
}

function styleNormToString(styleNorm) {
  var i;
  var style={};
  for(i in styleNorm) {
    switch (i) {
      case 'fill':
      case 'stroke':
        style[i]=rgbToString(styleNorm[i]);
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        style[i]=styleNorm[i];
        break;
    }
  }
  return style;
}

function styleToNorm(styleFrom, styleTo) {
  var styleNorm=[{},{}];
  var i;
  for(i in styleFrom) {
    switch(i) {
      case 'fill':
      case 'stroke':
        styleNorm[0][i]=getRGB(styleFrom[i]);
        if(styleTo[i]===undefined) {
          styleNorm[1][i]=getRGB(styleFrom[i]);
          styleNorm[1][i].opacity=0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[0][i]=styleFrom[i];
        if(styleTo[i]===undefined) {
          styleNorm[1][i]=1;
        }
        break;
    }
  }
  for(i in styleTo) {
    switch(i) {
      case 'fill':
      case 'stroke':
        styleNorm[1][i]=getRGB(styleTo[i]);
        if(styleFrom[i]===undefined) {
          styleNorm[0][i]=getRGB(styleTo[i]);
          styleNorm[0][i].opacity=0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[1][i]=styleTo[i];
        if(styleFrom[i]===undefined) {
          styleNorm[0][i]=1;
        }
        break;
    }
  }
  return styleNorm;
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



/*
 * Useful things from Adobe's Snap.svg adopted to the library needs
 */

/*
 * Paths
 */

var spaces = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
var pathCommand = new RegExp("([a-z])[" + spaces + ",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[" + spaces + "]*,?[" + spaces + "]*)+)", "ig");
var pathValues = new RegExp("(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[" + spaces + "]*,?[" + spaces + "]*", "ig");

// Parses given path string into an array of arrays of path segments
var parsePathString = function (pathString) {
  if (!pathString) {
    return null;
  }

  if(typeof pathString === typeof []) {
    return pathString;
  } else {
    var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
        data = [];

    String(pathString).replace(pathCommand, function (a, b, c) {
      var params = [],
          name = b.toLowerCase();
      c.replace(pathValues, function (a, b) {
        b && params.push(+b);
      });
      if (name == "m" && params.length > 2) {
        data.push([b].concat(params.splice(0, 2)));
        name = "l";
        b = b == "m" ? "l" : "L";
      }
      if (name == "o" && params.length == 1) {
        data.push([b, params[0]]);
      }
      if (name == "r") {
        data.push([b].concat(params));
      } else while (params.length >= paramCounts[name]) {
        data.push([b].concat(params.splice(0, paramCounts[name])));
        if (!paramCounts[name]) {
          break;
        }
      }
    });

    return data;
  }
};

// http://schepers.cc/getting-to-the-point
var catmullRom2bezier=function(crp, z) {
  var d = [];
  for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
    var p = [
              {x: +crp[i - 2], y: +crp[i - 1]},
              {x: +crp[i],     y: +crp[i + 1]},
              {x: +crp[i + 2], y: +crp[i + 3]},
              {x: +crp[i + 4], y: +crp[i + 5]}
            ];
    if (z) {
      if (!i) {
        p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
      } else if (iLen - 4 == i) {
        p[3] = {x: +crp[0], y: +crp[1]};
      } else if (iLen - 2 == i) {
        p[2] = {x: +crp[0], y: +crp[1]};
        p[3] = {x: +crp[2], y: +crp[3]};
      }
    } else {
      if (iLen - 4 == i) {
        p[3] = p[2];
      } else if (!i) {
        p[0] = {x: +crp[i], y: +crp[i + 1]};
      }
    }
    d.push(["C",
          (-p[0].x + 6 * p[1].x + p[2].x) / 6,
          (-p[0].y + 6 * p[1].y + p[2].y) / 6,
          (p[1].x + 6 * p[2].x - p[3].x) / 6,
          (p[1].y + 6*p[2].y - p[3].y) / 6,
          p[2].x,
          p[2].y
    ]);
  }

  return d;

};

var ellipsePath=function(x, y, rx, ry, a) {
  if (a == null && ry == null) {
    ry = rx;
  }
  x = +x;
  y = +y;
  rx = +rx;
  ry = +ry;
  if (a != null) {
    var rad = Math.PI / 180,
        x1 = x + rx * Math.cos(-ry * rad),
        x2 = x + rx * Math.cos(-a * rad),
        y1 = y + rx * Math.sin(-ry * rad),
        y2 = y + rx * Math.sin(-a * rad),
        res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
  } else {
    res = [
        ["M", x, y],
        ["m", 0, -ry],
        ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
        ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
        ["z"]
    ];
  }
  return res;
};

var pathToAbsolute=function(pathArray) {
  pathArray = parsePathString(pathArray);

  if (!pathArray || !pathArray.length) {
    return [["M", 0, 0]];
  }
  var res = [],
      x = 0,
      y = 0,
      mx = 0,
      my = 0,
      start = 0,
      pa0;
  if (pathArray[0][0] == "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    res[0] = ["M", x, y];
  }
  var crz = pathArray.length == 3 &&
      pathArray[0][0] == "M" &&
      pathArray[1][0].toUpperCase() == "R" &&
      pathArray[2][0].toUpperCase() == "Z";
  for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
    res.push(r = []);
    pa = pathArray[i];
    pa0 = pa[0];
    if (pa0 != pa0.toUpperCase()) {
      r[0] = pa0.toUpperCase();
      switch (r[0]) {
        case "A":
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +pa[6] + x;
          r[7] = +pa[7] + y;
          break;
        case "V":
          r[1] = +pa[1] + y;
          break;
        case "H":
          r[1] = +pa[1] + x;
          break;
        case "R":
          var dots = [x, y].concat(pa.slice(1));
          for (var j = 2, jj = dots.length; j < jj; j++) {
            dots[j] = +dots[j] + x;
            dots[++j] = +dots[j] + y;
          }
          res.pop();
          res = res.concat(catmullRom2bezier(dots, crz));
          break;
        case "O":
          res.pop();
          dots = ellipsePath(x, y, pa[1], pa[2]);
          dots.push(dots[0]);
          res = res.concat(dots);
          break;
        case "U":
          res.pop();
          res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
          r = ["U"].concat(res[res.length - 1].slice(-2));
          break;
        case "M":
          mx = +pa[1] + x;
          my = +pa[2] + y;
        default:
          for (j = 1, jj = pa.length; j < jj; j++) {
            r[j] = +pa[j] + ((j % 2) ? x : y);
          }
      }
    } else if (pa0 == "R") {
      dots = [x, y].concat(pa.slice(1));
      res.pop();
      res = res.concat(catmullRom2bezier(dots, crz));
      r = ["R"].concat(pa.slice(-2));
    } else if (pa0 == "O") {
      res.pop();
      dots = ellipsePath(x, y, pa[1], pa[2]);
      dots.push(dots[0]);
      res = res.concat(dots);
    } else if (pa0 == "U") {
      res.pop();
      res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
      r = ["U"].concat(res[res.length - 1].slice(-2));
    } else {
      for (var k = 0, kk = pa.length; k < kk; k++) {
        r[k] = pa[k];
      }
    }
    pa0 = pa0.toUpperCase();
    if (pa0 != "O") {
      switch (r[0]) {
        case "Z":
          x = +mx;
          y = +my;
          break;
        case "H":
          x = r[1];
          break;
        case "V":
          y = r[1];
          break;
        case "M":
          mx = r[r.length - 2];
          my = r[r.length - 1];
        default:
          x = r[r.length - 2];
          y = r[r.length - 1];
      }
    }
  }

  return res;
};

var l2c = function(x1, y1, x2, y2) {
  return [x1, y1, x2, y2, x2, y2];
};
var q2c = function(x1, y1, ax, ay, x2, y2) {
  var _13 = 1 / 3,
      _23 = 2 / 3;
  return [
          _13 * x1 + _23 * ax,
          _13 * y1 + _23 * ay,
          _13 * x2 + _23 * ax,
          _13 * y2 + _23 * ay,
          x2,
          y2
      ];
};
var a2c = function(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
  // for more information of where this math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  var _120 = Math.PI * 120 / 180,
      rad = Math.PI / 180 * (+angle || 0),
      res = [],
      xy,
      rotate = function (x, y, rad) {
          var X = x * Math.cos(rad) - y * Math.sin(rad),
              Y = x * Math.sin(rad) + y * Math.cos(rad);
          return {x: X, y: Y};
      };
  if (!recursive) {
    xy = rotate(x1, y1, -rad);
    x1 = xy.x;
    y1 = xy.y;
    xy = rotate(x2, y2, -rad);
    x2 = xy.x;
    y2 = xy.y;
    var cos = Math.cos(Math.PI / 180 * angle),
        sin = Math.sin(Math.PI / 180 * angle),
        x = (x1 - x2) / 2,
        y = (y1 - y2) / 2;
    var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    var rx2 = rx * rx,
        ry2 = ry * ry,
        k = (large_arc_flag == sweep_flag ? -1 : 1) *
            Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
        cx = k * rx * y / ry + (x1 + x2) / 2,
        cy = k * -ry * x / rx + (y1 + y2) / 2,
        f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
        f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    f1 < 0 && (f1 = Math.PI * 2 + f1);
    f2 < 0 && (f2 = Math.PI * 2 + f2);
    if (sweep_flag && f1 > f2) {
      f1 = f1 - Math.PI * 2;
    }
    if (!sweep_flag && f2 > f1) {
      f2 = f2 - Math.PI * 2;
    }
  } else {
    f1 = recursive[0];
    f2 = recursive[1];
    cx = recursive[2];
    cy = recursive[3];
  }
  var df = f2 - f1;
  if (Math.abs(df) > _120) {
    var f2old = f2,
        x2old = x2,
        y2old = y2;
    f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  var c1 = Math.cos(f1),
      s1 = Math.sin(f1),
      c2 = Math.cos(f2),
      s2 = Math.sin(f2),
      t = Math.tan(df / 4),
      hx = 4 / 3 * rx * t,
      hy = 4 / 3 * ry * t,
      m1 = [x1, y1],
      m2 = [x1 + hx * s1, y1 - hy * c1],
      m3 = [x2 + hx * s2, y2 - hy * c2],
      m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [m2, m3, m4].concat(res);
  } else {
    res = [m2, m3, m4].concat(res).join().split(",");
    var newres = [];
    for (var i = 0, ii = res.length; i < ii; i++) {
      newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
    }
    return newres;
  }
};

var path2curve=function(path, path2) {
  var p = pathToAbsolute(path),
      p2 = path2 && pathToAbsolute(path2),
      attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      processPath = function (path, d, pcom) {
        var nx, ny;
        if (!path) {
          return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
        }
        !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
        switch (path[0]) {
          case "M":
            d.X = path[1];
            d.Y = path[2];
            break;
          case "A":
            path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
            break;
          case "S":
            if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
              nx = d.x * 2 - d.bx;          // And reflect the previous
              ny = d.y * 2 - d.by;          // command's control point relative to the current point.
            }
            else {                            // or some else or nothing
              nx = d.x;
              ny = d.y;
            }
            path = ["C", nx, ny].concat(path.slice(1));
            break;
          case "T":
            if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
              d.qx = d.x * 2 - d.qx;        // And make a reflection similar
              d.qy = d.y * 2 - d.qy;        // to case "S".
            }
            else {                            // or something else or nothing
              d.qx = d.x;
              d.qy = d.y;
            }
            path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
            break;
          case "Q":
            d.qx = path[1];
            d.qy = path[2];
            path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
            break;
          case "L":
            path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
            break;
          case "H":
            path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
            break;
          case "V":
            path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
            break;
          case "Z":
            path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
            break;
        }
        return path;
      },
      fixArc = function (pp, i) {
        if (pp[i].length > 7) {
          pp[i].shift();
          var pi = pp[i];
          while (pi.length) {
            pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
            p2 && (pcoms2[i] = "A"); // the same as above
            pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
          }
          pp.splice(i, 1);
          ii = Math.max(p.length, p2 && p2.length || 0);
        }
      },
      fixM = function (path1, path2, a1, a2, i) {
        if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
          path2.splice(i, 0, ["M", a2.x, a2.y]);
          a1.bx = 0;
          a1.by = 0;
          a1.x = path1[i][1];
          a1.y = path1[i][2];
          ii = Math.max(p.length, p2 && p2.length || 0);
        }
      },
      pcoms1 = [], // path commands of original path p
      pcoms2 = [], // path commands of original path p2
      pfirst = "", // temporary holder for original path command
      pcom = ""; // holder for previous path command of original path
  for (var i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
    p[i] && (pfirst = p[i][0]); // save current path command

    if (pfirst != "C") { // C is not saved yet, because it may be result of conversion
      pcoms1[i] = pfirst; // Save current path command
      i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
    }
    p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

    if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
    // which may produce multiple C:s
    // so we have to make sure that C is also C in original path

    fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

    if (p2) { // the same procedures is done to p2
      p2[i] && (pfirst = p2[i][0]);
      if (pfirst != "C") {
        pcoms2[i] = pfirst;
        i && (pcom = pcoms2[i - 1]);
      }
      p2[i] = processPath(p2[i], attrs2, pcom);

      if (pcoms2[i] != "A" && pfirst == "C") {
        pcoms2[i] = "C";
      }

      fixArc(p2, i);
    }
    fixM(p, p2, attrs, attrs2, i);
    fixM(p2, p, attrs2, attrs, i);
    var seg = p[i],
        seg2 = p2 && p2[i],
        seglen = seg.length,
        seg2len = p2 && seg2.length;
    attrs.x = seg[seglen - 2];
    attrs.y = seg[seglen - 1];
    attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
    attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
    attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
    attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
    attrs2.x = p2 && seg2[seg2len - 2];
    attrs2.y = p2 && seg2[seg2len - 1];
  }

  return p2 ? [p, p2] : p;
};

var box=function(x, y, width, height) {
  if (x == null) {
    x = y = width = height = 0;
  }
  if (y == null) {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  return {
    x: x,
    y: y,
    w: width,
    h: height,
    cx: x + width / 2,
    cy: y + height / 2
  };
};

// Returns bounding box of cubic bezier curve.
// Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
// Original version: NISHIO Hirokazu
// Modifications: https://github.com/timo22345
var curveDim=function(x0, y0, x1, y1, x2, y2, x3, y3) {
  var tvalues = [],
      bounds = [[], []],
      a, b, c, t, t1, t2, b2ac, sqrtb2ac;
  for (var i = 0; i < 2; ++i) {
    if (i == 0) {
      b = 6 * x0 - 12 * x1 + 6 * x2;
      a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
      c = 3 * x1 - 3 * x0;
    } else {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    sqrtb2ac = Math.sqrt(b2ac);
    if (b2ac < 0) {
      continue;
    }
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  var x, y, j = tvalues.length,
      jlen = j,
      mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    bounds[0][j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
    bounds[1][j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  bounds[0].length = bounds[1].length = jlen + 2;

  return {
    min: {x: Math.min.apply(0, bounds[0]), y: Math.min.apply(0, bounds[1])},
    max: {x: Math.max.apply(0, bounds[0]), y: Math.max.apply(0, bounds[1])}
  };
};

var curvePathBBox=function(path) {
  var x = 0,
      y = 0,
      X = [],
      Y = [],
      p;
  for (var i = 0, ii = path.length; i < ii; i++) {
    p = path[i];
    if (p[0] == "M") {
      x = p[1];
      y = p[2];
      X.push(x);
      Y.push(y);
    } else {
      var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
      X = X.concat(dim.min.x, dim.max.x);
      Y = Y.concat(dim.min.y, dim.max.y);
      x = p[5];
      y = p[6];
    }
  }
  var xmin = Math.min.apply(0, X),
      ymin = Math.min.apply(0, Y),
      xmax = Math.max.apply(0, X),
      ymax = Math.max.apply(0, Y),
      bb = box(xmin, ymin, xmax - xmin, ymax - ymin);

  return bb;
};

var p2s=/,?([a-z]),?/gi;
var path2string=function(path) {
  return path.join(',').replace(p2s, "$1");
};

/*
 * Styles
 */

var hsrg = {hs: 1, rg: 1},
    has = "hasOwnProperty",
    colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
    commaSpaces = new RegExp("[" + spaces + "]*,[" + spaces + "]*");

// Converts RGB values to a hex representation of the color
// var rgb = function (r, g, b, o) {
//   if (isFinite(o)) {
//     var round = math.round;
//     return "rgba(" + [round(r), round(g), round(b), +o.toFixed(2)] + ")";
//   }
//   return "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
// };
var rgbToString = function (rgb) {
  var round = Math.round;
  return "rgba(" + [round(rgb.r), round(rgb.g), round(rgb.b), +rgb.opacity.toFixed(2)] + ")";
};
var toHex = function (color) {
  var i = window.document.getElementsByTagName("head")[0] || window.document.getElementsByTagName("svg")[0],
      red = "rgb(255, 0, 0)";
  toHex = function (color) {
    if (color.toLowerCase() == "red") {
      return red;
    }
    i.style.color = red;
    i.style.color = color;
    var out = window.document.defaultView.getComputedStyle(i, "").getPropertyValue("color");
    return out == red ? null : out;
  };
  return toHex(color);
};

var packageRGB = function (r, g, b, o) {
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  var rgb = {
      r: r,
      g: g,
      b: b,
      opacity: isFinite(o) ? o : 1
  };
  return rgb;
};

// Converts HSB values to an RGB object
var hsb2rgb = function (h, s, v, o) {
  if (typeof h === typeof {} && "h" in h && "s" in h && "b" in h) {
      v = h.b;
      s = h.s;
      h = h.h;
      o = h.o;
  }
  h *= 360;
  var R, G, B, X, C;
  h = (h % 360) / 60;
  C = v * s;
  X = C * (1 - Math.abs(h % 2 - 1));
  R = G = B = v - C;

  h = ~~h;
  R += [C, X, 0, 0, X, C][h];
  G += [X, C, C, X, 0, 0][h];
  B += [0, 0, X, C, C, X][h];
  return packageRGB(R, G, B, o);
};

// Converts HSL values to an RGB object
var hsl2rgb = function (h, s, l, o) {
  if (typeof h === typeof {} && "h" in h && "s" in h && "l" in h) {
    l = h.l;
    s = h.s;
    h = h.h;
  }
  if (h > 1 || s > 1 || l > 1) {
    h /= 360;
    s /= 100;
    l /= 100;
  }
  h *= 360;
  var R, G, B, X, C;
  h = (h % 360) / 60;
  C = 2 * s * (l < .5 ? l : 1 - l);
  X = C * (1 - Math.abs(h % 2 - 1));
  R = G = B = l - C / 2;

  h = ~~h;
  R += [C, X, 0, 0, X, C][h];
  G += [X, C, C, X, 0, 0][h];
  B += [0, 0, X, C, C, X][h];
  return packageRGB(R, G, B, o);
};

// Parses color string as RGB object
var getRGB = function (colour) {
  if (!colour || !!((colour = String(colour)).indexOf("-") + 1)) {
    return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
  }
  if (colour == "none") {
    return {r: -1, g: -1, b: -1, opacity: -1};
  }
  !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
  if (!colour) {
    return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
  }
  var res,
      red,
      green,
      blue,
      opacity,
      t,
      values,
      rgb = colour.match(colourRegExp);
  if (rgb) {
    if (rgb[2]) {
      blue = parseInt(rgb[2].substring(5), 16);
      green = parseInt(rgb[2].substring(3, 5), 16);
      red = parseInt(rgb[2].substring(1, 3), 16);
    }
    if (rgb[3]) {
      blue = parseInt((t = rgb[3].charAt(3)) + t, 16);
      green = parseInt((t = rgb[3].charAt(2)) + t, 16);
      red = parseInt((t = rgb[3].charAt(1)) + t, 16);
    }
    if (rgb[4]) {
      values = rgb[4].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red *= 2.55);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green *= 2.55);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue *= 2.55);
      rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
    }
    if (rgb[5]) {
      values = rgb[5].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red /= 100);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green /= 100);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue /= 100);
      (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
      rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
      return hsb2rgb(red, green, blue, opacity);
    }
    if (rgb[6]) {
      values = rgb[6].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red /= 100);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green /= 100);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue /= 100);
      (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
      rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
      return hsl2rgb(red, green, blue, opacity);
    }
    red = Math.min(Math.round(red), 255);
    green = Math.min(Math.round(green), 255);
    blue = Math.min(Math.round(blue), 255);
    opacity = Math.min(Math.max(opacity, 0), 1);
    rgb = {r: red, g: green, b: blue};
    rgb.opacity = isFinite(opacity) ? opacity : 1;
    return rgb;
  }
  return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
};

function SVGMorpheus(element, options, callback) {
  if (!element) {
    throw new Error('SVGMorpheus > "element" is required');
  }

  if(typeof element === typeof '') {
    element=document.querySelector(element);
    if (!element) {
      throw new Error('SVGMorpheus > "element" query is not related to an existing DOM node');
    }
  }

  if (!!options && typeof options !== typeof {}) {
    throw new Error('SVGMorpheus > "options" parameter must be an object');
  }
  options = options || {};

  if (!!callback && typeof callback !== typeof (function(){})) {
    throw new Error('SVGMorpheus > "callback" parameter must be a function');
  }

  var that=this;

  this._icons={};
  this._curIconId=options.iconId || '';
  this._toIconId='';
  this._curIconItems=[];
  this._fromIconItems=[];
  this._toIconItems=[];
  this._morphNodes=[];
  this._morphG;
  this._startTime;
  this._defDuration=options.duration || 750;
  this._defEasing=options.easing || 'quad-in-out';
  this._defRotation=options.rotation || 'clock';
  this._defCallback = callback || function () {};
  this._duration=this._defDuration;
  this._easing=this._defEasing;
  this._rotation=this._defRotation;
  this._callback=this._defCallback;
  this._rafid;

  this._fnTick=function(timePassed) {
    if(!that._startTime) {
      that._startTime=timePassed;
    }
    var progress=Math.min((timePassed-that._startTime)/that._duration,1);
    that._updateAnimationProgress(progress);
    if(progress<1) {
      that._rafid=_reqAnimFrame(that._fnTick);
    } else {
      if (that._toIconId != '') {
        that._animationEnd();
      }
    }
  };

  if(element.nodeName.toUpperCase()==='SVG') {
    this._svgDoc=element;
  } else {
    this._svgDoc = element.getSVGDocument();
  }
  if(!this._svgDoc) {
    element.addEventListener("load",function(){
      that._svgDoc = element.getSVGDocument();
      that._init();
    },false);
  } else {
    that._init();
  }
}

SVGMorpheus.prototype._init=function(){
  if(this._svgDoc.nodeName.toUpperCase()!=='SVG') {
    this._svgDoc=this._svgDoc.getElementsByTagName('svg')[0];
  }

  if(!!this._svgDoc) {
    var lastIconId='',
        i, len, id, items, item, j, len2, icon;

    // Read Icons Data
    // Icons = 1st tier G nodes having ID
    for(i=this._svgDoc.childNodes.length-1;i>=0;i--) {
      var nodeIcon=this._svgDoc.childNodes[i];
      if(nodeIcon.nodeName.toUpperCase()==='G') {
        id=nodeIcon.getAttribute('id');
        if(!!id) {
          items=[];
          for(j=0, len2=nodeIcon.childNodes.length;j<len2;j++) {
            var nodeItem=nodeIcon.childNodes[j];
            item={
              path: '',
              attrs: {},
              style: {}
            };

            // Get Item Path (Convert all shapes into Path Data)
            switch(nodeItem.nodeName.toUpperCase()) {
              case 'PATH':
                item.path=nodeItem.getAttribute('d');
                break;
              case 'CIRCLE':
                var cx=nodeItem.getAttribute('cx')*1,
                    cy=nodeItem.getAttribute('cy')*1,
                    r=nodeItem.getAttribute('r')*1;
                item.path='M'+(cx-r)+','+cy+'a'+r+','+r+' 0 1,0 '+(r*2)+',0a'+r+','+r+' 0 1,0 -'+(r*2)+',0z';
                break;
              case 'ELLIPSE':
                var cx=nodeItem.getAttribute('cx')*1,
                    cy=nodeItem.getAttribute('cy')*1,
                    rx=nodeItem.getAttribute('rx')*1,
                    ry=nodeItem.getAttribute('ry')*1;
                item.path='M'+(cx-rx)+','+cy+'a'+rx+','+ry+' 0 1,0 '+(rx*2)+',0a'+rx+','+ry+' 0 1,0 -'+(rx*2)+',0z';
                break;
              case 'RECT':
                var x=nodeItem.getAttribute('x')*1,
                    y=nodeItem.getAttribute('y')*1,
                    w=nodeItem.getAttribute('width')*1,
                    h=nodeItem.getAttribute('height')*1,
                    rx=nodeItem.getAttribute('rx')*1,
                    ry=nodeItem.getAttribute('ry')*1;
                if(!rx && !ry) {
                  item.path='M'+x+','+y+'l'+w+',0l0,'+h+'l-'+w+',0z';
                } else {
                  item.path='M'+(x+rx)+','+y+
                            'l'+(w-rx*2)+',0'+
                            'a'+rx+','+ry+' 0 0,1 '+rx+','+ry+
                            'l0,'+(h-ry*2)+
                            'a'+rx+','+ry+' 0 0,1 -'+rx+','+ry+
                            'l'+(rx*2-w)+',0'+
                            'a'+rx+','+ry+' 0 0,1 -'+rx+',-'+ry+
                            'l0,'+(ry*2-h)+
                            'a'+rx+','+ry+' 0 0,1 '+rx+',-'+ry+
                            'z';
                }
                break;
              case 'POLYGON':
                var points=nodeItem.getAttribute('points');
                var p = points.split(/\s+/);
                var path = "";
                for( var k = 0, len = p.length; k < len; k++ ){
                    path += (k && "L" || "M") + p[k]
                }
                item.path=path+'z';
                break;
              case 'LINE':
                var x1=nodeItem.getAttribute('x1')*1,
                    y1=nodeItem.getAttribute('y1')*1,
                    x2=nodeItem.getAttribute('x2')*1,
                    y2=nodeItem.getAttribute('y2')*1;
                item.path='M'+x1+','+y1+'L'+x2+','+y2+'z';
                break;
            }
            if(item.path!='') {
              // Traverse all attributes and get style values
              for (var k = 0, len3=nodeItem.attributes.length; k < len3; k++) {
                var attrib = nodeItem.attributes[k];
                if (attrib.specified) {
                  var name=attrib.name.toLowerCase();
                  switch (name) {
                    case 'fill':
                    case 'fill-opacity':
                    case 'opacity':
                    case 'stroke':
                    case 'stroke-opacity':
                    case 'stroke-width':
                      item.attrs[name]=attrib.value;
                  }
                }
              }

              // Traverse all inline styles and get supported values
              for (var l = 0, len4=nodeItem.style.length; l < len4; l++) {
                var styleName = nodeItem.style[l];
                switch (styleName) {
                  case 'fill':
                  case 'fill-opacity':
                  case 'opacity':
                  case 'stroke':
                  case 'stroke-opacity':
                  case 'stroke-width':
                    item.style[styleName]=nodeItem.style[styleName];
                }
              }

              items.push(item);
            }
          }

          // Add Icon
          if(items.length>0) {
            icon={
              id: id,
              items: items
            };
            this._icons[id]=icon;
          }

          // Init Node for Icons Items and remove Icon Nodes
          if(!this._morphG) {
            lastIconId=id;
            this._morphG=document.createElementNS('http://www.w3.org/2000/svg', 'g');
            this._svgDoc.replaceChild(this._morphG,nodeIcon);
          } else {
            this._svgDoc.removeChild(nodeIcon);
          }
        }
      }
    }
    // To Default Icon
    var defaultIcon = this._curIconId || lastIconId;
    if(defaultIcon!=='') {
      this._setupAnimation(defaultIcon);
      this._updateAnimationProgress(1);
      this._animationEnd();
    }
  }

};

SVGMorpheus.prototype._setupAnimation=function(toIconId) {
  if(!!toIconId && !!this._icons[toIconId]) {
    this._toIconId=toIconId;
    this._startTime=undefined;
    var i, len, j, len2;
    this._fromIconItems=clone(this._curIconItems);
    this._toIconItems=clone(this._icons[toIconId].items);

    for(i=0, len=this._morphNodes.length;i<len;i++) {
      var morphNode=this._morphNodes[i];
      morphNode.fromIconItemIdx=i;
      morphNode.toIconItemIdx=i;
    }

    var maxNum=Math.max(this._fromIconItems.length, this._toIconItems.length);
    var toBB;
    for(i=0;i<maxNum;i++) {
      // Add items to fromIcon/toIcon if needed
      if(!this._fromIconItems[i]) {
        if(!!this._toIconItems[i]) {
          toBB=curvePathBBox(path2curve(this._toIconItems[i].path));
          this._fromIconItems.push({
            path: 'M'+toBB.cx+','+toBB.cy+'l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,toBB.cx,toBB.cy]
            }
          });
        } else {
          this._fromIconItems.push({
            path: 'M0,0l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,0,0]
            }
          });
        }
      }
      if(!this._toIconItems[i]) {
        if(!!this._fromIconItems[i]) {
          toBB=curvePathBBox(path2curve(this._fromIconItems[i].path));
          this._toIconItems.push({
            path: 'M'+toBB.cx+','+toBB.cy+'l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,toBB.cx,toBB.cy]
            }
          });
        } else {
          this._toIconItems.push({
            path: 'M0,0l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,0,0]
            }
          });
        }
      }

      // Add Node to DOM if needed
      if(!this._morphNodes[i]) {
        var node=document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._morphG.appendChild(node);
        this._morphNodes.push({
          node: node,
          fromIconItemIdx: i,
          toIconItemIdx: i
        });
      }
    }

    for(i=0;i<maxNum;i++) {
      var fromIconItem=this._fromIconItems[i];
      var toIconItem=this._toIconItems[i];

      // Calculate from/to curve data and set to fromIcon/toIcon
      var curves=path2curve(this._fromIconItems[i].path,this._toIconItems[i].path);
      fromIconItem.curve=curves[0];
      toIconItem.curve=curves[1];

      // Normalize from/to attrs
      var attrsNorm=styleToNorm(this._fromIconItems[i].attrs,this._toIconItems[i].attrs);
      fromIconItem.attrsNorm=attrsNorm[0];
      toIconItem.attrsNorm=attrsNorm[1];
      fromIconItem.attrs=styleNormToString(fromIconItem.attrsNorm);
      toIconItem.attrs=styleNormToString(toIconItem.attrsNorm);

      // Normalize from/to style
      var styleNorm=styleToNorm(this._fromIconItems[i].style,this._toIconItems[i].style);
      fromIconItem.styleNorm=styleNorm[0];
      toIconItem.styleNorm=styleNorm[1];
      fromIconItem.style=styleNormToString(fromIconItem.styleNorm);
      toIconItem.style=styleNormToString(toIconItem.styleNorm);

      // Calculate from/to transform
      toBB=curvePathBBox(toIconItem.curve);
      toIconItem.trans={
        'rotate': [0,toBB.cx,toBB.cy]
      };
      var rotation=this._rotation, degAdd;
      if(rotation==='random') {
        rotation=Math.random()<0.5?'counterclock':'clock';
      }
      switch(rotation) {
        case 'none':
          if(!!fromIconItem.trans.rotate) {
            toIconItem.trans.rotate[0]=fromIconItem.trans.rotate[0];
          }
          break;
        case 'counterclock':
          if(!!fromIconItem.trans.rotate) {
            toIconItem.trans.rotate[0]=fromIconItem.trans.rotate[0]-360;
            degAdd=-fromIconItem.trans.rotate[0]%360;
            toIconItem.trans.rotate[0]+=(degAdd<180?degAdd:degAdd-360);
          } else {
            toIconItem.trans.rotate[0]=-360;
          }
          break;
        default: // Clockwise
          if(!!fromIconItem.trans.rotate) {
            toIconItem.trans.rotate[0]=fromIconItem.trans.rotate[0]+360;
            degAdd=fromIconItem.trans.rotate[0]%360;
            toIconItem.trans.rotate[0]+=(degAdd<180?-degAdd:360-degAdd);
          } else {
            toIconItem.trans.rotate[0]=360;
          }
          break;
      }
    }

    this._curIconItems=clone(this._fromIconItems);
  }
};

SVGMorpheus.prototype._updateAnimationProgress=function(progress) {
  progress=easings[this._easing](progress);

  var i, j, k, len;
  // Update path/attrs/transform
  for(i=0, len=this._curIconItems.length;i<len;i++) {
    this._curIconItems[i].curve=curveCalc(this._fromIconItems[i].curve, this._toIconItems[i].curve, progress);
    this._curIconItems[i].path=path2string(this._curIconItems[i].curve);

    this._curIconItems[i].attrsNorm=styleNormCalc(this._fromIconItems[i].attrsNorm, this._toIconItems[i].attrsNorm, progress);
    this._curIconItems[i].attrs=styleNormToString(this._curIconItems[i].attrsNorm);

    this._curIconItems[i].styleNorm=styleNormCalc(this._fromIconItems[i].styleNorm, this._toIconItems[i].styleNorm, progress);
    this._curIconItems[i].style=styleNormToString(this._curIconItems[i].styleNorm);

    this._curIconItems[i].trans=transCalc(this._fromIconItems[i].trans, this._toIconItems[i].trans, progress);
    this._curIconItems[i].transStr=trans2string(this._curIconItems[i].trans);
  }

  // Update DOM
  for(i=0, len=this._morphNodes.length;i<len;i++) {
    var morphNode=this._morphNodes[i];
    morphNode.node.setAttribute("d",this._curIconItems[i].path);
    var attrs=this._curIconItems[i].attrs;
    for(j in attrs) {
      morphNode.node.setAttribute(j,attrs[j]);
    }
    var style=this._curIconItems[i].style;
    for(k in style) {
      morphNode.node.style[k]=style[k];
    }
    morphNode.node.setAttribute("transform",this._curIconItems[i].transStr);
  }
};

SVGMorpheus.prototype._animationEnd=function() {
  for(var i=this._morphNodes.length-1;i>=0;i--) {
    var morphNode=this._morphNodes[i];
    if(!!this._icons[this._toIconId].items[i]) {
      morphNode.node.setAttribute("d",this._icons[this._toIconId].items[i].path);
    } else {
      morphNode.node.parentNode.removeChild(morphNode.node);
      this._morphNodes.splice(i,1);
    }
  }

  this._curIconId=this._toIconId;
  this._toIconId='';

  this._callback();
};

/*
 * Public methods
 */

// Morph To Icon
SVGMorpheus.prototype.to=function(iconId, options, callback) {
  if(iconId!==this._toIconId) {
    if (!!options && typeof options !== typeof {}) {
      throw new Error('SVGMorpheus.to() > "options" parameter must be an object');
    }
    options = options || {};

    if (!!callback && typeof callback !== typeof (function(){})) {
      throw new Error('SVGMorpheus.to() > "callback" parameter must be a function');
    }

    _cancelAnimFrame(this._rafid);

    this._duration=options.duration || this._defDuration;
    this._easing=options.easing || this._defEasing;
    this._rotation=options.rotation || this._defRotation;
    this._callback=callback || this._defCallback;

    this._setupAnimation(iconId);
    this._rafid=_reqAnimFrame(this._fnTick);
  }
};

// Register custom Easing function
SVGMorpheus.prototype.registerEasing=function(name, fn) {
  easings[name] = fn;
}

if (typeof define === 'function' && define.amd) {
  define(function () {
    return SVGMorpheus
  })
} else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = SVGMorpheus
} else {
  window.SVGMorpheus = SVGMorpheus
}

}());