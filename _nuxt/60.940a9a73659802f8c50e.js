(window.webpackJsonp=window.webpackJsonp||[]).push([[60,27],{163:function(t,e,n){var content=n(231);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(6).default)("2721f88e",content,!0,{sourceMap:!1})},188:function(t,e,n){"use strict";n.r(e);var o=n(87),r=n(78),l=n(81),c={components:{AtomMarkdown:o.a},mixins:[r.a],data:()=>({content:["# Clock","Version: **1.0**  \nCreated by **Thorn-Welf Walli**"].join("\n")}),computed:{contextMenu(){return new l.a(f,{core:this.core})}}},h=(n(230),n(7)),d=Object(h.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wb-disks-workbench13-clock-info"},[n("atom-markdown",{attrs:{content:t.content}})],1)}),[],!1,null,null,null).exports,f=e.default=t=>{var{core:e}=t,{windows:n}=e.modules;return[{title:"Clock",items:[{hotKey:"I",keyCode:73,title:"Info",action(){n.addWindow({title:"Info",component:d,componentData:{},options:{scale:!1,prompt:!1,scrollX:!1,scrollY:!1}},{group:"workbench13Clock"})}}]}]}},230:function(t,e,n){"use strict";n(163)},231:function(t,e,n){var o=n(5)(!1);o.push([t.i,"\n.wb-disks-workbench13-clock-info {\n  min-width: 240px;\n  padding: calc(var(--default-element-margin) * 2);\n}\n",""]),t.exports=o},243:function(t,e,n){"use strict";(function(t){var o=n(74),r=n(78),l=n(188),c=n(81);e.a={mixins:[r.a],data:()=>({colors:["#888888","#000000","#FFAA55"],sprites:[],periodPM:!1,interval:null}),computed:{timeAmPm(){return this.periodPM?"PM":"AM"},contextMenu(){return new c.a(l.default,{core:this.core})}},destroyed(){t.clearInterval(this.interval)},mounted(){var t,e,n,r,l,c,h,canvas=this.$refs.canvas;canvas.width=this.$el.offsetWidth,canvas.height=this.$el.offsetHeight,this.sprites=(t=canvas.width,e=canvas.height,n=2,r=this.colors,c=t/2-(l=5),h=Object(o.e)((()=>c+l)),[(t,canvas)=>{t.translate(h.x,h.y);var e=3,n=[.5,.34],o=0,l=0;t.beginPath(),t.moveTo(o,l),t.lineTo(o-e,l-canvas.width/2*n[1]),t.lineTo(o,l-canvas.width/2*n[0]),t.lineTo(o+e,l-canvas.width/2*n[1]),t.lineTo(o,l),t.strokeStyle=r[1],t.fillStyle=r[1],t.stroke(),t.fill()},(t,canvas)=>{t.translate(h.x,h.y);var e=4,n=[.7,.54],o=0,l=0;t.beginPath(),t.moveTo(o,l),t.lineTo(o-e,l-canvas.width/2*n[1]),t.lineTo(o,l-canvas.width/2*n[0]),t.lineTo(o+e,l-canvas.width/2*n[1]),t.lineTo(o,l),t.strokeStyle=r[1],t.fillStyle=r[1],t.stroke(),t.fill()},(t,canvas)=>{t.translate(h.x,h.y);var e=0,n=.74,o=0,l=0;t.beginPath(),t.moveTo(o,l),t.lineTo(o+e,l-canvas.width/2*n),t.lineTo(o,l),t.strokeStyle=r[2],t.stroke()},(t,canvas)=>{t.translate(h.x,h.y),function(t,e,n,o){t.beginPath(),t.arc(0,0,e-n,0,2*Math.PI,!1),t.fillStyle=o[0],t.fill()}(t,c,n,r)},(t,canvas)=>{t.translate(h.x,h.y),function(t,e,n){var i;for(i=0;i<60;i++){t.rotate(-Math.PI/2),t.beginPath();var o=0-e+12,r=6;t.moveTo(0,o),t.lineTo(0,o-r),t.rotate(Math.PI/3/5),t.lineWidth=2,t.strokeStyle=n[1],t.stroke()}for(t.rotate(-Math.PI/3/5*60),i=0;i<16;i++){t.rotate(-Math.PI/2),t.beginPath();var l=0-e+15,c=6,h=10;t.moveTo(0,l),t.lineTo(0+c/2,l-h/2),t.lineTo(0,l-h),t.lineTo(0-c/2,l-h/2),t.lineTo(0,l),t.rotate(Math.PI/3),t.fillStyle=n[1],t.fill()}t.rotate(-Math.PI/3*16)}(t,c,r)}].map((n=>{var canvas=document.createElement("canvas");canvas.width=t,canvas.height=e;var o=canvas.getContext("2d");return o.imageSmoothingEnabled=!1,n(o,canvas),canvas}))),this.render(canvas,canvas.getContext("2d"))},methods:{render(canvas,e){var n=canvas.width/2-5,r=Object(o.e)((()=>n+5)),l=Object(o.e)(canvas.width,canvas.height);e.imageSmoothingEnabled=!1,e.setTransform(1,0,0,1,0,0),e.translate(r.x,r.y),e.scale(1,1.015),e.beginPath(),e.arc(0,0,n,0,2*Math.PI,!1),e.fillStyle=this.colors[1],e.fill(),e.scale(1,.985);var c=this.sprites,h=n=>{t.requestAnimationFrame((()=>{e.drawImage(c[3],-r.x,-r.y,l.x,l.y),e.drawImage(c[4],-r.x,-r.y,l.x,l.y),e.strokeStyle=this.colors[1],e.setTransform(1,0,0,1,0,0);var t=new Date;this.periodPM=t.getHours()>12,function(t,e,n,o,r){var l=e.getHours()*(2*Math.PI/12)+2*Math.PI/12*e.getMinutes()/60,c=e.getMinutes()*(2*Math.PI/60),h=e.getSeconds()*(2*Math.PI/60);n.translate(o.x,o.y),n.rotate(l),n.drawImage(t[0],-o.x,-o.y,r.x,r.y),n.rotate(-l),n.rotate(c),n.drawImage(t[1],-o.x,-o.y,r.x,r.y),n.rotate(-c),n.rotate(h),n.drawImage(t[2],-o.x,-o.y,r.x,r.y),n.rotate(-h)}(c,t,e,r,l);for(var o=e.getImageData(0,0,l.x,l.y),data=o.data,i=0;i<data.length;i+=4){var h=data[Number(i)],g=data[i+1],b=data[i+2];if(255!==h||170!==g||85!==b){var d=.2126*h+.7152*g+.0722*b>=50?255:0;.2126*h+.7152*g+.0722*b>=50&&(data[Number(i)]=data[i+1]=data[i+2]=d)}}e.putImageData(o,0,0),n&&n()}))};h((()=>{this.interval=t.setInterval(h,1e3)}))}}}}).call(this,n(8))},331:function(t,e,n){var content=n(609);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(6).default)("7f2b463b",content,!0,{sourceMap:!1})},608:function(t,e,n){"use strict";n(331)},609:function(t,e,n){var o=n(5)(!1);o.push([t.i,"\n.wb-disks-workbench13-clock {\n  position: relative;\n  width: calc(157px + 10px);\n  height: calc(157px + 10px);\n& canvas {\n    display: block;\n    width: 100%;\n    height: 100%;\n}\n& .clock__period {\n    position: absolute;\n    top: var(--default-element-margin);\n    right: var(--default-element-margin);\n}\n}\n\n",""]),t.exports=o},639:function(t,e,n){"use strict";n.r(e);var o=n(243).a,r=(n(608),n(7)),component=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wb-disks-workbench13-clock"},[n("canvas",{ref:"canvas"}),t._v(" "),n("span",{staticClass:"clock__period"},[t._v(t._s(t.timeAmPm))])])}),[],!1,null,null,null);e.default=component.exports}}]);