(window.webpackJsonp=window.webpackJsonp||[]).push([[0,27,28,29,41,44],{248:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return d}));n(244);var r=n(105),o=n(106),c=n(240),h=n(238),f=n(239);function l(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(f.a)(t);if(e){var o=Object(f.a)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Object(h.a)(this,n)}}var d=function(t){Object(c.a)(n,t);var e=l(n);function n(t){var o;return Object(r.a)(this,n),(o=e.call(this,t))._brush=t.brush,o}return Object(o.a)(n,[{key:"brush",get:function(){return this._brush},set:function(t){this._brush=t}}],[{key:"drawBrush",value:function(t){var e=t.x,n=t.y,data=t.data,r=t.app,o=t.color;e=Math.floor(e-data[0].length/2+1),n=Math.floor(n-data.length/2);for(var c=[],i=0;i<data[0].length;i++)for(var h=0;h<data.length;h++)data[Number(h)][Number(i)]>0&&o.alpha?(r.canvas.setPixel(e+i,n+h,o),c.push([e+i,n+h])):data[Number(h)][Number(i)]<0&&r.canvas.setPixel(e+i,n+h);return c}}]),n}(n(251).default)},249:function(t,e,n){"use strict";n.r(e),n.d(e,"getLinePoints",(function(){return r})),n.d(e,"line",(function(){return line})),n.d(e,"curve",(function(){return o})),n.d(e,"rectangle",(function(){return c})),n.d(e,"ellipse",(function(){return ellipse})),n.d(e,"polygon",(function(){return polygon})),n.d(e,"fillPolygon",(function(){return h}));n(38),n(244),n(39);function r(t,e,n,r){for(var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,c=Math.abs(n-t),h=t<n?1:-1,f=Math.abs(r-e),l=e<r?1:-1,d=(c>f?c:-f)/2,v=[],i=0;0===o||i>=1?(v.push([t,e]),i=0):i+=1/o,t!==n||e!==r;){var y=d;y>-c&&(d-=f,t+=h),y<f&&(d+=c,e+=l)}return v}function line(t,e,n,o,c,h){var f=h.density;r(e,n,o,c,void 0===f?0:f).forEach((function(e){t(e[0],e[1])}))}function o(t,e,n,r,o,c,h,f,l){var d=arguments.length>9&&void 0!==arguments[9]?arguments[9]:.001,v=0,y=0,u=0;for(u=0;u<=1;u+=d)v=Math.pow(1-u,3)*e+3*u*Math.pow(1-u,2)*r+3*Math.pow(u,2)*(1-u)*c+Math.pow(u,3)*f,y=Math.pow(1-u,3)*n+3*u*Math.pow(1-u,2)*o+3*Math.pow(u,2)*(1-u)*h+Math.pow(u,3)*l,t(parseInt(v),parseInt(y))}function c(t,e,n,r,o,c){var h=c.strokeSize,f=void 0===h?0:h,l=c.filled,d=void 0!==l&&l,v=c.density;if(d)for(var y=function(e,n){return t(e,n,!0)},i=n;o<0?i>=n+o:i<=n+o;o<0?i--:i++)line(y,e,i,e+r,i,{density:v});if(f>0){f=Math.floor(f/2);var O=[e-(f=[r<0?-f:f,o<0?-f:f])[0],n-f[1]];[[e-f[0],n-f[1]],[e-f[0],n+o+f[1]],[e+r+f[0],n+o+f[1]],[e+r+f[0],n-f[1]],O].forEach((function(e){line(t,O[0],O[1],e[0],e[1],{density:v}),O=e}))}}function ellipse(t,e,n,r,o,c){var h=c.filled,f=void 0!==h&&h,l=c.density,d=void 0===l?0:l;r<0&&(r=Math.abs(r)),o<0&&(o=Math.abs(o));var v,y,O,_=r*r,j=o*o,m=4*_,M=4*j,i=0,k=function(e,n){return t(e,n,!0)},N=[];for(v=0,y=o,O=2*j+_*(1-2*o);j*v<=_*y;v++)!d||i>=1?(N.push([e+v,n+y]),N.push([e-v,n-y]),N.push([e-v,n+y]),N.push([e+v,n-y]),i=0):i+=1/d,O>=0&&(O+=m*(1-y),y--),O+=j*(4*v+6);for(i=0,v=r,y=0,O=2*_+j*(1-2*r);_*y<=j*v;y++)!d||i>=1?(N.push([e+v,n+y]),N.push([e-v,n+y]),N.push([e+v,n-y]),N.push([e-v,n-y]),i=0):i+=1/d,O>=0&&(O+=M*(1-v),v--),O+=_*(4*y+6);if(f)for(var A=-o;A<=o;A++)for(var w=-r;w<=r;w++)w*w*o*o+A*A*r*r<=o*o*r*r&&k(e+w,n+A);N.forEach((function(e){t(e[0],e[1])}))}function polygon(t,e,n,r){r.strokeSize;var o,c=r.filled,f=void 0!==c&&c,l=r.density,d=void 0===l?0:l,v=Number.MAX_VALUE,y=Number.MAX_VALUE,O=Number.MIN_VALUE,_=Number.MIN_VALUE;if(e.forEach((function(e){o&&(e.x>O&&(O=e.x),e.y>_&&(_=e.y),e.x<v&&(v=e.x),e.y<y&&(y=e.y),line(t,o.x,o.y,e.x,e.y,{density:d})),o=e})),n){var j=e[0];o&&(j.x>O&&(O=j.x),j.y>_&&(_=j.y),j.x<v&&(v=j.x),j.y<y&&(y=j.y),line(t,o.x,o.y,j.x,j.y,{density:d}))}if(f){h((function(e,n){return t(e,n,!0)}),e,{IMAGE_LEFT:v,IMAGE_TOP:y,IMAGE_RIGHT:O,IMAGE_BOTTOM:_})}}function h(t,e,n){var r,o=n.IMAGE_LEFT,c=void 0===o?0:o,h=n.IMAGE_TOP,f=void 0===h?0:h,l=n.IMAGE_RIGHT,d=n.IMAGE_BOTTOM,v=[],y=[];e.forEach((function(polygon){v.push(polygon.y),y.push(polygon.x)}));var O,_,i,j,m,M=Array(e.length);for(_=f;_<d;_++){for(r=0,j=e.length-1,i=0;i<e.length;i++)(v[Number(i)]<_&&v[Number(j)]>=_||v[Number(j)]<_&&v[Number(i)]>=_)&&(M[r++]=Math.round(y[Number(i)]+(_-v[Number(i)])/(v[Number(j)]-v[Number(i)])*(y[Number(j)]-y[Number(i)]))),j=i;for(i=0;i<r-1;)M[Number(i)]>M[i+1]?(m=M[Number(i)],M[Number(i)]=M[i+1],M[i+1]=m,i&&i--):i++;for(i=0;i<r&&!(M[Number(i)]>=l);i+=2)if(M[i+1]>c)for(M[Number(i)]<c&&(M[Number(i)]=c),M[i+1]>l&&(M[i+1]=l),O=M[Number(i)];O<M[i+1];O++)t(O,_)}}},251:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return l}));var r=n(105),o=n(106),c=n(242),h=n(243),f=Object(h.a)("pointerDownHold"),l=function(){function t(e){Object(r.a)(this,t),Object.defineProperty(this,f,{writable:!0,value:!1}),this._app=e.app,this.passive=e.passive||!1,Object(c.a)(this,f)[f]=e.pointerDownHold||!1}return Object(o.a)(t,[{key:"deconstructor",value:function(){}},{key:"onActive",value:function(){}},{key:"onPointerDown",value:function(){}},{key:"onPointerUp",value:function(){}},{key:"onPointerMove",value:function(){}},{key:"onContextMenu",value:function(){}},{key:"pointerDownHold",get:function(){return Object(c.a)(this,f)[f]}},{key:"app",get:function(){return this._app}},{key:"setPixel",get:function(){return this._app.activeDisplay.setPixel}}]),t}()},253:function(t,e,n){"use strict";n.r(e);n(64);var r=n(105),o=n(106),c=n(242),h=n(243),f=n(267),l=Object(h.a)("red"),d=Object(h.a)("green"),v=Object(h.a)("blue"),y=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:255;Object(r.a)(this,t),Object.defineProperty(this,l,{writable:!0,value:0}),Object.defineProperty(this,d,{writable:!0,value:0}),Object.defineProperty(this,v,{writable:!0,value:0}),this.set(e,n,o,c)}return Object(o.a)(t,[{key:"set",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:255;Array.isArray(t)&&(r=t[3],n=t[2],e=t[1],t=t[0]),this.red=t,this.green=e,this.blue=n,this.alpha=void 0===r?255:r}},{key:"toRGB",value:function(){return"rgb(".concat(Object(c.a)(this,l)[l],",").concat(this._green,",").concat(this._blue,")")}},{key:"toRGBA",value:function(){return"rgba(".concat(Object(c.a)(this,l)[l],",").concat(this._green,",").concat(this._blue,",").concat(this._alpha/255,")")}},{key:"toJSON",value:function(){return{red:this.red,green:this.green,blue:this.blue,alpha:this.alpha}}},{key:"is",value:function(t){return this.red===t.red&&this.blue===t.blue&&this.green===t.green&&this.alpha===t.alpha}},{key:"invert",value:function(){return Object(c.a)(this,l)[l]=255-Object(c.a)(this,l)[l],this._green=255-this._green,this._blue=255-this._blue,this}},{key:"add",value:function(t){this.red=Object(f.b)(this.red+t.red,0,255),this.green=Object(f.b)(this.green+t.green,0,255),this.blue=Object(f.b)(this.blue+t.blue,0,255)}},{key:"subtract",value:function(t){this.red=Object(f.b)(this.red-t.red,0,255),this.green=Object(f.b)(this.green-t.green,0,255),this.blue=Object(f.b)(this.blue-t.blue,0,255)}},{key:"multiply",value:function(t){this.red=Object(f.b)(this.red*t.red,0,255),this.green=Object(f.b)(this.green*t.green,0,255),this.blue=Object(f.b)(this.blue*t.blue,0,255)}},{key:"divide",value:function(t){this.red=Object(f.b)(this.red/t.red,0,255),this.green=Object(f.b)(this.green/t.green,0,255),this.blue=Object(f.b)(this.blue/t.blue,0,255)}},{key:"r",get:function(){return Object(c.a)(this,l)[l]}},{key:"red",get:function(){return Object(c.a)(this,l)[l]},set:function(t){Object(c.a)(this,l)[l]=Object(f.b)(t,0,255)}},{key:"g",get:function(){return this._green}},{key:"green",get:function(){return this._green},set:function(t){this._green=Object(f.b)(t,0,255)}},{key:"blue",get:function(){return this._blue},set:function(t){this._blue=Object(f.b)(t,0,255)}},{key:"b",get:function(){return this._blue}},{key:"a",get:function(){return this._alpha}},{key:"alpha",get:function(){return this._alpha},set:function(t){this._alpha=Object(f.b)(t,0,255)}},{key:"sum",get:function(){return Object(c.a)(this,l)[l]+this._blue+this._green+this._alpha}}]),t}();y.COLOR_BLACK=[0,0,0,255],y.COLOR_WHITE=[255,255,255,255],y.COLOR_TRANSPARENT=[0,0,0,0],e.default=y},266:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return _})),n.d(e,"Anchor",(function(){return j}));n(64),n(164),n(38),n(244),n(39);var r=n(105),o=n(106),c=n(240),h=n(238),f=n(239),l=n(249),d=n(253),v=n(286),y=n(248);function O(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(f.a)(t);if(e){var o=Object(f.a)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Object(h.a)(this,n)}}var _=function(t){Object(c.a)(n,t);var e=O(n);function n(t){var o;return Object(r.a)(this,n),(o=e.call(this,t)).COLOR_TRANSPARENT=new d.default(d.default.COLOR_TRANSPARENT),o.filled=!1,o.selectedAnchor=null,o.anchors=[],o.anchorBrush=new(Object(v.getBrushByIndex)(0))({app:o._app,size:1,primaryColor:new d.default(d.default.COLOR_BLACK),secondaryColor:new d.default(d.default.COLOR_WHITE)}),o}return Object(o.a)(n,[{key:"onPointerDown",value:function(t){this.startEvent=t}},{key:"drawAnchors",value:function(){var t=this,data=[].concat(this.anchorBrush.data);this.anchors.forEach((function(e){t.drawAnchor(e,data)}))}},{key:"drawAnchor",value:function(t,data){var e=this;t.intersectMap={},Object(l.rectangle)((function(n,r,o){var c=e._app.canvas.getColorFromPixel(n,r);0===c.alpha?c=o?e.anchorBrush.secondaryColor:e.anchorBrush.primaryColor:c.invert(),t.intersectMap[Number(n)]=t.intersectMap[Number(n)]||{},t.intersectMap[Number(n)][Number(r)]=!0,y.default.drawBrush({color:c,data:data,x:n,y:r,app:e._app})}),t.x-5,t.y-5,10,10,{strokeSize:1,filled:!0})}},{key:"getAnchorByPosition",value:function(t,e){return this.anchors.find((function(n){return!!n.intersectAnchor(t,e)&&n}))}},{key:"addAnchor",value:function(t,e){var n=new j(t,e,this.anchorBrush);return this.anchors.push(n),n}},{key:"reset",value:function(){this.anchors=[],this.selectedAnchor=null}}]),n}(y.default),j=function(){function t(e,n,o){Object(r.a)(this,t),this.x=e,this.y=n,this.brush=o}return Object(o.a)(t,[{key:"intersectAnchor",value:function(t,e){return this.intersectMap&&this.intersectMap[Number(t)]&&this.intersectMap[Number(t)][Number(e)]}}]),t}()},267:function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"d",(function(){return c})),n.d(e,"c",(function(){return h})),n.d(e,"a",(function(){return f}));var r=n(241);function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return Math.min(Math.max(t,e),n)}function c(t){return Math.atan2(t.y,t.x)+Math.PI}function h(t){var e=window.getComputedStyle(t).transform,n=new DOMMatrix(e);return Math.atan2(n.b,n.a)}function f(t,e){var n=Math.cos(e)*t.x-Math.sin(e)*t.y,o=Math.sin(e)*t.x+Math.cos(e)*t.y;return new r.c(n,o)}},286:function(t,e,n){"use strict";n.r(e),n.d(e,"getBrushByIndex",(function(){return m}));n(278),n(244);var r=n(240),o=n(238),c=n(239),h=n(105),f=n(106),l=n(249);function d(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(c.a)(t);if(e){var h=Object(c.a)(this).constructor;n=Reflect.construct(r,arguments,h)}else n=r.apply(this,arguments);return Object(o.a)(this,n)}}var v=function(){function t(e){var n=e.app,r=e.size,o=void 0===r?1:r,c=e.lowres,f=void 0===c||c,l=e.primaryColor,d=e.secondaryColor;Object(h.a)(this,t),this._app=n,this._size=o,this._lowres=f,this._data=this.getScaledData(this._size),this._primaryColor=l,this._secondaryColor=d}return Object(f.a)(t,[{key:"getData",value:function(e){return t.scale([],e)}},{key:"getScaledData",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return t.scale(this.getData(e),this._app.density)}},{key:"lowres",get:function(){return this._lowres}},{key:"data",get:function(){return this._data}},{key:"size",get:function(){return this._size},set:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this._size=t,this._data=this.getScaledData(this._size)}},{key:"primaryColor",get:function(){return this._primaryColor||this._app.primaryColor}},{key:"secondaryColor",get:function(){return this._secondaryColor||this._app.secondaryColor}}],[{key:"scale",value:function(data,t){for(var e=[],n=0;n<data.length*t;n++){e.push([]);for(var r=0;r<data[0].length*t;r++)e[Number(n)].push(data[Math.floor(n/t)][Math.floor(r/t)])}return e}},{key:"scaleAsCopy",value:function(data,t){for(var e=[],n=0;n<data.length*t;n++){e.push([]);for(var r=0;r<data[0].length*t;r++)e[Number(n)].push(data[n%data.length][r%data[0].length])}return e}}]),t}(),y=function(t){Object(r.a)(n,t);var e=d(n);function n(){return Object(h.a)(this,n),e.apply(this,arguments)}return Object(f.a)(n,[{key:"getData",value:function(t){return t>1?O(t):t?[[1]]:[]}}]),n}(v);function O(t){t=2*(t-1);for(var data=Array(t+1),i=0;i<t+1;i++)data[Number(i)]=Array(t+1).fill(0);return l.ellipse((function(t,e){data[Math.round(t)][Math.round(e)]=1}),t/2,t/2,t/2,t/2,{filled:!0}),data}var _=function(t){Object(r.a)(n,t);var e=d(n);function n(){return Object(h.a)(this,n),e.apply(this,arguments)}return Object(f.a)(n,[{key:"getData",value:function(t){return function(t){for(var data=Array(t+1),i=0;i<t+1;i++)data[Number(i)]=Array(t+1).fill(0);return l.rectangle((function(t,e){data[Math.round(t)][Math.round(e)]=1}),0,0,t,t,{filled:!0}),data}(t)}}]),n}(v),j=function(t){Object(r.a)(n,t);var e=d(n);function n(){return Object(h.a)(this,n),e.apply(this,arguments)}return Object(f.a)(n,[{key:"getData",value:function(t){return function(t){for(var data=O(t+2),i=0;i<data.length;i++)for(var e=0;e<data[Number(i)].length;e++)data[Number(i)][Number(e)]>0&&Math.random()<.15/t?data[Number(i)][Number(e)]=1:data[Number(i)][Number(e)]=0;return data}(t)}},{key:"data",get:function(){return this._data=this.getScaledData(this._size),this._data}}]),n}(v);function m(t){return[y,_,j][Number(t)]}e.default=v}}]);