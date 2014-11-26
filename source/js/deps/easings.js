/*
 * Easing functions
 */

'use strict';

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
