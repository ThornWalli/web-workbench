(window.webpackJsonp=window.webpackJsonp||[]).push([[64,20],{363:function(t,n,e){var content=e(456);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(43).default)("77125c28",content,!0,{sourceMap:!1})},414:function(t,n,e){"use strict";e.r(n);e(116);var l=e(259),r=e(249),o=e(250),c={components:{AtomMarkdown:l.a},mixins:[r.a],data:function(){return{content:["# Calculator","Version: **1.0**  \nCreated by **Thorn-Welf Walli**"].join("\n")}},computed:{contextMenu:function(){return new o.a(_,{core:this.core})}}},m=(e(455),e(44)),d=Object(m.a)(c,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"wb-disks-workbench13-calculator-info"},[e("atom-markdown",{attrs:{content:t.content}})],1)}),[],!1,null,null,null).exports,_=n.default=function(t){var n=t.core.modules.windows;return[{title:"Calculator",items:[{hotKey:"I",keyCode:73,title:"Info",action:function(){n.addWindow({title:"Info",component:d,componentData:{},options:{scale:!1,prompt:!1,scrollX:!1,scrollY:!1}},{group:"workbench13Calculator"})}}]}]}},455:function(t,n,e){"use strict";e(363)},456:function(t,n,e){var l=e(42)(!1);l.push([t.i,"\n.wb-disks-workbench13-calculator-info {\n  min-width: 240px;\n  padding: calc(var(--default-element-margin) * 2);\n}\n",""]),t.exports=l},563:function(t,n,e){var content=e(855);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(43).default)("e45ddc36",content,!0,{sourceMap:!1})},854:function(t,n,e){"use strict";e(563)},855:function(t,n,e){var l=e(42)(!1);l.push([t.i,'\n:root {\n  --color__workbench13__calculator__background: #000;\n  --color__workbench13__calculator__button__text: #fff;\n  --color__workbench13__calculator__button__border: #fff;\n  --color__workbench13__calculator__result__border: #fff;\n}\n.wb-disks-workbench13-calculator {\n  padding: var(--default-element-margin);\n\n  /* padding-top: 5px; */\n\n  /* margin: -3px -2px; */\n  background: var(--color__workbench13__calculator__background);\n& .calculator__result {\n    display: block;\n    width: auto;\n    padding: 2px 4px;\n    padding-bottom: 0;\n    margin-right: 2px;\n    margin-bottom: 9px;\n    margin-left: 2px;\n    text-align: right;\n    border: solid var(--color__workbench13__calculator__result__border);\n    border-width: 2px 1px;\n&:empty {\n&::before {\n        display: inline-block;\n        content: "\\00a0";\n}\n}\n}\n& .calculator__buttons {\n    width: 180px;\n    clear: fix;\n& > span {\n      display: block;\n      float: left;\n      width: calc(100% / 5);\n      padding: 6px 5px;\n& input {\n        display: block;\n        width: 26px;\n        padding: 0 0;\n        padding-top: 2px;\n        padding-left: 1px;\n        line-height: 1;\n        color: var(--color__workbench13__calculator__button__text);\n        text-align: center;\n        background: transparent;\n        border: solid var(--color__workbench13__calculator__button__border) 1px;\n        border-top-width: 2px;\n        border-radius: 0;\n        outline: none;\n        appearance: none;\n}\n}\n}\n}\n',""]),t.exports=l},875:function(t,n,e){"use strict";e.r(n);var l=e(4),r=(e(31),e(116),e(37),e(77),e(39),e(249)),o=e(414),c=e(250),m={mixins:[r.a],data:function(){return{tmpValueA:null,tmpValueB:null,tmpOperator:null,result:null,value:null,buttons:["7","8","9","CA","CE","4","5","6","*","/","1","2","3","+","-","0",".","<-","+-","="]}},computed:{contextMenu:function(){return new c.a(o.default,{core:this.core,model:this})},resultValue:function(){return[this.tmpValueA,this.tmpOperator,this.tmpValueB].filter((function(t){return null!==t})).join(" ")}},methods:{onClickButton:function(t){var n=this;return Object(l.a)(regeneratorRuntime.mark((function e(){var l,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(l=t.target.value,/^[0-9,.]+$/.test(l)&&null===n.tmpOperator?n.tmpValueA=(n.tmpValueA||"")+l:/^[0-9,.]+$/.test(l)&&n.tmpOperator&&null!==n.tmpValueA&&(n.tmpValueB=(n.tmpValueB||"")+l),!/^[\\/*-+=]$/.test(l)||null===n.tmpValueA||null===n.tmpValueB||!n.tmpOperator){e.next=9;break}return e.next=5,n.core.modules.parser.parseMath("".concat(n.tmpValueA).concat(n.tmpOperator).concat(n.tmpValueB));case 5:r=e.sent,n.tmpValueA=r,n.tmpOperator=null,n.tmpValueB=null;case 9:/^[\\/*-+]$/.test(l)&&null!==n.tmpValueA&&null===n.tmpValueB&&(n.tmpOperator=l),/^<-$/.test(l)&&null!==n.tmpValueA&&(null!==n.tmpValueA&&null===n.tmpValueB?(n.tmpOperator=null,n.tmpValueA=String(n.tmpValueA).slice(0,n.tmpValueA.length-1)):null!==n.tmpValueA&&n.tmpOperator&&(n.tmpValueB=String(n.tmpValueB).slice(0,n.tmpValueB.length-1))),/^\+-$/.test(l)&&(null!==n.tmpValueA&&null===n.tmpValueB?n.tmpValueA=-1*parseFloat(n.tmpValueA):null!==n.tmpValueA&&n.tmpOperator&&(n.tmpValueB=-1*parseFloat(n.tmpValueB))),/^CA$/.test(l)&&(n.tmpOperator=n.tmpValueA=n.tmpValueB=null),/^CE$/.test(l)&&(null!==n.tmpValueB?n.tmpValueB=null:n.tmpOperator?n.tmpOperator=null:null!==n.tmpValueA&&(n.tmpValueA=null));case 14:case"end":return e.stop()}}),e)})))()}}},d=(e(854),e(44)),component=Object(d.a)(m,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"wb-disks-workbench13-calculator"},[e("span",{staticClass:"calculator__result",attrs:{"data-hook":"calculatorResult"}},[t._v(t._s(t.resultValue))]),t._v(" "),e("div",{staticClass:"calculator__buttons"},t._l(t.buttons,(function(button,n){return e("span",{key:n},[e("input",{attrs:{type:"button",value:button},on:{click:t.onClickButton}})])})),0)])}),[],!1,null,null,null);n.default=component.exports}}]);