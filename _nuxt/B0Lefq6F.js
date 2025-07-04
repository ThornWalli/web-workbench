var Y=Object.defineProperty;var G=(t,e,s)=>e in t?Y(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var y=(t,e,s)=>G(t,typeof e!="symbol"?e+"":e,s);import{i as R}from"./CpIyErmU.js";function n(t,e,s,i,l=0){t.fillStyle=i,t.fillRect(Number(e.getAttribute("x"))+s[0],Number(e.getAttribute("y"))+s[1]-l,Number(e.getAttribute("width")),Number(e.getAttribute("height"))+l)}function o(t,e,s,i){if(!(e instanceof SVGPolygonElement))throw new Error("polygon is not an instance of SVGPolygonElement");t.fillStyle=i,t.beginPath(),Array.from(e.points).forEach((l,a)=>{a<1?t.moveTo(l.x+s[0],l.y+s[1]):t.lineTo(l.x+s[0],l.y+s[1])}),t.closePath(),t.fill()}const V=[{test:/^2m/,name:"sharp",selectors:[{selector:"#sharp rect",draw:n,offset:[-8,0]}]},{test:/^2m/,name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:n,offset:[-8,0]}]},{test:/^2m/,name:"dot",selectors:[{selector:"#dot",draw:o,offset:[4,0]}]},{test:/^1m/,name:"sharp",selectors:[{selector:"#sharp rect",draw:n,offset:[-4,0]}]},{test:/^1m/,name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:n,offset:[-4,0]}]},{test:/^1m/,name:"dot",selectors:[{selector:"#dot",draw:o,offset:[1,0]}]},{test:/^2m/,name:"flat",selectors:[{selector:"#flat-1 rect",draw:n,offset:[-8,0]}]},{test:/^2m/,name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:n,offset:[-8,0]},{selector:"#flat-2 rect",draw:n,offset:[-8,0]}]},{test:/^1m/,name:"flat",selectors:[{selector:"#flat-1 rect",draw:n,offset:[-5,0]}]},{test:/^1m/,name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:n,offset:[-5,0]},{selector:"#flat-2 rect",draw:n,offset:[-5,0]}]},{name:"flat",selectors:[{selector:"#flat-1 rect",draw:n}]},{name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:n},{selector:"#flat-2 rect",draw:n}]},{name:"sharp",selectors:[{selector:"#sharp rect",draw:n}]},{name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:n}]},{name:"dot",selectors:[{selector:"#dot",draw:o}]}],q=[{time:[/^1m/],offset:[0,3],selectors:[{selector:"#whole-pause",draw:n}]},{time:[/^2m/],offset:[0,3],selectors:[{selector:"#double-pause",draw:n}]},{time:[/^2[nt]/],offset:[0,7],selectors:[{selector:"#half-pause",draw:n}]},{time:[/^4[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:n},{selector:"#divide-pause-line-1",draw:o}]},{time:[/^8[nt]/],selectors:[{selector:"#divide-pause-line-0",draw:n},{selector:"#divide-pause-line-1",draw:o},{selector:"#divide-pause-line-2",draw:o}]},{time:[/^16[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:n},{selector:"#divide-pause-line-1",draw:o},{selector:"#divide-pause-line-2",draw:o,color:"black"},{selector:"#divide-pause-line-3",draw:o,color:"black"}]},{time:[/^32[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:n},{selector:"#divide-pause-line-1",draw:o},{selector:"#divide-pause-line-2",draw:o},{selector:"#divide-pause-line-3",draw:o},{selector:"#divide-pause-line-4",draw:o}]}],f={PRIMARY:"primary",SECONDARY:"secondary"},j=[{time:[/^1m/],selectors:[{selector:"#whole-background",draw:o},{selector:"#whole-foreground",draw:o,color:f.SECONDARY}]},{time:[/^2m/],selectors:[{selector:"#whole-background",draw:o},{selector:"#whole-foreground",draw:o,color:f.SECONDARY},{selector:"#whole-double rect",draw:n}]},{time:[/^2[nt]/],selectors:[{selector:"#divide-background",draw:o},{selector:"#divide-foreground",draw:o,color:f.SECONDARY},{selector:"#divide-line",draw:n,autoHeight:!0}]},{time:[/^4[nt]/],selectors:[{selector:"#divide-background",draw:o},{selector:"#divide-line",draw:n,autoHeight:!0}]},{time:[/^8[nt]/],selectors:[{selector:"#divide-background",draw:o},{selector:"#divide-line",draw:n,autoHeight:!0}]},{time:[/^16[nt]/],selectors:[{selector:"#divide-background",draw:o},{selector:"#divide-line",draw:n,autoHeight:!0}]},{time:[/^32[nt]/],selectors:[{selector:"#divide-background",draw:o},{selector:"#divide-line",draw:n,autoHeight:!0}]}],B=`<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 27.8.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="26px" height="39px" viewBox="0 0 26 39" style="enable-background:new 0 0 26 39;" xml:space="preserve">
<polygon id="divide-background" style="display:none;" points="19,30 19,29 18,29 18,28 16,28 16,27 13,27 13,28 11,28 11,29 10,29
	10,30 9,30 9,31 9,32 9,33 10,33 10,34 11,34 11,35 13,35 13,36 16,36 16,35 18,35 18,34 19,34 19,33 20,33 20,32 20,31 20,30 "/>
<polygon id="divide-foreground" style="display:none;fill:#FFFFFF;" points="16,30 16,29 15,29 14,29 14,30 13,30 13,31 12,31
	12,32 12,33 13,33 13,34 14,34 15,34 15,33 16,33 16,32 17,32 17,31 17,30 "/>
<rect id="divide-line" x="19" width="1" height="30"/>
<polygon id="divide-line-4" style="display:none;" points="20,23 24,23 24,25 26,25 26,22 25,22 25,21 20,21 "/>
<polygon id="divide-line-3" style="display:none;" points="20,17 24,17 24,19 26,19 26,16 25,16 25,15 20,15 "/>
<polygon id="divide-line-2" style="display:none;" points="20,11 24,11 24,13 26,13 26,10 25,10 25,9 20,9 "/>
<polygon id="divide-line-1" style="display:none;" points="20,5 24,5 24,7 26,7 26,4 25,4 25,3 20,3 "/>
<polygon id="dot" style="display:none;" points="24,31 23,31 23,30 22,30 22,31 21,31 21,32 22,32 22,33 23,33 23,32 24,32 "/>
<polygon id="whole-background" points="18.9,30 18.9,29 17.9,29 17.9,28 15.7,28 15.7,27 9.3,27 9.3,28 7.1,28 7.1,29 6.1,29
	6.1,30 5,30 5,31 5,32 5,33 6.1,33 6.1,34 7.1,34 7.1,35 9.3,35 9.3,36 15.7,36 15.7,35 17.9,35 17.9,34 18.9,34 18.9,33 20,33
	20,32 20,31 20,30 "/>
<polygon id="whole-foreground" style="fill:#FFFFFF;" points="14.8,31 14.8,30 13.7,30 13.7,29 10.2,29 10.2,30 9,30 9,32 10.2,32
	10.2,33 11.3,33 11.3,34 14.8,34 14.8,33 16,33 16,31 "/>
<g id="whole-double" style="display:none;">
	<rect x="3" y="27" style="display:inline;" width="1" height="9"/>
	<rect x="1" y="27" style="display:inline;" width="1" height="9"/>
	<rect x="23" y="27" style="display:inline;" width="1" height="9"/>
	<rect x="21" y="27" style="display:inline;" width="1" height="9"/>
</g>
<polygon id="divide-pause-line-4" style="display:none;" points="17,6 17,7 16,7 16,6 16,5 15,5 15,4 13,4 13,5 12,5 12,6 12,7
	13,7 13,8 15,8 17,8 17,12 18,12 18,6 "/>
<polygon id="divide-pause-line-3" style="display:none;" points="16,12 16,13 15,13 15,12 15,11 14,11 14,10 12,10 12,11 11,11
	11,12 11,13 12,13 12,14 14,14 16,14 16,18 17,18 17,12 "/>
<polygon id="divide-pause-line-2" style="display:none;" points="15,18 15,19
	14,19 14,18 14,17 13,17 13,16 11,16 11,17 10,17 10,18 10,19 11,19 11,20 13,20 15,20 15,24 16,24 16,18 "/>
<polygon id="divide-pause-line-1" style="display:none;" points="14,24 14,25
	13,25 13,24 13,23 12,23 12,22 10,22 10,23 9,23 9,24 9,25 10,25 10,26 12,26 14,26 14,30 15,30 15,24 "/>
<rect id="divide-pause-line-0" x="13" y="30" style="display:none;" width="1" height="6"/>
<rect id="half-pause" x="10" y="27" style="display:none;" width="8" height="3"/>
<rect id="whole-pause" x="10" y="31" style="display:none;" width="8" height="3"/>
<rect id="double-pause" x="10" y="27" style="display:none;" width="8" height="7"/>
<g id="sharp" style="display:none;">
	<rect x="3" y="27" style="display:inline;" width="1" height="9"/>
	<rect x="1" y="29" style="display:inline;" width="7" height="1"/>
	<rect x="1" y="33" style="display:inline;" width="7" height="1"/>
	<rect x="5" y="27" style="display:inline;" width="1" height="9"/>
</g>
<g id="double-sharp" style="display:none;">
	<rect x="1" y="29" style="display:inline;" width="2" height="2"/>
	<rect x="1" y="33" style="display:inline;" width="2" height="2"/>
	<rect x="5" y="29" style="display:inline;" width="2" height="2"/>
	<rect x="5" y="33" style="display:inline;" width="2" height="2"/>
	<rect x="3" y="31" style="display:inline;" width="2" height="2"/>
</g>
<g id="flat-2" style="display:none;">
	<rect x="1" y="30" style="display:inline;" width="2" height="1"/>
	<rect y="23" style="display:inline;" width="1" height="13"/>
	<rect x="3" y="31" style="display:inline;" width="1" height="4"/>
	<rect y="31" style="display:inline;" width="1" height="4"/>
	<rect x="1" y="35" style="display:inline;" width="2" height="1"/>
</g>
<g id="flat-1" style="display:none;">
	<rect x="5" y="30" style="display:inline;" width="2" height="1"/>
	<rect x="4" y="23" style="display:inline;" width="1" height="13"/>
	<rect x="7" y="31" style="display:inline;" width="1" height="4"/>
	<rect x="4" y="31" style="display:inline;" width="1" height="4"/>
	<rect x="5" y="35" style="display:inline;" width="2" height="1"/>
</g>
<g id="natural" style="display:none;">
	<rect x="4" y="27" style="display:inline;" width="2" height="2"/>
	<rect x="4" y="32" style="display:inline;" width="2" height="2"/>
	<rect x="2" y="28" style="display:inline;" width="2" height="2"/>
	<rect x="2" y="33" style="display:inline;" width="2" height="2"/>
	<rect x="6" y="26" style="display:inline;" width="1" height="12"/>
	<rect x="1" y="24" style="display:inline;" width="1" height="12"/>
</g>
</svg>
`,P=100,X=3;class K{constructor(e){y(this,"canvas");y(this,"firstPixel");this.canvas=e,this.firstPixel=L(this.canvas)}}function L(t){const e=t.getContext("2d");if(!e)throw new Error("Canvas context is not available");const{data:s}=e.getImageData(0,0,t.width,t.height);for(let i=0;i<s.length;i+=4)if(s[i+3]===255){const l=Math.floor(i/4/t.width),a=i/4-l*t.width;return R(a,l)}}const W=new Map;class Q{constructor(e={localCache:!1}){y(this,"queue");y(this,"canvas");y(this,"canvasContext");y(this,"svgNode");y(this,"dimension");y(this,"localCache",!1);y(this,"_cache",new Map);y(this,"colors",{background:"#000000",foreground:"#000000"});const{localCache:s,svgNode:i}=e||{};this.localCache=s!==void 0?s:!1,this.queue=Promise.resolve(void 0);const l=new DOMParser,a=i||l.parseFromString(B,"image/svg+xml").querySelector("svg");if(!a)throw new Error("SVG node is not available");this.svgNode=a;const{width:h,height:d}=this.svgNode.viewBox.baseVal;this.dimension=R(h,d),this.canvas=new OffscreenCanvas(this.dimension.x+P,this.dimension.y+P);const r=this.canvas.getContext("2d",{willReadFrequently:!0});if(!r)throw new Error("Canvas context is not available");this.canvasContext=r,this.canvasContext.imageSmoothingEnabled=!1}get cache(){return this.localCache?this._cache:W}render(e,s,i=0){const{colors:l}=s||{},a={background:"#0055aa",foreground:"#000000",...l},h=[e.getName(),e.getTime(),Object.values(a).join("_"),i].join("_");return this.cache.has(h)?Promise.resolve(this.cache.get(h)):this.queue=this.queue.then(()=>{var C,F,E,N,k;const d=this.svgNode,r=this.canvasContext.canvas,c=this.canvasContext;c.clearRect(0,0,r.width,r.height);const w=(e.isPause?q:j).find(_=>_.time.find(T=>e.time&&T.test(e.time.toString())));w&&p(d,c,w.selectors,a,i),(C=e.time)!=null&&C.dot&&p(d,c,u("dot",e),a,i),(F=e.note)!=null&&F.flat&&p(d,c,u("flat",e),a,i),(E=e.note)!=null&&E.doubleFlat&&p(d,c,u("doubleFlat",e),a,i),(N=e.note)!=null&&N.sharp&&p(d,c,u("sharp",e),a,i),(k=e.note)!=null&&k.doubleSharp&&p(d,c,u("doubleSharp",e),a,i);const{x:A,y:O,width:I,height:M}=z(c);let m=0,v=M+X;w&&w.offset&&(w.offset[1]<0?(m=Math.abs(m),v+=Math.abs(m)):v+=w.offset[1]);const g=new OffscreenCanvas(I,v),x=g.getContext("2d");if(!x)throw new Error("Canvas context is not available");x.imageSmoothingEnabled=!1,x.drawImage(r,A,O,g.width,g.height,0,0,g.width,g.height);const S=new K(g);return this.cache.set(h,S),S})}}function z(t){const e=t.canvas,s=t.getImageData(0,0,e.width,e.height).data;let i=1/0,l=-1/0,a=1/0,h=-1/0;for(let d=0;d<s.length;d+=4){const r=Math.floor(d/4)%e.width,c=Math.floor(d/4/e.width);s[d+3]&&(r<i?i=r:r>l&&(l=r),c<a?a=c:c>h&&(h=c))}return{x:i,y:a,width:l-i+1,height:h-a+1}}function p(t,e,s,i,l=0){s.forEach(({selector:a,draw:h,color:d,offset:r,autoHeight:c})=>{r=[...r||[0,0]],r[0]+=(e.canvas.width-26)/2,r[1]+=l,Array.from(t.querySelectorAll(a)).forEach(b=>{h(e,b,r,i[d||f.PRIMARY],c&&l||0)})})}function u(t,e){var s;return((s=V.find(i=>{var l;return i.name===t&&e.time&&(((l=i.test)==null?void 0:l.test(e.time.toString()))||!i.test)}))==null?void 0:s.selectors)||[]}export{Q as N,X as S,B as a};
