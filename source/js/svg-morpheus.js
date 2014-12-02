'use strict';

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
      that._animationEnd();
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
    if(lastIconId!=='') {
      this._setupAnimation(lastIconId);
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

return SVGMorpheus;