import{j as r,l as f,C as l,k as s}from"./entry.52443c42.js";import{p as i}from"./index.26bb4b3d.js";const n=""+new URL("Amiga-Topaz-13.add47897.woff2",import.meta.url).href,a=""+new URL("Amiga-Topaz-13-Console.e4c7cee6.woff2",import.meta.url).href;function m(){r({link:e.filter(o=>o.preload).map(o=>({key:`preload-${i(o.fontFamily)}`,rel:"preload",as:"font",href:o.src[0],type:`font/${o.src[1]}`,crossorigin:"anonymous"})),style:[{key:"fonts",innerHTML:p(e)}]})}const e=[{preload:!0,fontFamily:"Amiga Topaz 13",fontVariant:"normal",fontFeatureSettings:"normal",fontStretch:"normal",fontWeight:400,fontStyle:"normal",fontDisplay:"swap",src:[n,"woff2"]},{preload:!0,fontFamily:"Amiga Topaz 13 Console",fontVariant:"normal",fontFeatureSettings:"normal",fontStretch:"normal",fontWeight:400,fontStyle:"normal",fontDisplay:"swap",src:[a,"woff2"]},{fontFamily:"Amiga Topaz 13",fontVariant:"normal",fontFeatureSettings:"normal",fontStretch:"normal",fontWeight:700,fontStyle:"normal",fontDisplay:"swap",src:[n,"woff2"]},{fontFamily:"Amiga Topaz 13 Console",fontVariant:"normal",fontFeatureSettings:"normal",fontStretch:"normal",fontWeight:700,fontStyle:"normal",fontDisplay:"swap",src:[a,"woff2"]}];function p(o){return o.map(t=>`
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
`)}const g={__name:"default",setup(o){return m(),r({link:[{rel:"shortcut icon",type:"image/png",href:"/favicon.png"}]}),(t,c)=>(s(),f("div",null,[l(t.$slots,"default")]))}};export{g as default};
