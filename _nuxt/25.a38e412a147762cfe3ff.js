(window.webpackJsonp=window.webpackJsonp||[]).push([[25,31,34,46],{103:function(t,r,e){"use strict";e.r(r),e.d(r,"default",(function(){return o}));var n=e(77);class o extends n.default{onPointerDown(t){var r=t.x,e=t.y,data=[].concat(this._brush.data);return this._app.canvas.addRenderAction((()=>{n.default.drawBrush({color:this._brush.primaryColor,x:r,y:e,data:data,app:this._app})})),{save:!0,render:!0}}}},123:function(t,r,e){"use strict";e.r(r),e.d(r,"default",(function(){return o}));var n=e(103);class o extends n.default{constructor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t.pointerDownHold=!0,super(t)}}},77:function(t,r,e){"use strict";e.r(r),e.d(r,"default",(function(){return o}));var n=e(78);class o extends n.default{constructor(t){super(t),this._brush=t.brush}get brush(){return this._brush}set brush(t){this._brush=t}static drawBrush(t){var{x:r,y:e,data:data,app:n,color:o}=t;r=Math.floor(r-data[0].length/2+1),e=Math.floor(e-data.length/2);for(var c=[],i=0;i<data[0].length;i++)for(var l=0;l<data.length;l++)data[Number(l)][Number(i)]>0&&o.alpha?(n.canvas.setPixel(r+i,e+l,o),c.push([r+i,e+l])):data[Number(l)][Number(i)]<0&&n.canvas.setPixel(r+i,e+l);return c}}},78:function(t,r,e){"use strict";function n(t,r){if(!Object.prototype.hasOwnProperty.call(t,r))throw new TypeError("attempted to use private field on non-instance");return t}e.r(r),e.d(r,"default",(function(){return h}));var o=0;function c(t){return"__private_"+o+++"_"+t}var l=c("pointerDownHold");class h{constructor(t){Object.defineProperty(this,l,{writable:!0,value:!1}),this._app=t.app,this.passive=t.passive||!1,n(this,l)[l]=t.pointerDownHold||!1}get pointerDownHold(){return n(this,l)[l]}deconstructor(){}onActive(){}onPointerDown(){}onPointerUp(){}onPointerMove(){}onContextMenu(){}get app(){return this._app}get setPixel(){return this._app.activeDisplay.setPixel}}}}]);