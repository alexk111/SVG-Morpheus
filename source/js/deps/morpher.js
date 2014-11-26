/*
 * Morpher class
 */

'use strict';

function Morpher(container, state, dur, easing) {
  var that=this;

  this._states={};
  this._curStateId=state || '';
  this._toStateId='';
  this._curStateItems=[];
  this._fromStateItems=[];
  this._toStateItems=[];
  this._nodesMorph=[];
  this._nodeStates;
  this._startTime;
  this._duration=dur || 1000;
  this._easing=easing || 'linear';
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

  if(container.nodeName.toUpperCase()==='SVG') {
    this._svgDoc=container;
  } else {
    this._svgDoc = container.getSVGDocument();
  }
  if(!this._svgDoc) {
    container.addEventListener("load",function(){
      that._svgDoc = container.getSVGDocument();
      that._init();
    },false);
  } else {
    that._init();
  }
}

Morpher.prototype._init=function(){
  if(this._svgDoc.nodeName.toUpperCase()!=='SVG') {
    this._svgDoc=this._svgDoc.getElementsByTagName('svg')[0];
  }

  if(!!this._svgDoc) {
    var firstStateId='';

    // Read States Data
    // States = 1st tier G nodes having ID
    for(var i=this._svgDoc.childNodes.length-1;i>=0;i--) {
      var nodeState=this._svgDoc.childNodes[i];
      if(nodeState.nodeName.toUpperCase()==='G') {
        var id=nodeState.getAttribute('id');
        if(!!id) {
          var items=[];
          for(var j=0, len2=nodeState.childNodes.length;j<len2;j++) {
            var nodeItem=nodeState.childNodes[j];
            var item={
              path: '',
              attrs: {}
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
                    case 'stroke':
                    case 'stroke-width':
                      item.attrs[name]=attrib.value;
                  }
                }
              }
              items.push(item);
            }
          }

          // Add State
          if(items.length>0) {
            var state={
              id: id,
              items: items
            };
            this._states[id]=state;
          }

          // Init Node for States Items and remove State Nodes
          if(!this._nodeStates) {
            firstStateId=id;
            this._nodeStates=document.createElementNS('http://www.w3.org/2000/svg', 'g');
            this._svgDoc.replaceChild(this._nodeStates,nodeState);
          } else {
            this._svgDoc.removeChild(nodeState);
          }
        }
      }
    }
    // To Default State
    if(firstStateId!=='') {
      this._setupAnimation(firstStateId);
      this._updateAnimationProgress(1);
      this._animationEnd();
    }
  }

};


Morpher.prototype._setupAnimation=function(toStateId) {
  if(!!toStateId && !!this._states[toStateId]) {
    this._toStateId=toStateId;
    this._startTime=undefined;
    var i, len, j, len2;
    this._fromStateItems=clone(this._curStateItems);
    this._toStateItems=clone(this._states[toStateId].items);

    for(i=0, len=this._nodesMorph.length;i<len;i++) {
      var nodeMorph=this._nodesMorph[i];
      nodeMorph.fromStateItemIdx=i;
      nodeMorph.toStateItemIdx=i;
    }

    var maxNum=Math.max(this._fromStateItems.length, this._toStateItems.length);
    var toBB;
    for(i=0;i<maxNum;i++) {
      // Add items to fromState/toState if needed
      if(!this._fromStateItems[i]) {
        if(!!this._toStateItems[i]) {
          toBB=curvePathBBox(path2curve(this._toStateItems[i].path));
          this._fromStateItems.push({
            path: 'M'+toBB.cx+','+toBB.cy+'l0,0',
            attrs: {},
            trans: {
              'rotate': [0,toBB.cx,toBB.cy]
            }
          });
        } else {
          this._fromStateItems.push({
            path: 'M0,0l0,0',
            attrs: {},
            trans: {
              'rotate': [0,0,0]
            }
          });
        }
      }
      if(!this._toStateItems[i]) {
        if(!!this._fromStateItems[i]) {
          toBB=curvePathBBox(path2curve(this._fromStateItems[i].path));
          this._toStateItems.push({
            path: 'M'+toBB.cx+','+toBB.cy+'l0,0',
            attrs: {},
            trans: {
              'rotate': [0,toBB.cx,toBB.cy]
            }
          });
        } else {
          this._toStateItems.push({
            path: 'M0,0l0,0',
            attrs: {},
            trans: {
              'rotate': [0,0,0]
            }
          });
        }
      }


      // Add Node to DOM if needed
      if(!this._nodesMorph[i]) {
        var node=document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._nodeStates.appendChild(node);
        this._nodesMorph.push({
          node: node,
          fromStateItemIdx: i,
          toStateItemIdx: i
        });
      }
    }

    for(i=0;i<maxNum;i++) {
      var fromStateItem=this._fromStateItems[i];
      var toStateItem=this._toStateItems[i];

      // Calculate from/to curve data and set to fromState/toState
      var curves=path2curve(this._fromStateItems[i].path,this._toStateItems[i].path);
      fromStateItem.curve=curves[0];
      toStateItem.curve=curves[1];

      // Normalize from/to attrs
      var attrsNorm=attrsToNorm(this._fromStateItems[i].attrs,this._toStateItems[i].attrs);
      fromStateItem.attrsNorm=attrsNorm[0];
      toStateItem.attrsNorm=attrsNorm[1];
      fromStateItem.attrs=attrsNormToString(fromStateItem.attrsNorm);
      toStateItem.attrs=attrsNormToString(toStateItem.attrsNorm);

      // Calculate from/to transform
      toBB=curvePathBBox(toStateItem.curve);
      toStateItem.trans={
        'rotate': [0,toBB.cx,toBB.cy]
      };
      if(!!fromStateItem.trans.rotate) {
        toStateItem.trans.rotate[0]=fromStateItem.trans.rotate[0]+360;
        var degAdd=fromStateItem.trans.rotate[0]%360;
        toStateItem.trans.rotate[0]+=(degAdd<180?-degAdd:360-degAdd);
      } else {
        toStateItem.trans.rotate[0]=360;
      }
    }

    this._curStateItems=clone(this._fromStateItems);
  }
};

Morpher.prototype._updateAnimationProgress=function(progress) {
  progress=easings[this._easing](progress);

  // Update path/attrs/transform
  for(var i=0, len=this._curStateItems.length;i<len;i++) {
    this._curStateItems[i].curve=curveCalc(this._fromStateItems[i].curve, this._toStateItems[i].curve, progress);
    this._curStateItems[i].path=path2string(this._curStateItems[i].curve);

    this._curStateItems[i].attrsNorm=attrsNormCalc(this._fromStateItems[i].attrsNorm, this._toStateItems[i].attrsNorm, progress);
    this._curStateItems[i].attrs=attrsNormToString(this._curStateItems[i].attrsNorm);

    this._curStateItems[i].trans=transCalc(this._fromStateItems[i].trans, this._toStateItems[i].trans, progress);
    this._curStateItems[i].transStr=trans2string(this._curStateItems[i].trans);
  }

  // Update DOM
  for(var i=0, len=this._nodesMorph.length;i<len;i++) {
    var nodeMorph=this._nodesMorph[i];
    nodeMorph.node.setAttribute("d",this._curStateItems[i].path);
    var attrs=this._curStateItems[i].attrs;
    for(var j in attrs) {
      nodeMorph.node.setAttribute(j,attrs[j]);
    }
    nodeMorph.node.setAttribute("transform",this._curStateItems[i].transStr);
  }
};

Morpher.prototype._animationEnd=function() {
  for(var i=this._nodesMorph.length-1;i>=0;i--) {
    var nodeMorph=this._nodesMorph[i];
    if(!!this._states[this._toStateId].items[i]) {
      nodeMorph.node.setAttribute("d",this._states[this._toStateId].items[i].path);
    } else {
      nodeMorph.node.parentNode.removeChild(nodeMorph.node);
      this._nodesMorph.splice(i,1);
    }
  }

  this._curStateId=this._toStateId;
  this._toStateId='';
};

/*
 * Public methods
 */

// Morph To State
Morpher.prototype.to=function(stateId, dur, easing) {
  if(stateId!==this._toStateId) {
    _cancelAnimFrame(this._rafid);
    if(!!dur) {
      this._duration=dur;
    }
    if(!!easing) {
      this._easing=easing;
    }
    this._setupAnimation(stateId);
    this._rafid=_reqAnimFrame(this._fnTick);
  }
};
