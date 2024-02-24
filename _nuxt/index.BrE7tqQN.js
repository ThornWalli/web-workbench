import{L as t}from"./entry.CpSyzEib.js";const n=(i,e)=>{const r=i[e];return r?typeof r=="function"?r():Promise.resolve(r):new Promise((_,o)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(o.bind(null,new Error("Unknown variable dynamic import: "+e)))})};function m(i){return n(Object.assign({"./debug/index.js":()=>t(()=>import("./index.C4U4Z8EV.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url),"./examples/index.js":()=>t(()=>import("./index.CCfY6TJ4.js"),__vite__mapDeps([5,1,2,3,4]),import.meta.url),"./extras13/index.js":()=>t(()=>import("./index.BT3TFeHx.js").then(e=>e.j),__vite__mapDeps([6,2,1,3,4,7,8,9]),import.meta.url),"./workbench13/index.js":()=>t(()=>import("./index.kHtlJGqF.js"),__vite__mapDeps([10,2,1,3,4,11,12,9,13,14,15]),import.meta.url)}),`./${i}/index.js`).then(e=>e.default)}export{m as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./index.C4U4Z8EV.js","./entry.CpSyzEib.js","./index.pPIpAzmo.js","./index.CTgiTu_k.js","./index.DOLM4Vuo.css","./index.CCfY6TJ4.js","./index.BT3TFeHx.js","./viewport.DqHaY1g2.js","./math.0pLGPFJt.js","./async.ejwx1jGb.js","./index.kHtlJGqF.js","./Console.BQ5VUbcp.js","./InputText.CEySllpp.js","./InputText.03i52FmX.css","./Console.DhUZibs5.css","./index.BwgjbnX7.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
