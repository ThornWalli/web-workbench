(window.webpackJsonp=window.webpackJsonp||[]).push([[22,33,41],{114:function(t,e,r){"use strict";r.r(e),function(t){var h=r(73),n=r(78),d=r(115);class c{static invertImageData(t){for(var i=0,e=0;e<t.width;e++)for(var r=0;r<t.height;r++)i=4*(e+r*t.width),t.data[Number(i)]=255-t.data[Number(i)],t.data[i+1]=255-t.data[i+1],t.data[i+2]=255-t.data[i+2]}static createImageData(e,r,data){return new t.ImageData(new t.Uint8ClampedArray(data||4*e*r),e,r)}static resizeImageData(t){for(var e,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=t.data,d=t.width,h1=t.height,l=d*r,h2=h1*r,_=Array(l*h2*4),m=Object(h.e)(parseInt((d<<16)/l)+1,parseInt((h1<<16)/h2)+1),i=0;i<h2;i++)for(var v=0;v<l;v++)e=v*m.x>>16,o(4*((i*m.y>>16)*d+e),n,4*(i*l+v),_);return c.createImageData(l,h2,_)}static cropImageData(t,e,r,h,n){for(var d=t.data,l=Array(h*n*4),i=0;i<h;i++)for(var _=0;_<n;_++){o(4*(r*t.width+e)+4*(_*t.width+i),d,4*(_*h+i),l)}return c.createImageData(h,n,l)}getActiveContext(){return this._app.display.context}getDisplayContexts(){return this._app.displays.map((t=>t.context))}constructor(t){this._app=t;var e=t.options.size;this._bitmapData=new d.default(e.width,e.height),this._renderActions=[],this._passiveRenderActions=[],this.clearStack()}setSize(t,e){this._bitmapData=new d.default(t,e),this.clearStack(),this.render(),this._app.refresh()}loadImage(image){var t=this.getImageDataFromImage(image);this._bitmapData=new d.default(t.width,t.height),this.clearStack(),this._stacks.push(t),this.render(),this._app.refresh()}getImageDataFromImage(image){var canvas=document.createElement("canvas");canvas.width=image.width,canvas.height=image.height;var t=canvas.getContext("2d");t.drawImage(image,0,0);for(var e=c.createImageData(image.width,image.height),data=t.getImageData(0,0,canvas.width,canvas.height),i=0;i<data.length;i++)e.data[Number(i)]=data[Number(i)];return data}getColorFromPixel(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2]?this._renderImageData:this._stacks[this._stacks.length-1||0],data=r.data,h=e*(4*r.width)+4*t;return new n.default(data[Number(h)],data[h+1],data[h+2],data[h+3])}getPixel(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2]?this._renderImageData:this._stacks[this._stacks.length-1||0],data=r.data,h=e*(4*r.width)+4*t;return data[Number(h)]+data[h+1]+data[h+2]+data[h+3]}setPixel(t,e,r){r=r||this._app.primaryColor;var i=4*(t+e*this._renderImageData.width);this._renderImageData.data[i+0]=r.red,this._renderImageData.data[i+1]=r.green,this._renderImageData.data[i+2]=r.blue,this._renderImageData.data[i+3]=r.alpha>=0?r.alpha:255}putImageData(t,e,r){for(var h,n,d=0;d<t.width;d++)for(var c=0;c<t.height;c++)h=4*(c*t.width+d),n=4*((r+c)*this._renderImageData.width+(e+d)),o(h,t.data,n,this._renderImageData.data)}fillPixels(t,e,r,h,n){for(var d=e;d<Math.min(e+h,this._renderImageData.width);d++)for(var c=r;c<Math.min(r+n,this._renderImageData.height);c++)this.setPixel(d,c,t)}addRenderAction(t){this._renderActions.push(t)}addPassiveRenderAction(t){this._passiveRenderActions.push(t)}cleanPassiveRenderActions(){this._passiveRenderActions=[]}getTmpStack(){return c.createImageData(this._stacks[this._stacks.length-1].width,this._stacks[this._stacks.length-1].height,this._stacks[this._stacks.length-1].data)}render(){this._renderImageData=this.getTmpStack(),m(this._renderActions),m(this._passiveRenderActions,!0),t.cancelAnimationFrame(this._renderWait),this._renderWait=t.setTimeout((()=>{_.bind(this)(!0),this._renderWait=null}),1e3/30),t.clearTimeout(this._renderWaitDisplays),this._renderWaitDisplays=t.setTimeout((()=>{_.bind(this)()}),300)}get size(){return Object(h.e)(this._renderImageData.width,this._renderImageData.height)}get width(){return this._renderImageData.width}get height(){return this._renderImageData.height}get stacks(){return this._stacks}get renderImageData(){return this._renderImageData}clearStack(){this._renderImageData=c.createImageData(this._bitmapData.width,this._bitmapData.height),this._stacks=[this._renderImageData],this.render()}saveStack(){this._renderImageData=this.getTmpStack(),m(this._renderActions,!0),this._stacks.push(this._renderImageData),this.render()}revertStack(){this._stacks.length>1&&(this._renderImageData=this._stacks.pop(),this.render())}toBlob(){return new Promise((t=>{l(this._renderImageData).toBlob(t)}))}toBase64(){return new Promise((t=>{t(l(this._renderImageData).toDataURL())}))}}function o(t,e,r,h){h[Number(r)]=e[Number(t)],h[r+1]=e[t+1],h[r+2]=e[t+2],h[r+3]=e[t+3]}function l(t){var canvas=document.createElement("canvas");return canvas.width=t.width,canvas.height=t.height,canvas.getContext("2d").putImageData(t,0,0),canvas}function _(t){t?this._app.display&&(this._app.display.imageData=this._renderImageData):this._app.displays.forEach((t=>{t.imageData=this._renderImageData}))}function m(t,e){if(e)for(;t.length>0;)t.shift()();else t.forEach((t=>{t()}))}e.default=c}.call(this,r(8))},115:function(t,e,r){"use strict";r.r(e);var h=r(73);function n(t,e){if(!Object.prototype.hasOwnProperty.call(t,e))throw new TypeError("attempted to use private field on non-instance");return t}var d=0;function c(t){return"__private_"+d+++"_"+t}var o=c("size");e.default=class{constructor(t,e){Object.defineProperty(this,o,{writable:!0,value:Object(h.e)(0,0)}),n(this,o)[o]=Object(h.e)(t,e)}get width(){return n(this,o)[o].x}get height(){return n(this,o)[o].y}get size(){return n(this,o)[o]}}},78:function(t,e,r){"use strict";r.r(e);var h=r(79);function n(t,e){if(!Object.prototype.hasOwnProperty.call(t,e))throw new TypeError("attempted to use private field on non-instance");return t}var d=0;function c(t){return"__private_"+d+++"_"+t}var o=c("red"),l=c("green"),_=c("blue");class m{constructor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,h=arguments.length>3&&void 0!==arguments[3]?arguments[3]:255;Object.defineProperty(this,o,{writable:!0,value:0}),Object.defineProperty(this,l,{writable:!0,value:0}),Object.defineProperty(this,_,{writable:!0,value:0}),this.set(t,e,r,h)}set(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,h=arguments.length>3&&void 0!==arguments[3]?arguments[3]:255;Array.isArray(t)&&(h=t[3],r=t[2],e=t[1],t=t[0]),this.red=t,this.green=e,this.blue=r,this.alpha=void 0===h?255:h}get r(){return n(this,o)[o]}get red(){return n(this,o)[o]}set red(t){n(this,o)[o]=Object(h.b)(t,0,255)}get g(){return this._green}get green(){return this._green}set green(t){this._green=Object(h.b)(t,0,255)}get blue(){return this._blue}get b(){return this._blue}set blue(t){this._blue=Object(h.b)(t,0,255)}get a(){return this._alpha}get alpha(){return this._alpha}set alpha(t){this._alpha=Object(h.b)(t,0,255)}get sum(){return n(this,o)[o]+this._blue+this._green+this._alpha}toRGB(){return"rgb(".concat(n(this,o)[o],",").concat(this._green,",").concat(this._blue,")")}toRGBA(){return"rgba(".concat(n(this,o)[o],",").concat(this._green,",").concat(this._blue,",").concat(this._alpha/255,")")}toJSON(){return{red:this.red,green:this.green,blue:this.blue,alpha:this.alpha}}is(t){return this.red===t.red&&this.blue===t.blue&&this.green===t.green&&this.alpha===t.alpha}invert(){return n(this,o)[o]=255-n(this,o)[o],this._green=255-this._green,this._blue=255-this._blue,this}add(t){this.red=Object(h.b)(this.red+t.red,0,255),this.green=Object(h.b)(this.green+t.green,0,255),this.blue=Object(h.b)(this.blue+t.blue,0,255)}subtract(t){this.red=Object(h.b)(this.red-t.red,0,255),this.green=Object(h.b)(this.green-t.green,0,255),this.blue=Object(h.b)(this.blue-t.blue,0,255)}multiply(t){this.red=Object(h.b)(this.red*t.red,0,255),this.green=Object(h.b)(this.green*t.green,0,255),this.blue=Object(h.b)(this.blue*t.blue,0,255)}divide(t){this.red=Object(h.b)(this.red/t.red,0,255),this.green=Object(h.b)(this.green/t.green,0,255),this.blue=Object(h.b)(this.blue/t.blue,0,255)}}m.COLOR_BLACK=[0,0,0,255],m.COLOR_WHITE=[255,255,255,255],m.COLOR_TRANSPARENT=[0,0,0,0],e.default=m},79:function(t,e,r){"use strict";r.d(e,"b",(function(){return n})),r.d(e,"d",(function(){return d})),r.d(e,"c",(function(){return c})),r.d(e,"a",(function(){return o}));var h=r(73);function n(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return Math.min(Math.max(t,e),r)}function d(t){return Math.atan2(t.y,t.x)+Math.PI}function c(t){var e=window.getComputedStyle(t).transform,r=new DOMMatrix(e);return Math.atan2(r.b,r.a)}function o(t,e){var r=Math.cos(e)*t.x-Math.sin(e)*t.y,n=Math.sin(e)*t.x+Math.cos(e)*t.y;return new h.c(r,n)}}}]);