import{i as C}from"./OlYXjGCK.js";function t(s,e,n,i,o=0){s.fillStyle=i,s.fillRect(Number(e.getAttribute("x"))+n[0],Number(e.getAttribute("y"))+n[1]-o,Number(e.getAttribute("width")),Number(e.getAttribute("height"))+o)}function l(s,e,n,i){if(!(e instanceof SVGPolygonElement))throw new Error("polygon is not an instance of SVGPolygonElement");s.fillStyle=i,s.beginPath(),Array.from(e.points).forEach((o,a)=>{a<1?s.moveTo(o.x+n[0],o.y+n[1]):s.lineTo(o.x+n[0],o.y+n[1])}),s.closePath(),s.fill()}const A=[{test:/^2m/,name:"sharp",selectors:[{selector:"#sharp rect",draw:t,offset:[-8,0]}]},{test:/^2m/,name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:t,offset:[-8,0]}]},{test:/^2m/,name:"dot",selectors:[{selector:"#dot",draw:l,offset:[4,0]}]},{test:/^1m/,name:"sharp",selectors:[{selector:"#sharp rect",draw:t,offset:[-4,0]}]},{test:/^1m/,name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:t,offset:[-4,0]}]},{test:/^1m/,name:"dot",selectors:[{selector:"#dot",draw:l,offset:[1,0]}]},{test:/^2m/,name:"flat",selectors:[{selector:"#flat-1 rect",draw:t,offset:[-8,0]}]},{test:/^2m/,name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:t,offset:[-8,0]},{selector:"#flat-2 rect",draw:t,offset:[-8,0]}]},{test:/^1m/,name:"flat",selectors:[{selector:"#flat-1 rect",draw:t,offset:[-5,0]}]},{test:/^1m/,name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:t,offset:[-5,0]},{selector:"#flat-2 rect",draw:t,offset:[-5,0]}]},{name:"flat",selectors:[{selector:"#flat-1 rect",draw:t}]},{name:"doubleFlat",selectors:[{selector:"#flat-1 rect",draw:t},{selector:"#flat-2 rect",draw:t}]},{name:"sharp",selectors:[{selector:"#sharp rect",draw:t}]},{name:"doubleSharp",selectors:[{selector:"#double-sharp rect",draw:t}]},{name:"dot",selectors:[{selector:"#dot",draw:l}]}],O=[{time:[/^1m/],offset:[0,3],selectors:[{selector:"#whole-pause",draw:t}]},{time:[/^2m/],offset:[0,3],selectors:[{selector:"#double-pause",draw:t}]},{time:[/^2[nt]/],offset:[0,7],selectors:[{selector:"#half-pause",draw:t}]},{time:[/^4[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:t},{selector:"#divide-pause-line-1",draw:l}]},{time:[/^8[nt]/],selectors:[{selector:"#divide-pause-line-0",draw:t},{selector:"#divide-pause-line-1",draw:l},{selector:"#divide-pause-line-2",draw:l}]},{time:[/^16[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:t},{selector:"#divide-pause-line-1",draw:l},{selector:"#divide-pause-line-2",draw:l,color:"black"},{selector:"#divide-pause-line-3",draw:l,color:"black"}]},{time:[/^32[nt]/],offset:[0,0],selectors:[{selector:"#divide-pause-line-0",draw:t},{selector:"#divide-pause-line-1",draw:l},{selector:"#divide-pause-line-2",draw:l},{selector:"#divide-pause-line-3",draw:l},{selector:"#divide-pause-line-4",draw:l}]}],u={PRIMARY:"primary",SECONDARY:"secondary"},I=[{time:[/^1m/],selectors:[{selector:"#whole-background",draw:l},{selector:"#whole-foreground",draw:l,color:u.SECONDARY}]},{time:[/^2m/],selectors:[{selector:"#whole-background",draw:l},{selector:"#whole-foreground",draw:l,color:u.SECONDARY},{selector:"#whole-double rect",draw:t}]},{time:[/^2[nt]/],selectors:[{selector:"#divide-background",draw:l},{selector:"#divide-foreground",draw:l,color:u.SECONDARY},{selector:"#divide-line",draw:t,autoHeight:!0}]},{time:[/^4[nt]/],selectors:[{selector:"#divide-background",draw:l},{selector:"#divide-line",draw:t,autoHeight:!0}]},{time:[/^8[nt]/],selectors:[{selector:"#divide-background",draw:l},{selector:"#divide-line",draw:t,autoHeight:!0}]},{time:[/^16[nt]/],selectors:[{selector:"#divide-background",draw:l},{selector:"#divide-line",draw:t,autoHeight:!0}]},{time:[/^32[nt]/],selectors:[{selector:"#divide-background",draw:l},{selector:"#divide-line",draw:t,autoHeight:!0}]}],M=`<?xml version="1.0" encoding="utf-8"?>
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
`,S=100,_=3;class T{canvas;firstPixel;constructor(e){this.canvas=e,this.firstPixel=Y(this.canvas)}}function Y(s){const e=s.getContext("2d");if(!e)throw new Error("Canvas context is not available");const{data:n}=e.getImageData(0,0,s.width,s.height);for(let i=0;i<n.length;i+=4)if(n[i+3]===255){const o=Math.floor(i/4/s.width),a=i/4-o*s.width;return C(a,o)}}const G=new Map;class j{queue;canvas;canvasContext;svgNode;dimension;localCache=!1;_cache=new Map;colors={background:"#000000",foreground:"#000000"};constructor(e={localCache:!1}){const{localCache:n,svgNode:i}=e||{};this.localCache=n!==void 0?n:!1,this.queue=Promise.resolve(void 0);const o=new DOMParser,a=i||o.parseFromString(M,"image/svg+xml").querySelector("svg");if(!a)throw new Error("SVG node is not available");this.svgNode=a;const{width:h,height:d}=this.svgNode.viewBox.baseVal;this.dimension=C(h,d),this.canvas=new OffscreenCanvas(this.dimension.x+S,this.dimension.y+S);const r=this.canvas.getContext("2d",{willReadFrequently:!0});if(!r)throw new Error("Canvas context is not available");this.canvasContext=r,this.canvasContext.imageSmoothingEnabled=!1}get cache(){return this.localCache?this._cache:G}render(e,n,i=0){const{colors:o}=n||{},a={background:"#0055aa",foreground:"#000000",...o},h=[e.getName(),e.getTime(),Object.values(a).join("_"),i].join("_");return this.cache.has(h)?Promise.resolve(this.cache.get(h)):this.queue=this.queue.then(()=>{const d=this.svgNode,r=this.canvasContext.canvas,c=this.canvasContext;c.clearRect(0,0,r.width,r.height);const y=(e.isPause?O:I).find(P=>P.time.find(R=>e.time&&R.test(e.time.toString())));y&&g(d,c,y.selectors,a,i),e.time?.dot&&g(d,c,p("dot",e),a,i),e.note?.flat&&g(d,c,p("flat",e),a,i),e.note?.doubleFlat&&g(d,c,p("doubleFlat",e),a,i),e.note?.sharp&&g(d,c,p("sharp",e),a,i),e.note?.doubleSharp&&g(d,c,p("doubleSharp",e),a,i);const{x:F,y:E,width:N,height:k}=V(c);let f=0,m=k+_;y&&y.offset&&(y.offset[1]<0?(f=Math.abs(f),m+=Math.abs(f)):m+=y.offset[1]);const w=new OffscreenCanvas(N,m),v=w.getContext("2d");if(!v)throw new Error("Canvas context is not available");v.imageSmoothingEnabled=!1,v.drawImage(r,F,E,w.width,w.height,0,0,w.width,w.height);const b=new T(w);return this.cache.set(h,b),b})}}function V(s){const e=s.canvas,n=s.getImageData(0,0,e.width,e.height).data;let i=1/0,o=-1/0,a=1/0,h=-1/0;for(let d=0;d<n.length;d+=4){const r=Math.floor(d/4)%e.width,c=Math.floor(d/4/e.width);n[d+3]&&(r<i?i=r:r>o&&(o=r),c<a?a=c:c>h&&(h=c))}return{x:i,y:a,width:o-i+1,height:h-a+1}}function g(s,e,n,i,o=0){n.forEach(({selector:a,draw:h,color:d,offset:r,autoHeight:c})=>{r=[...r||[0,0]],r[0]+=(e.canvas.width-26)/2,r[1]+=o,Array.from(s.querySelectorAll(a)).forEach(x=>{h(e,x,r,i[d||u.PRIMARY],c&&o||0)})})}function p(s,e){return A.find(n=>n.name===s&&e.time&&(n.test?.test(e.time.toString())||!n.test))?.selectors||[]}export{j as N,_ as S,M as a};
