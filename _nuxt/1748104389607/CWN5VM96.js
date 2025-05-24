import{a as v}from"./CGDfseBP.js";import{c as F}from"./CSlkdJUE.js";import{o as m,i as $}from"./6C4StZv5.js";import{a as l}from"./DN3eHOnZ.js";import{k as g}from"./9V19AFUE.js";import{u as h}from"./CEMoWgfm.js";import{r as d}from"./BHV1diwp.js";function O(r,t){return new Promise(function(e,n){var s=!1,i;r.subscribe({next:function(a){i=a,s=!0},error:n,complete:function(){s?e(i):n(new v)}})})}function b(r,t,e,n,s){return function(i,a){var u=e,f=t,p=0;i.subscribe(F(a,function(c){var y=p++;f=u?r(f,c,y):(u=!0,c)},function(){u&&a.next(f),a.complete()}))}}function k(r,t){return m(b(r,t,arguments.length>=2,!1,!0))}var x=function(r,t){return r.push(t),r};function _(){return m(function(r,t){k(x,[])(r).subscribe(t)})}function A(r,t){return $(t)?l(r,t,1):l(r,1)}const o=d([]);function B(){const r=t=>{t=t.filter(e=>!o.value.find(n=>n.fontFamily===e.fontFamily)),o.value=[...o.value,...t]};return h(()=>({link:o.value.filter(t=>t.preload).map(t=>({key:`preload-${g(t.fontFamily)}`,rel:"preload",as:"font",href:t.src[0],type:`font/${t.src[1]}`,crossorigin:"anonymous"})),style:[{key:"fonts",innerHTML:S(o.value)}]})),{registerFont:r}}function S(r){return r.map(t=>`
@font-face {
  font-family: "${t.fontFamily}";
  font-variant: ${t.fontVariant};
  font-feature-settings: ${t.fontFeatureSettings};
  font-stretch: ${t.fontStretch};
  font-weight: ${t.fontWeight};
  font-style: ${t.fontStyle};
  font-display: ${t.fontDisplay};
  src: url(${t.src[0]}) format("${t.src[1]}");
}
`).join(`
`)}export{A as c,O as l,k as r,_ as t,B as u};
