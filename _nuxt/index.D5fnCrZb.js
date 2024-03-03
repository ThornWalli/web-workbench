import{L as t}from"./entry.iryMmbvS.js";const n=(i,e)=>{const r=i[e];return r?typeof r=="function"?r():Promise.resolve(r):new Promise((_,o)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(o.bind(null,new Error("Unknown variable dynamic import: "+e)))})};function m(i){return n(Object.assign({"./debug/index.js":()=>t(()=>import("./index.BAGRv4JT.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url),"./examples/index.js":()=>t(()=>import("./index.Ka5ZFN92.js"),__vite__mapDeps([5,1,2,3,4]),import.meta.url),"./extras13/index.js":()=>t(()=>import("./index.CwZ1AmgN.js").then(e=>e.j),__vite__mapDeps([6,2,1,3,4,7,8,9]),import.meta.url),"./workbench13/index.js":()=>t(()=>import("./index.ChhH158z.js"),__vite__mapDeps([10,2,1,3,4,11,12,9,13,14,15]),import.meta.url)}),`./${i}/index.js`).then(e=>e.default)}export{m as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./index.BAGRv4JT.js","./entry.iryMmbvS.js","./index.pHb0QNhI.js","./index.CTgiTu_k.js","./index.DOLM4Vuo.css","./index.Ka5ZFN92.js","./index.CwZ1AmgN.js","./viewport.Byzer3nm.js","./math.BwsrdhRf.js","./async.2D_YJbQ6.js","./index.ChhH158z.js","./Console.D9okyanI.js","./InputText.BFdmTYS2.js","./InputText.03i52FmX.css","./Console.DhUZibs5.css","./index.CFruo1lT.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
