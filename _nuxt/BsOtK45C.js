import{k as o}from"./9V19AFUE.js";import{x as s,r as f}from"./Bx1Gqxs7.js";const e=f([]);function c(){const r=t=>{t=t.filter(n=>!e.value.find(a=>a.fontFamily===n.fontFamily)),e.value=[...e.value,...t]};return s(()=>({link:e.value.filter(t=>t.preload).map(t=>({key:`preload-${o(t.fontFamily)}`,rel:"preload",as:"font",href:t.src[0],type:`font/${t.src[1]}`,crossorigin:"anonymous"})),style:[{key:"fonts",innerHTML:i(e.value)}]})),{registerFont:r}}function i(r){return r.map(t=>`
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
`)}export{c as u};
