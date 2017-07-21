/*! SVG Morpheus v0.4 License: MIT */!function(){"use strict";!function(e){e.SVGMorpheus={options:function(n){var o={action:"queue"};return e.extend(o,n)},instantize:function(e){var n=this;"SVG"!==e.nodeName.toUpperCase()&&(e=e.getSVGDocument(),e=e.getElementsByTagName("svg")[0]);for(var o=[],t=0;t<=e.childNodes.length-1;t++){var u=e.childNodes[t];if("G"===u.nodeName.toUpperCase()){var s="shape-id-"+n.uniqueId();u.id=s,u.style.display="none",o.push(s)}}return{object:new SVGMorpheus(e),data:{groupIds:o}}},uniqueId:function(){var e=Date.now();return e<=this.uniqueId.previous?e=++this.uniqueId.previous:this.uniqueId.previous=e,e}},e.fn.SVGMorpheus=function(n){"undefined"==typeof n&&(n={});var o=e.SVGMorpheus,t=new o.options(n);this.each(function(){var n=e(this)[0],u=o.instantize(n),s=u.object,i=u.data;switch(t.action){case"queue":s.queue(i.groupIds,t);break;case"scrollProgress":var r="undefined"==typeof t.shapeIndex?0:t.shapeIndex;s.setupAnimationBase(i.groupIds[r]),s.handleScroll(i.groupIds[r]),e(document).scroll(function(){s.handleScroll(i.groupIds[r])})}})}}(jQuery)}();