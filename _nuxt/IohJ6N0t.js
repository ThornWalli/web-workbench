var _=Object.defineProperty;var G=(t,e,i)=>e in t?_(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var u=(t,e,i)=>(G(t,typeof e!="symbol"?e+"":e,i),i);import{g as A}from"./BUHgHOJF.js";function s(t,e,i,n,l=0){t.fillStyle=n,t.fillRect(Number(e.getAttribute("x"))+i[0],Number(e.getAttribute("y"))+i[1]-l,Number(e.getAttribute("width")),Number(e.getAttribute("height"))+l)}function r(t,e,i,n){if(!(e instanceof SVGPolygonElement))throw new Error("polygon is not an instance of SVGPolygonElement");t.fillStyle=n,t.beginPath(),Array.from(e.points).forEach((l,o)=>{o<1?t.moveTo(l.x+i[0],l.y+i[1]):t.lineTo(l.x+i[0],l.y+i[1])}),t.closePath(),t.fill()}const V=[{test:/^2m/,name:"sharp",selectors:[{selector:"#sharp rect",draw:s,offset:[-8,0]}]},{test:/^2m/,name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:s,offset:[-8,0]}]},{test:/^2m/,name:"dot",selectors:[{selector:"#dot",draw:r,offset:[4,0]}]},{test:/^1m/,name:"sharp",selectors:[{selector:"#sharp rect",draw:s,offset:[-4,0]}]},{test:/^1m/,name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:s,offset:[-4,0]}]},{test:/^1m/,name:"dot",selectors:[{selector:"#dot",draw:r,offset:[1,0]}]},{test:/^2m/,name:"flat",selectors:[{selector:"#flat-1 rect",draw:s,offset:[-8,0]}]},{test:/^2m/,name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:s,offset:[-8,0]},{selector:"#flat-2 rect",draw:s,offset:[-8,0]}]},{test:/^1m/,name:"flat",selectors:[{selector:"#flat-1 rect",draw:s,offset:[-5,0]}]},{test:/^1m/,name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:s,offset:[-5,0]},{selector:"#flat-2 rect",draw:s,offset:[-5,0]}]},{name:"flat",selectors:[{selector:"#flat-1 rect",draw:s}]},{name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:s},{selector:"#flat-2 rect",draw:s}]},{name:"sharp",selectors:[{selector:"#sharp rect",draw:s}]},{name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:(...t)=>s(...t)}]},{name:"dot",selectors:[{selector:"#dot",draw:r}]}],q=[{time:[/^1m/],offset:[0,3],selectors:[{selector:"#whole-pause",draw:s}]},{time:[/^2m/],offset:[0,3],selectors:[{selector:"#double-pause",draw:s}]},{time:[/^2[nt]/],offset:[0,7],selectors:[{selector:"#half-pause",draw:s}]},{time:[/^4[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:s},{selector:"#divide-pause-line-1",draw:r}]},{time:[/^8[nt]/],selectors:[{selector:"#divide-pause-line-0",draw:s},{selector:"#divide-pause-line-1",draw:r},{selector:"#divide-pause-line-2",draw:r}]},{time:[/^16[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:s},{selector:"#divide-pause-line-1",draw:r},{selector:"#divide-pause-line-2",draw:r,color:"black"},{selector:"#divide-pause-line-3",draw:r,color:"black"}]},{time:[/^32[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:s},{selector:"#divide-pause-line-1",draw:r},{selector:"#divide-pause-line-2",draw:r},{selector:"#divide-pause-line-3",draw:r},{selector:"#divide-pause-line-4",draw:r}]}],f={PRIMARY:"primary",SECONDARY:"secondary",TERTIARY:"tertiary"},j=[{time:[/^1m/],selectors:[{selector:"#whole-background",draw:r},{selector:"#whole-foreground",draw:r,color:f.SECONDARY}]},{time:[/^2m/],selectors:[{selector:"#whole-background",draw:r},{selector:"#whole-foreground",draw:r,color:f.SECONDARY},{selector:"#whole-double rect",draw:s}]},{time:[/^2[nt]/],selectors:[{selector:"#divide-background",draw:r},{selector:"#divide-foreground",draw:r,color:f.SECONDARY},{selector:"#divide-line",draw:s,autoHeight:!0}]},{time:[/^4[nt]/],selectors:[{selector:"#divide-background",draw:r},{selector:"#divide-line",draw:s,autoHeight:!0}]},{time:[/^8[nt]/],selectors:[{selector:"#divide-background",draw:r},{selector:"#divide-line",draw:s,autoHeight:!0}]},{time:[/^16[nt]/],selectors:[{selector:"#divide-background",draw:r},{selector:"#divide-line",draw:s,autoHeight:!0}]},{time:[/^32[nt]/],selectors:[{selector:"#divide-background",draw:r},{selector:"#divide-line",draw:s,autoHeight:!0}]}],B=`<?xml version="1.0" encoding="utf-8"?>
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
`,k=100,X=3;class K{constructor(e){this.canvas=e,this.firstPixel=L(this.canvas)}}function L(t){const{data:e}=t.getContext("2d").getImageData(0,0,t.width,t.height);for(let i=0;i<e.length;i+=4)if(e[i+3]===255){const n=Math.floor(i/4/t.width),l=i/4-n*t.width;return A(l,n)}}const W=new Map;class Q{constructor(e){u(this,"localCache",!1);u(this,"_cache",new Map);u(this,"colors",{background:"#000000",foreground:"#000000"});const{localCache:i}=e||{};this.localCache=i!==void 0?i:!1,this.queue=Promise.resolve();const n=new DOMParser;this.svgNode=n.parseFromString(B,"image/svg+xml").querySelector("svg");const{width:l,height:o}=this.svgNode.viewBox.baseVal;this.dimension=A(l,o),this.canvas=new OffscreenCanvas(this.dimension.x+k,this.dimension.y+k),this.canvasContext=this.canvas.getContext("2d",{willReadFrequently:!0}),this.canvasContext.imageSmoothingEnabled=!1}get cache(){return this.localCache?this._cache:W}render(e,i,n=0){const{colors:l}=i||{},o={background:"#0055aa",foreground:"#000000",...l},h=[e.getName(),e.getTime(),Object.values(o).join("_"),n].join("_");return this.cache.has(h)?Promise.resolve(this.cache.get(h)):this.queue=this.queue.then(()=>{var F,C,E,N,R;const a=this.svgNode,c=this.canvasContext.canvas,d=this.canvasContext;d.clearRect(0,0,c.width,c.height);const w=(e.isPause?q:j).find(M=>M.time.find(Y=>Y.test(e.time.toString())));w&&g(a,d,w.selectors,o,n),(F=e.time)!=null&&F.dot&&g(a,d,p("dot",e),o,n),(C=e.note)!=null&&C.flat&&g(a,d,p("flat",e),o,n),(E=e.note)!=null&&E.doubleFlat&&g(a,d,p("doubleFlat",e),o,n),(N=e.note)!=null&&N.sharp&&g(a,d,p("sharp",e),o,n),(R=e.note)!=null&&R.doubleSharp&&g(a,d,p("doubleSharp",e),o,n);const{x:P,y:I,width:O,height:T}=z(d);let m=0,v=T+X;w.offset&&(w.offset[1]<0?(m=Math.abs(m),v+=Math.abs(m)):v+=w.offset[1]);const y=new OffscreenCanvas(O,v),b=y.getContext("2d");b.imageSmoothingEnabled=!1,b.drawImage(c,P,I,y.width,y.height,0,0,y.width,y.height);const S=new K(y);return this.cache.set(h,S),S})}}function z(t){const e=t.canvas,i=t.getImageData(0,0,e.width,e.height).data;let n=1/0,l=-1/0,o=1/0,h=-1/0;for(let a=0;a<i.length;a+=4){const c=Math.floor(a/4)%e.width,d=Math.floor(a/4/e.width);i[a+3]&&(c<n?n=c:c>l&&(l=c),d<o?o=d:d>h&&(h=d))}return{x:n,y:o,width:l-n+1,height:h-o+1}}function g(t,e,i,n,l=0){i.forEach(({selector:o,draw:h,color:a,offset:c,autoHeight:d})=>{c=[...c||[0,0]],c[0]+=(e.canvas.width-26)/2,c[1]+=l,Array.from(t.querySelectorAll(o)).forEach(x=>{h(e,x,c,n[String(a||f.PRIMARY)],d&&l||0)})})}function p(t,e){var i;return(i=V.find(n=>{var l;return n.name===t&&(((l=n.test)==null?void 0:l.test(e.time.toString()))||!n.test)}))==null?void 0:i.selectors}export{Q as N,X as S,B as a};
