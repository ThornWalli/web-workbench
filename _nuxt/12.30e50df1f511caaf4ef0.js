(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{313:function(e,t,o){var content=o(491);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(38).default)("1d971b72",content,!0,{sourceMap:!1})},314:function(e,t,o){var content=o(493);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(38).default)("3d02b33e",content,!0,{sourceMap:!1})},315:function(e,t,o){var content=o(495);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(38).default)("72429c1f",content,!0,{sourceMap:!1})},399:function(e,t,o){"use strict";o.r(t);o(30),o(11),o(23);var n=o(4),l=(o(168),o(257)),r=o(247),c=o(249),d={components:{AtomMarkdown:l.a},mixins:[r.a],data:function(){return{content:["# Cloud","Connect to a Firebase storage.  \n","Version: **1.0**  \nCreated by **Thorn-Welf Walli**"].join("\n")}},computed:{contextMenu:function(){return new c.a(S,{core:this.core})}}},m=(o(490),o(39)),f=Object(m.a)(d,(function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"wb-disks-workbench13-cloud-info"},[t("atom-markdown",{attrs:{content:this.content}})],1)}),[],!1,null,null,null).exports,w=o(258),h=o(260),x=o(264),v=o(273),y={components:{WbForm:w.a,WbButton:h.a,WbButtonWrapper:x.a,WbFormFieldTextbox:v.a},mixins:[r.a],props:{model:{type:Object,default:function(){return{id:null,apiKey:null,url:null}}}},data:function(){return{cancelLabel:"Cancel",applyLabel:"Connect",fields:{id:{label:"ID",name:"id",placeholder:"ID…"},apiKey:{label:"Api Key",name:"apiKey",placeholder:"Api Key…"},url:{label:"Url",name:"url",placeholder:"https://…"}}}},computed:{contextMenu:function(){return new c.a(S,{core:this.core,model:this.model})},disabledConnect:function(){return!this.model.id||!this.model.apiKey||!this.model.url}},methods:{onClickCancel:function(){this.$emit("close")},onSubmit:function(){this.disabledConnect||this.$emit("close",this.model)}}},C=(o(492),Object(m.a)(y,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"wb-module-files-cloud-connect"},[o("wb-form",{on:{submit:e.onSubmit}},[o("wb-form-field-textbox",e._b({attrs:{model:e.model}},"wb-form-field-textbox",e.fields.id,!1)),e._v(" "),o("wb-form-field-textbox",e._b({attrs:{model:e.model}},"wb-form-field-textbox",e.fields.apiKey,!1)),e._v(" "),o("wb-form-field-textbox",e._b({attrs:{model:e.model}},"wb-form-field-textbox",e.fields.url,!1)),e._v(" "),o("wb-button-wrapper",{attrs:{align:"outer",full:""}},[o("wb-button",{attrs:{"style-type":"primary",label:e.applyLabel,type:"submit",disabled:e.disabledConnect}})],1)],1)],1)}),[],!1,null,null,null).exports),k=(o(108),o(40),o(261)),_=o(327),W={components:{WbForm:w.a,WbButton:h.a,WbButtonWrapper:x.a,WbFormFieldTextbox:v.a,WbFormFieldDropdown:_.a},mixins:[r.a],props:{items:{type:Array,default:function(){return[]}},model:{type:Object,default:function(){return{email:null,password:null,storage:null}}}},data:function(){return{applyLabel:"Login",fields:{email:{type:"email",label:"Email",name:"email",placeholder:"Email…"},password:{type:"password",label:"Password",name:"password",placeholder:"Password…"},storage:{label:"Storage",name:"storage"}}}},computed:{contextMenu:function(){return new c.a(S,{core:this.core,model:this.model})},parsedItems:function(){return[{title:"Select Storage",value:null}].concat(Object(k.a)(this.items.map((function(e){return{title:e.name,value:e.id}}))))},disabledSubmit:function(){return!this.model.email||!this.model.password||!this.model.storage}},methods:{onClickCancel:function(){this.$emit("close")},onSubmit:function(){this.disabledSubmit||this.$emit("close",this.model)}}},K=(o(494),Object(m.a)(W,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"wb-module-files-cloud-connect"},[o("wb-form",{on:{submit:e.onSubmit}},[o("wb-form-field-dropdown",e._b({attrs:{model:e.model,options:e.parsedItems}},"wb-form-field-dropdown",e.fields.storage,!1)),e._v(" "),o("wb-form-field-textbox",e._b({attrs:{model:e.model}},"wb-form-field-textbox",e.fields.email,!1)),e._v(" "),o("wb-form-field-textbox",e._b({attrs:{model:e.model}},"wb-form-field-textbox",e.fields.password,!1)),e._v(" "),o("wb-button-wrapper",{attrs:{align:"outer",full:""}},[o("wb-button",{attrs:{"style-type":"primary",label:e.applyLabel,type:"submit",disabled:e.disabledSubmit}})],1)],1)],1)}),[],!1,null,null,null).exports),S=t.default=function(e){var t=e.core,o=e.model;return[{title:"Cloud",items:[{title:"Connect with…",action:L(t,o)},{title:"Login with…",action:F(t,o)},{separator:!0},{hotKey:"I",keyCode:73,title:"Info",action:j(t)}]}]};function j(e){return function(){e.modules.windows.addWindow({title:"Info",component:f,componentData:{},options:{scale:!1,prompt:!1,scrollX:!1,scrollY:!1}},{group:"workbench13Cloud"})}}function F(e,t){return function(){var o=e.modules.windows.addWindow({title:"Login with",component:K,componentData:{items:t.items},options:{scale:!1,prompt:!1,scrollX:!1,scrollY:!1}},{group:"workbench13Cloud"});return new Promise((function(e){o.events.subscribe(function(){var o=Object(n.a)(regeneratorRuntime.mark((function o(n){var l,r,c,d,m;return regeneratorRuntime.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:if(l=n.name,r=n.value,"close"!==l){o.next=14;break}if(!r){o.next=13;break}return c=r.email,d=r.password,m=r.storage,o.prev=4,o.next=7,t.actions.login(c,d,m);case 7:o.next=13;break;case 9:o.prev=9,o.t0=o.catch(4),alert(o.t0);case 13:e();case 14:case"end":return o.stop()}}),o,null,[[4,9]])})));return function(e){return o.apply(this,arguments)}}())}))}}function L(e,t){return function(){var o=e.modules.windows.addWindow({title:"Connect with",component:C,componentData:{model:{id:null,apiKey:null,url:null}},options:{scale:!1,prompt:!1,scrollX:!1,scrollY:!1}},{group:"workbench13Cloud"});return new Promise((function(e){o.events.subscribe(function(){var o=Object(n.a)(regeneratorRuntime.mark((function o(n){var l,r,c,d,m;return regeneratorRuntime.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:if(l=n.name,r=n.value,"close"!==l){o.next=7;break}if(!r){o.next=6;break}return c=r.id,d=r.url,m=r.apiKey,o.next=6,t.actions.connect(c,m,d);case 6:e();case 7:case"end":return o.stop()}}),o)})));return function(e){return o.apply(this,arguments)}}())}))}}},490:function(e,t,o){"use strict";var n=o(313);o.n(n).a},491:function(e,t,o){(t=o(37)(!1)).push([e.i,".wb-disks-workbench13-cloud-info{min-width:240px;padding:calc(var(--default-element-margin)*2)}",""]),e.exports=t},492:function(e,t,o){"use strict";var n=o(314);o.n(n).a},493:function(e,t,o){(t=o(37)(!1)).push([e.i,".wb-module-files-cloud-connect{width:380px}",""]),e.exports=t},494:function(e,t,o){"use strict";var n=o(315);o.n(n).a},495:function(e,t,o){(t=o(37)(!1)).push([e.i,".wb-module-files-cloud-connect{width:380px}",""]),e.exports=t}}]);