(window.webpackJsonp=window.webpackJsonp||[]).push([[63,26],{162:function(t,n,l){var content=l(229);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,l(6).default)("77125c28",content,!0,{sourceMap:!1})},187:function(t,n,l){"use strict";l.r(n);var e=l(87),o=l(78),r=l(81),c={components:{AtomMarkdown:e.a},mixins:[o.a],data:()=>({content:["# Calculator","Version: **1.0**  \nCreated by **Thorn-Welf Walli**"].join("\n")}),computed:{contextMenu(){return new r.a(_,{core:this.core})}}},d=(l(228),l(7)),m=Object(d.a)(c,(function(){var t=this,n=t.$createElement,l=t._self._c||n;return l("div",{staticClass:"wb-disks-workbench13-calculator-info"},[l("atom-markdown",{attrs:{content:t.content}})],1)}),[],!1,null,null,null).exports,_=n.default=t=>{var{core:n}=t,{windows:l}=n.modules;return[{title:"Calculator",items:[{hotKey:"I",keyCode:73,title:"Info",action(){l.addWindow({title:"Info",component:m,componentData:{},options:{scale:!1,prompt:!1,scrollX:!1,scrollY:!1}},{group:"workbench13Calculator"})}}]}]}},228:function(t,n,l){"use strict";l(162)},229:function(t,n,l){var e=l(5)(!1);e.push([t.i,"\n.wb-disks-workbench13-calculator-info {\n  min-width: 240px;\n  padding: calc(var(--default-element-margin) * 2);\n}\n",""]),t.exports=e},332:function(t,n,l){var content=l(611);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,l(6).default)("e45ddc36",content,!0,{sourceMap:!1})},610:function(t,n,l){"use strict";l(332)},611:function(t,n,l){var e=l(5)(!1);e.push([t.i,'\n:root {\n  --color__workbench13__calculator__background: #000;\n  --color__workbench13__calculator__button__text: #fff;\n  --color__workbench13__calculator__button__border: #fff;\n  --color__workbench13__calculator__result__border: #fff;\n}\n.wb-disks-workbench13-calculator {\n  padding: var(--default-element-margin);\n\n  /* padding-top: 5px; */\n\n  /* margin: -3px -2px; */\n  background: var(--color__workbench13__calculator__background);\n& .calculator__result {\n    display: block;\n    width: auto;\n    padding: 2px 4px;\n    padding-bottom: 0;\n    margin-right: 2px;\n    margin-bottom: 9px;\n    margin-left: 2px;\n    text-align: right;\n    border: solid var(--color__workbench13__calculator__result__border);\n    border-width: 2px 1px;\n&:empty {\n&::before {\n        display: inline-block;\n        content: "\\00a0";\n}\n}\n}\n& .calculator__buttons {\n    width: 180px;\n    clear: fix;\n& > span {\n      display: block;\n      float: left;\n      width: calc(100% / 5);\n      padding: 6px 5px;\n& input {\n        display: block;\n        width: 26px;\n        padding: 0 0;\n        padding-top: 2px;\n        padding-left: 1px;\n        line-height: 1;\n        color: var(--color__workbench13__calculator__button__text);\n        text-align: center;\n        background: transparent;\n        border: solid var(--color__workbench13__calculator__button__border) 1px;\n        border-top-width: 2px;\n        border-radius: 0;\n        outline: none;\n        appearance: none;\n}\n}\n}\n}\n',""]),t.exports=e},631:function(t,n,l){"use strict";l.r(n);var e=l(78),o=l(187),r=l(81);function c(t,n,l,e,o,r,c){try{var d=t[r](c),m=d.value}catch(t){return void l(t)}d.done?n(m):Promise.resolve(m).then(e,o)}var d={mixins:[e.a],data:()=>({tmpValueA:null,tmpValueB:null,tmpOperator:null,result:null,value:null,buttons:["7","8","9","CA","CE","4","5","6","*","/","1","2","3","+","-","0",".","<-","+-","="]}),computed:{contextMenu(){return new r.a(o.default,{core:this.core,model:this})},resultValue(){return[this.tmpValueA,this.tmpOperator,this.tmpValueB].filter((t=>null!==t)).join(" ")}},methods:{onClickButton(t){var n,l=this;return(n=function*(){var n=t.target.value;if(/^[0-9,.]+$/.test(n)&&null===l.tmpOperator?l.tmpValueA=(l.tmpValueA||"")+n:/^[0-9,.]+$/.test(n)&&l.tmpOperator&&null!==l.tmpValueA&&(l.tmpValueB=(l.tmpValueB||"")+n),/^[\\/*-+=]$/.test(n)&&null!==l.tmpValueA&&null!==l.tmpValueB&&l.tmpOperator){var e=yield l.core.modules.parser.parseMath("".concat(l.tmpValueA).concat(l.tmpOperator).concat(l.tmpValueB));l.tmpValueA=e,l.tmpOperator=null,l.tmpValueB=null}/^[\\/*-+]$/.test(n)&&null!==l.tmpValueA&&null===l.tmpValueB&&(l.tmpOperator=n),/^<-$/.test(n)&&null!==l.tmpValueA&&(null!==l.tmpValueA&&null===l.tmpValueB?(l.tmpOperator=null,l.tmpValueA=String(l.tmpValueA).slice(0,l.tmpValueA.length-1)):null!==l.tmpValueA&&l.tmpOperator&&(l.tmpValueB=String(l.tmpValueB).slice(0,l.tmpValueB.length-1))),/^\+-$/.test(n)&&(null!==l.tmpValueA&&null===l.tmpValueB?l.tmpValueA=-1*parseFloat(l.tmpValueA):null!==l.tmpValueA&&l.tmpOperator&&(l.tmpValueB=-1*parseFloat(l.tmpValueB))),/^CA$/.test(n)&&(l.tmpOperator=l.tmpValueA=l.tmpValueB=null),/^CE$/.test(n)&&(null!==l.tmpValueB?l.tmpValueB=null:l.tmpOperator?l.tmpOperator=null:null!==l.tmpValueA&&(l.tmpValueA=null))},function(){var t=this,l=arguments;return new Promise((function(e,o){var r=n.apply(t,l);function d(t){c(r,e,o,d,m,"next",t)}function m(t){c(r,e,o,d,m,"throw",t)}d(void 0)}))})()}}},m=(l(610),l(7)),component=Object(m.a)(d,(function(){var t=this,n=t.$createElement,l=t._self._c||n;return l("div",{staticClass:"wb-disks-workbench13-calculator"},[l("span",{staticClass:"calculator__result",attrs:{"data-hook":"calculatorResult"}},[t._v(t._s(t.resultValue))]),t._v(" "),l("div",{staticClass:"calculator__buttons"},t._l(t.buttons,(function(button,n){return l("span",{key:n},[l("input",{attrs:{type:"button",value:button},on:{click:t.onClickButton}})])})),0)])}),[],!1,null,null,null);n.default=component.exports}}]);