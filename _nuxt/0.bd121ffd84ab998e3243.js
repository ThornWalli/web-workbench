(window.webpackJsonp=window.webpackJsonp||[]).push([[0,19,22,32,33,34,41,42,45,46],{113:function(t,e,r){"use strict";r.r(e),function(t){var n=r(74),h=r(79),o=r(114);class d{static invertImageData(t){for(var i=0,e=0;e<t.width;e++)for(var r=0;r<t.height;r++)i=4*(e+r*t.width),t.data[Number(i)]=255-t.data[Number(i)],t.data[i+1]=255-t.data[i+1],t.data[i+2]=255-t.data[i+2]}static createImageData(e,r,data){return new t.ImageData(new t.Uint8ClampedArray(data||4*e*r),e,r)}static resizeImageData(t){for(var e,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,h=t.data,o=t.width,h1=t.height,l=o*r,h2=h1*r,f=Array(l*h2*4),m=Object(n.e)(parseInt((o<<16)/l)+1,parseInt((h1<<16)/h2)+1),i=0;i<h2;i++)for(var v=0;v<l;v++)e=v*m.x>>16,c(4*((i*m.y>>16)*o+e),h,4*(i*l+v),f);return d.createImageData(l,h2,f)}static cropImageData(t,e,r,n,h){for(var o=t.data,l=Array(n*h*4),i=0;i<n;i++)for(var f=0;f<h;f++){c(4*(r*t.width+e)+4*(f*t.width+i),o,4*(f*n+i),l)}return d.createImageData(n,h,l)}getActiveContext(){return this._app.display.context}getDisplayContexts(){return this._app.displays.map(t=>t.context)}constructor(t){this._app=t;var e=t.options.size;this._bitmapData=new o.default(e.width,e.height),this._renderActions=[],this._passiveRenderActions=[],this.clearStack()}setSize(t,e){this._bitmapData=new o.default(t,e),this.clearStack(),this.render(),this._app.refresh()}loadImage(image){var t=this.getImageDataFromImage(image);this._bitmapData=new o.default(t.width,t.height),this.clearStack(),this._stacks.push(t),this.render(),this._app.refresh()}getImageDataFromImage(image){var canvas=document.createElement("canvas");canvas.width=image.width,canvas.height=image.height;var t=canvas.getContext("2d");t.drawImage(image,0,0);for(var e=d.createImageData(image.width,image.height),data=t.getImageData(0,0,canvas.width,canvas.height),i=0;i<data.length;i++)e.data[Number(i)]=data[Number(i)];return data}getColorFromPixel(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2]?this._renderImageData:this._stacks[this._stacks.length-1||0],data=r.data,n=e*(4*r.width)+4*t;return new h.default(data[Number(n)],data[n+1],data[n+2],data[n+3])}getPixel(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2]?this._renderImageData:this._stacks[this._stacks.length-1||0],data=r.data,n=e*(4*r.width)+4*t;return data[Number(n)]+data[n+1]+data[n+2]+data[n+3]}setPixel(t,e,r){r=r||this._app.primaryColor;var i=4*(t+e*this._renderImageData.width);this._renderImageData.data[i+0]=r.red,this._renderImageData.data[i+1]=r.green,this._renderImageData.data[i+2]=r.blue,this._renderImageData.data[i+3]=r.alpha>=0?r.alpha:255}putImageData(t,e,r){for(var n,h,o=0;o<t.width;o++)for(var d=0;d<t.height;d++)n=4*(d*t.width+o),h=4*((r+d)*this._renderImageData.width+(e+o)),c(n,t.data,h,this._renderImageData.data)}fillPixels(t,e,r,n,h){for(var o=e;o<Math.min(e+n,this._renderImageData.width);o++)for(var d=r;d<Math.min(r+h,this._renderImageData.height);d++)this.setPixel(o,d,t)}addRenderAction(t){this._renderActions.push(t)}addPassiveRenderAction(t){this._passiveRenderActions.push(t)}cleanPassiveRenderActions(){this._passiveRenderActions=[]}getTmpStack(){return d.createImageData(this._stacks[this._stacks.length-1].width,this._stacks[this._stacks.length-1].height,this._stacks[this._stacks.length-1].data)}render(){this._renderImageData=this.getTmpStack(),m(this._renderActions),m(this._passiveRenderActions,!0),t.cancelAnimationFrame(this._renderWait),this._renderWait=t.setTimeout(()=>{f.bind(this)(!0),this._renderWait=null},1e3/30),t.clearTimeout(this._renderWaitDisplays),this._renderWaitDisplays=t.setTimeout(()=>{f.bind(this)()},300)}get size(){return Object(n.e)(this._renderImageData.width,this._renderImageData.height)}get width(){return this._renderImageData.width}get height(){return this._renderImageData.height}get stacks(){return this._stacks}get renderImageData(){return this._renderImageData}clearStack(){this._renderImageData=d.createImageData(this._bitmapData.width,this._bitmapData.height),this._stacks=[this._renderImageData],this.render()}saveStack(){this._renderImageData=this.getTmpStack(),m(this._renderActions,!0),this._stacks.push(this._renderImageData),this.render()}revertStack(){this._stacks.length>1&&(this._renderImageData=this._stacks.pop(),this.render())}toBlob(){return new Promise(t=>{l(this._renderImageData).toBlob(t)})}toBase64(){return new Promise(t=>{t(l(this._renderImageData).toDataURL())})}}function c(t,e,r,n){n[Number(r)]=e[Number(t)],n[r+1]=e[t+1],n[r+2]=e[t+2],n[r+3]=e[t+3]}function l(t){var canvas=document.createElement("canvas");return canvas.width=t.width,canvas.height=t.height,canvas.getContext("2d").putImageData(t,0,0),canvas}function f(t){t?this._app.display&&(this._app.display.imageData=this._renderImageData):this._app.displays.forEach(t=>{t.imageData=this._renderImageData})}function m(t,e){if(e)for(;t.length>0;)t.shift()();else t.forEach(t=>{t()})}e.default=d}.call(this,r(7))},114:function(t,e,r){"use strict";r.r(e);var n=r(74);function h(t,e){if(!Object.prototype.hasOwnProperty.call(t,e))throw new TypeError("attempted to use private field on non-instance");return t}var o=0;var d="__private_"+o+++"_"+"size";e.default=class{constructor(t,e){Object.defineProperty(this,d,{writable:!0,value:Object(n.e)(0,0)}),h(this,d)[d]=Object(n.e)(t,e)}get width(){return h(this,d)[d].x}get height(){return h(this,d)[d].y}get size(){return h(this,d)[d]}}},140:function(t,e,r){"use strict";r.r(e),r.d(e,"default",(function(){return v}));var n=r(74),h=r(113),o=r(75),d=r(79),c=r(84),l=r(98),f=r(82),m=r(76);class v extends f.default{constructor(t){super(t),this.brushPrimaryColor=new d.default(d.default.COLOR_BLACK),this.brushSecondaryColor=new d.default(d.default.COLOR_WHITE),this.brush=new(Object(c.getBrushByIndex)(0))({app:this.app,size:1,primaryColor:this.brushPrimaryColor,secondaryColor:this.brushSecondaryColor}),this.reset()}intersect(t){return!!this.bounds&&(t.x>this.bounds.min.x&&t.x<this.bounds.max.x&&t.y>this.bounds.min.y&&t.y<this.bounds.max.y)}reset(){console.log("RESET"),this.status=0,this.bounds=null,this.intersectedStartEvent=null,this.croppedImageData=null,this.startEvent=null}onPointerDown(t){var e;switch(console.log("Status: ",this.status),this.status){case 3:break;case 2:if(this.croppedImageData&&(this.intersectedStartEvent||this.intersect(t))){if(this.intersectedStartEvent=t,!t.rightClick)return{events:!0,render:!1};console.log("Ablegen"),this.status++}break;case 1:if(e=Object(n.e)(this.bounds.max-this.bounds.min),this.status++,t.rightClick){var r=this.bounds.min.x,h=this.bounds.min.y;this.app.canvas.addRenderAction(()=>{this.app.canvas.fillPixels(this._brush.secondaryColor,r,h,e.x,e.y)})}return this.app.canvas.addPassiveRenderAction(()=>{this.render(this.startEvent.x,this.startEvent.y,!0)}),{events:!0,render:!0};default:return f.default.prototype.onPointerDown.apply(this,arguments)}}onPointerMove(t,e){if(this.intersectedStartEvent&&e.pressed){var r=this.getRectInfo(t);return this._app.canvas.addPassiveRenderAction(()=>{this.render(r.x,r.y,!0)}),{render:!0}}if(0===this.status)return this._app.canvas.addPassiveRenderAction(()=>{this.render(t.x,t.y,!0)}),{render:!0}}getRectInfo(t){return{width:this.bounds.max.x-this.bounds.min.x,height:this.bounds.max.y-this.bounds.min.y,x:this.startEvent.x+t.x-this.intersectedStartEvent.x,y:this.startEvent.y+t.y-this.intersectedStartEvent.y}}onPointerUp(t){if(3===this.status)return this.app.canvas.addRenderAction(()=>{var e=this.getRectInfo(t);h.default.invertImageData(this.croppedImageData),this.render(e.x,e.y,!1),this.reset()}),{save:!0,render:!0};if(this.intersectedStartEvent&&2===this.status){var e=this.getRectInfo(t);return this.startEvent.x=e.x,this.startEvent.y=e.y,this.bounds=new l.default(Object(n.e)(e.x,e.y),Object(n.e)(e.x+e.width,e.y+e.height)),this._app.canvas.addPassiveRenderAction(()=>{this.render(e.x,e.y,!0)}),{render:!0}}if(this.startEvent&&0===this.status){console.log(t);var r=t.x-this.startEvent.x,o=t.y-this.startEvent.y;return r>0&&o>0&&(this.bounds=new l.default(Object(n.e)(this.startEvent.x,this.startEvent.y),Object(n.e)(t.x,t.y)),this.status++,this._app.canvas.addPassiveRenderAction(()=>{this.croppedImageData=h.default.cropImageData(this.app.canvas.renderImageData,this.bounds.min.x,this.bounds.min.y,r,o),h.default.invertImageData(this.croppedImageData),this.render(this.startEvent.x,this.startEvent.y,!0)})),{render:!0}}}render(t,e,rect){var r=Object(n.e)(0,0),h=Object(n.e)(t,e);this.bounds?r=Object(n.e)(()=>this.bounds.max-this.bounds.min):(r=Object(n.e)(()=>h-this.startEvent.position),h=this.startEvent.position),this.croppedImageData&&this.app.canvas.putImageData(this.croppedImageData,h.x,h.y),rect&&Object(o.rectangle)((t,e)=>{var data=[].concat(this._brush.data),r=this._app.canvas.getColorFromPixel(t,e);0===r.alpha?r=this.brushPrimaryColor:r.invert(),m.default.drawBrush({color:r,data:data,x:t,y:e,app:this._app})},h.x,h.y,r.x,r.y,{strokeSize:this._brush.data.length,filled:this.filled,density:3})}}},75:function(t,e,r){"use strict";function n(t,e,r,n){for(var h=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,o=Math.abs(r-t),d=t<r?1:-1,c=Math.abs(n-e),l=e<n?1:-1,f=(o>c?o:-c)/2,m=[],i=0;0===h||i>=1?(m.push([t,e]),i=0):i+=1/h,t!==r||e!==n;){var v=f;v>-o&&(f-=c,t+=d),v<c&&(f+=o,e+=l)}return m}function line(t,e,r,h,o,d){var{density:c=0}=d;n(e,r,h,o,c).forEach(e=>{t(e[0],e[1])})}function h(t,e,r,n,h,o,d,c,l){var f=arguments.length>9&&void 0!==arguments[9]?arguments[9]:.001,m=0,v=0,u=0;for(u=0;u<=1;u+=f)m=(1-u)**3*e+3*u*(1-u)**2*n+3*u**2*(1-u)*o+u**3*c,v=(1-u)**3*r+3*u*(1-u)**2*h+3*u**2*(1-u)*d+u**3*l,t(parseInt(m),parseInt(v))}function o(t,e,r,n,h,o){var{strokeSize:d=0,filled:c=!1,density:l}=o;if(c)for(var f=(e,r)=>t(e,r,!0),i=r;h<0?i>=r+h:i<=r+h;h<0?i--:i++)line(f,e,i,e+n,i,{density:l});if(d>0){d=Math.floor(d/2);var m=[e-(d=[n<0?-d:d,h<0?-d:d])[0],r-d[1]];[[e-d[0],r-d[1]],[e-d[0],r+h+d[1]],[e+n+d[0],r+h+d[1]],[e+n+d[0],r-d[1]],m].forEach(e=>{line(t,m[0],m[1],e[0],e[1],{density:l}),m=e})}}function ellipse(t,e,r,n,h,o){var{filled:d=!1,density:c=0}=o;n<0&&(n=Math.abs(n)),h<0&&(h=Math.abs(h));var l,f,m,v=n*n,_=h*h,y=4*v,x=4*_,i=0,w=(e,r)=>t(e,r,!0),I=[];for(l=0,f=h,m=2*_+v*(1-2*h);_*l<=v*f;l++)!c||i>=1?(I.push([e+l,r+f]),I.push([e-l,r-f]),I.push([e-l,r+f]),I.push([e+l,r-f]),i=0):i+=1/c,m>=0&&(m+=y*(1-f),f--),m+=_*(4*l+6);for(i=0,l=n,f=0,m=2*v+_*(1-2*n);v*f<=_*l;f++)!c||i>=1?(I.push([e+l,r+f]),I.push([e-l,r+f]),I.push([e+l,r-f]),I.push([e-l,r-f]),i=0):i+=1/c,m>=0&&(m+=x*(1-l),l--),m+=v*(4*f+6);if(d)for(var D=-h;D<=h;D++)for(var O=-n;O<=n;O++)O*O*h*h+D*D*n*n<=h*h*n*n&&w(e+O,r+D);I.forEach(e=>{t(e[0],e[1])})}function polygon(t,e,r,n){var h,{strokeSize:o=0,filled:c=!1,density:l=0}=n,f=Number.MAX_VALUE,m=Number.MAX_VALUE,v=Number.MIN_VALUE,_=Number.MIN_VALUE;if(e.forEach(e=>{h&&(e.x>v&&(v=e.x),e.y>_&&(_=e.y),e.x<f&&(f=e.x),e.y<m&&(m=e.y),line(t,h.x,h.y,e.x,e.y,{density:l})),h=e}),r){var y=e[0];h&&(y.x>v&&(v=y.x),y.y>_&&(_=y.y),y.x<f&&(f=y.x),y.y<m&&(m=y.y),line(t,h.x,h.y,y.x,y.y,{density:l}))}if(c){d((e,r)=>t(e,r,!0),e,{IMAGE_LEFT:f,IMAGE_TOP:m,IMAGE_RIGHT:v,IMAGE_BOTTOM:_})}}function d(t,e,r){var n,{IMAGE_LEFT:h=0,IMAGE_TOP:o=0,IMAGE_RIGHT:d,IMAGE_BOTTOM:c}=r,l=[],f=[];e.forEach(polygon=>{l.push(polygon.y),f.push(polygon.x)});var m,v,i,_,y,x=Array(e.length);for(v=o;v<c;v++){for(n=0,_=e.length-1,i=0;i<e.length;i++)(l[Number(i)]<v&&l[Number(_)]>=v||l[Number(_)]<v&&l[Number(i)]>=v)&&(x[n++]=Math.round(f[Number(i)]+(v-l[Number(i)])/(l[Number(_)]-l[Number(i)])*(f[Number(_)]-f[Number(i)]))),_=i;for(i=0;i<n-1;)x[Number(i)]>x[i+1]?(y=x[Number(i)],x[Number(i)]=x[i+1],x[i+1]=y,i&&i--):i++;for(i=0;i<n&&!(x[Number(i)]>=d);i+=2)if(x[i+1]>h)for(x[Number(i)]<h&&(x[Number(i)]=h),x[i+1]>d&&(x[i+1]=d),m=x[Number(i)];m<x[i+1];m++)t(m,v)}}r.r(e),r.d(e,"getLinePoints",(function(){return n})),r.d(e,"line",(function(){return line})),r.d(e,"curve",(function(){return h})),r.d(e,"rectangle",(function(){return o})),r.d(e,"ellipse",(function(){return ellipse})),r.d(e,"polygon",(function(){return polygon})),r.d(e,"fillPolygon",(function(){return d}))},76:function(t,e,r){"use strict";r.r(e),r.d(e,"default",(function(){return h}));var n=r(77);class h extends n.default{constructor(t){super(t),this._brush=t.brush}get brush(){return this._brush}set brush(t){this._brush=t}static drawBrush(t){var{x:e,y:r,data:data,app:n,color:h}=t;e=Math.floor(e-data[0].length/2+1),r=Math.floor(r-data.length/2);for(var o=[],i=0;i<data[0].length;i++)for(var d=0;d<data.length;d++)data[Number(d)][Number(i)]>0&&h.alpha?(n.canvas.setPixel(e+i,r+d,h),o.push([e+i,r+d])):data[Number(d)][Number(i)]<0&&n.canvas.setPixel(e+i,r+d);return o}}},77:function(t,e,r){"use strict";function n(t,e){if(!Object.prototype.hasOwnProperty.call(t,e))throw new TypeError("attempted to use private field on non-instance");return t}r.r(e),r.d(e,"default",(function(){return d}));var h=0;var o="__private_"+h+++"_"+"pointerDownHold";class d{constructor(t){Object.defineProperty(this,o,{writable:!0,value:!1}),this._app=t.app,this.passive=t.passive||!1,n(this,o)[o]=t.pointerDownHold||!1}get pointerDownHold(){return n(this,o)[o]}deconstructor(){}onActive(){}onPointerDown(){}onPointerUp(){}onPointerMove(){}onContextMenu(){}get app(){return this._app}get setPixel(){return this._app.activeDisplay.setPixel}}},79:function(t,e,r){"use strict";r.r(e);var n=r(80);function h(t,e){if(!Object.prototype.hasOwnProperty.call(t,e))throw new TypeError("attempted to use private field on non-instance");return t}var o=0;function d(t){return"__private_"+o+++"_"+t}var c=d("red"),l=d("green"),f=d("blue");class m{constructor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:255;Object.defineProperty(this,c,{writable:!0,value:0}),Object.defineProperty(this,l,{writable:!0,value:0}),Object.defineProperty(this,f,{writable:!0,value:0}),this.set(t,e,r,n)}set(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:255;Array.isArray(t)&&(n=t[3],r=t[2],e=t[1],t=t[0]),this.red=t,this.green=e,this.blue=r,this.alpha=void 0===n?255:n}get r(){return h(this,c)[c]}get red(){return h(this,c)[c]}set red(t){h(this,c)[c]=Object(n.b)(t,0,255)}get g(){return this._green}get green(){return this._green}set green(t){this._green=Object(n.b)(t,0,255)}get blue(){return this._blue}get b(){return this._blue}set blue(t){this._blue=Object(n.b)(t,0,255)}get a(){return this._alpha}get alpha(){return this._alpha}set alpha(t){this._alpha=Object(n.b)(t,0,255)}get sum(){return h(this,c)[c]+this._blue+this._green+this._alpha}toRGB(){return"rgb(".concat(h(this,c)[c],",").concat(this._green,",").concat(this._blue,")")}toRGBA(){return"rgba(".concat(h(this,c)[c],",").concat(this._green,",").concat(this._blue,",").concat(this._alpha/255,")")}toJSON(){return{red:this.red,green:this.green,blue:this.blue,alpha:this.alpha}}is(t){return this.red===t.red&&this.blue===t.blue&&this.green===t.green&&this.alpha===t.alpha}invert(){return h(this,c)[c]=255-h(this,c)[c],this._green=255-this._green,this._blue=255-this._blue,this}add(t){this.red=Object(n.b)(this.red+t.red,0,255),this.green=Object(n.b)(this.green+t.green,0,255),this.blue=Object(n.b)(this.blue+t.blue,0,255)}subtract(t){this.red=Object(n.b)(this.red-t.red,0,255),this.green=Object(n.b)(this.green-t.green,0,255),this.blue=Object(n.b)(this.blue-t.blue,0,255)}multiply(t){this.red=Object(n.b)(this.red*t.red,0,255),this.green=Object(n.b)(this.green*t.green,0,255),this.blue=Object(n.b)(this.blue*t.blue,0,255)}divide(t){this.red=Object(n.b)(this.red/t.red,0,255),this.green=Object(n.b)(this.green/t.green,0,255),this.blue=Object(n.b)(this.blue/t.blue,0,255)}}m.COLOR_BLACK=[0,0,0,255],m.COLOR_WHITE=[255,255,255,255],m.COLOR_TRANSPARENT=[0,0,0,0],e.default=m},80:function(t,e,r){"use strict";r.d(e,"b",(function(){return h})),r.d(e,"d",(function(){return o})),r.d(e,"c",(function(){return d})),r.d(e,"a",(function(){return c}));var n=r(74);function h(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return Math.min(Math.max(t,e),r)}function o(t){return Math.atan2(t.y,t.x)+Math.PI}function d(t){var e=window.getComputedStyle(t).transform,r=new DOMMatrix(e);return Math.atan2(r.b,r.a)}function c(t,e){var r=Math.cos(e)*t.x-Math.sin(e)*t.y,h=Math.sin(e)*t.x+Math.cos(e)*t.y;return new n.c(r,h)}},82:function(t,e,r){"use strict";r.r(e),r.d(e,"default",(function(){return c})),r.d(e,"Anchor",(function(){return l}));var n=r(75),h=r(79),o=r(84),d=r(76);class c extends d.default{constructor(t){super(t),this.COLOR_TRANSPARENT=new h.default(h.default.COLOR_TRANSPARENT),this.filled=!1,this.selectedAnchor=null,this.anchors=[],this.anchorBrush=new(Object(o.getBrushByIndex)(0))({app:this._app,size:1,primaryColor:new h.default(h.default.COLOR_BLACK),secondaryColor:new h.default(h.default.COLOR_WHITE)})}onPointerDown(t){this.startEvent=t}drawAnchors(){var data=[].concat(this.anchorBrush.data);this.anchors.forEach(t=>{this.drawAnchor(t,data)})}drawAnchor(t,data){t.intersectMap={},Object(n.rectangle)((e,r,n)=>{var h=this._app.canvas.getColorFromPixel(e,r);0===h.alpha?h=n?this.anchorBrush.secondaryColor:this.anchorBrush.primaryColor:h.invert(),t.intersectMap[Number(e)]=t.intersectMap[Number(e)]||{},t.intersectMap[Number(e)][Number(r)]=!0,d.default.drawBrush({color:h,data:data,x:e,y:r,app:this._app})},t.x-5,t.y-5,10,10,{strokeSize:1,filled:!0})}getAnchorByPosition(t,e){return this.anchors.find(r=>!!r.intersectAnchor(t,e)&&r)}addAnchor(t,e){var r=new l(t,e,this.anchorBrush);return this.anchors.push(r),r}reset(){this.anchors=[],this.selectedAnchor=null}}class l{constructor(t,e,r){this.x=t,this.y=e,this.brush=r}intersectAnchor(t,e){return this.intersectMap&&this.intersectMap[Number(t)]&&this.intersectMap[Number(t)][Number(e)]}}},84:function(t,e,r){"use strict";r.r(e),r.d(e,"getBrushByIndex",(function(){return f}));var n=r(75);class h{constructor(t){var{app:e,size:r=1,lowres:n=!0,primaryColor:h,secondaryColor:o}=t;this._app=e,this._size=r,this._lowres=n,this._data=this.getScaledData(this._size),this._primaryColor=h,this._secondaryColor=o}get lowres(){return this._lowres}get data(){return this._data}get size(){return this._size}set size(t){void 0===t&&(t=1),this._size=t,this._data=this.getScaledData(this._size)}get primaryColor(){return this._primaryColor||this._app.primaryColor}get secondaryColor(){return this._secondaryColor||this._app.secondaryColor}getData(t){return h.scale([],t)}getScaledData(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return h.scale(this.getData(t),this._app.density)}static scale(data,t){for(var e=[],r=0;r<data.length*t;r++){e.push([]);for(var n=0;n<data[0].length*t;n++)e[Number(r)].push(data[Math.floor(r/t)][Math.floor(n/t)])}return e}static scaleAsCopy(data,t){for(var e=[],r=0;r<data.length*t;r++){e.push([]);for(var n=0;n<data[0].length*t;n++)e[Number(r)].push(data[r%data.length][n%data[0].length])}return e}}class o extends h{getData(t){return t>1?d(t):t?[[1]]:[]}}function d(t){t=2*(t-1);for(var data=Array(t+1),i=0;i<t+1;i++)data[Number(i)]=Array(t+1).fill(0);return n.ellipse((t,e)=>{data[Math.round(t)][Math.round(e)]=1},t/2,t/2,t/2,t/2,{filled:!0}),data}class c extends h{getData(t){return function(t){for(var data=Array(t+1),i=0;i<t+1;i++)data[Number(i)]=Array(t+1).fill(0);return n.rectangle((t,e)=>{data[Math.round(t)][Math.round(e)]=1},0,0,t,t,{filled:!0}),data}(t)}}class l extends h{getData(t){return function(t){for(var data=d(t+2),i=0;i<data.length;i++)for(var e=0;e<data[Number(i)].length;e++)data[Number(i)][Number(e)]>0&&Math.random()<.15/t?data[Number(i)][Number(e)]=1:data[Number(i)][Number(e)]=0;return data}(t)}get data(){return this._data=this.getScaledData(this._size),this._data}}function f(t){return[o,c,l][Number(t)]}e.default=h},98:function(t,e,r){"use strict";r.r(e),r.d(e,"default",(function(){return h}));var n=r(74);class h{constructor(t,e){this.min=Object(n.e)(0,0),this.max=Object(n.e)(0,0),this.min=t||this.min,this.max=e||this.max}}}}]);