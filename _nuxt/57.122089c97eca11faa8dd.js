(window.webpackJsonp=window.webpackJsonp||[]).push([[57,21],{127:function(e,t,n){var content=n(158);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(6).default)("21eb7d2c",content,!0,{sourceMap:!1})},134:function(e,t,n){"use strict";(function(e){var o=n(449),l=n(654),r=n(484),c=n(137),d=n(85),h=n(104);t.a={props:{rootElement:{type:HTMLElement,default:()=>null},options:{type:Object,default:()=>({focused:!1})},readonly:{type:Boolean,required:!1,default:!1},multiline:{type:Boolean,required:!1,default:!0},name:{type:String,default:"value"},model:{type:Object,required:!1,default:()=>({value:"Input Value"})}},data:()=>({escapeHtml:c.a,selectionLength:null,selectionStart:null,selectionEnd:null,controlShiftActive:!1,controlCapsLockActive:!1,focusedSubscriptions:[],refreshFrame:null}),computed:{focused(){return this.options.focused},value:{get(){return this.model[this.name]},set(e){this.model[this.name]=e}},styleClasses(){return{"js--readonly":this.readonly,"js--multiline":this.multiline,"js--selection-empty":!this.selectionLength,"js--focused":this.focused,"js--shift-active":this.controlShiftActive,"js--caps-lock-active":this.controlCapsLockActive}}},watch:{focused(e){e?(this.focusedSubscriptions.push(d.a.get("click").pipe(Object(o.a)((e=>{var{target:t}=e;return!Object(h.a)(t,this.rootElement||this.$parent.$el)})),Object(l.a)()).subscribe(this.blur.bind(this)),d.a.get("keypress").subscribe(function(){this.$refs.input.focus()}.bind(this)),d.a.get("keydown").subscribe((e=>{var{keyCode:t}=e;switch(t){case 16:this.controlShiftActive=!0;break;case 20:this.controlCapsLockActive=!this.controlCapsLockActive}})),d.a.get("keyup").subscribe((e=>{var{keyCode:t}=e;switch(t){case 16:this.controlShiftActive=!1}this.$emit("keyup",t)}))),this.$refs.input.focus()):(this.focusedSubscriptions.forEach((e=>e.unsubscribe())),this.focusedSubscriptions=[],this.$refs.input.blur())}},destroyed(){e.cancelAnimationFrame(this.refreshFrame),this.focusedSubscriptions.forEach((e=>e.unsubscribe()))},mounted(){this.$refs.input.setSelectionRange(this.value.length,this.value.length),this.refresh(),this.focused&&this.$refs.input.focus()},methods:{focus(){this.setFocus(!0)},blur(){this.setFocus(!1)},resetSelection(){var input=this.$refs.input;this.selectionStart=input.selectionStart=0,this.selectionEnd=input.selectionEnd=0,this.selectionLength=0},refresh(){var input=this.$refs.input;this.selectionStart=input.selectionStart,this.selectionEnd=input.selectionEnd,this.selectionLength=this.selectionEnd-this.selectionStart,this.$emit("refresh")},setFocus(e){this.options.focused=e},onPointerDown(e){var t=d.a.pointerMove.pipe(Object(r.a)(128)).subscribe((e=>{Object(h.d)(e),this.refresh()}));d.a.pointerUp.pipe(Object(l.a)()).subscribe((e=>{Object(h.d)(e),t.unsubscribe()}))},onInput(){this.refresh(),this.$emit("input")},onClick(){this.focused?this.refresh():this.setFocus(!0)},onKeydown(e){this.multiline||13!==e.keyCode?(this.$emit("keydown",e),this.refresh()):(e.preventDefault(),e.stopPropagation(),this.$emit("enter",this.model[this.name]),this.refresh())},onKeyup(e){this.$emit("keyup",e.keyCode),this.refresh()}}}}).call(this,n(8))},141:function(e,t,n){"use strict";n.r(t);var o=n(95),l=n(96),r=n(87),c=n(78),d=n(81),h={components:{AtomMarkdown:r.a},mixins:[c.a],props:{model:{type:Object,default:()=>({value:Object(l.getBasicDefaultModelValue)()})}},data:()=>({content:["# WebBasic","Version: **1.0**  \nCreated by **Thorn-Welf Walli**"].join("\n")}),computed:{contextMenu(){return new d.a(x,{core:this.core,model:this.model})}}},f=(n(157),n(7)),m=Object(f.a)(h,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wb-disks-extras13-web-basic-info"},[n("atom-markdown",{attrs:{content:e.content}})],1)}),[],!1,null,null,null).exports,v=n(93);function _(e,t,n,o,l,r,c){try{var d=e[r](c),h=d.value}catch(e){return void n(e)}d.done?t(h):Promise.resolve(h).then(o,l)}function y(e){return function(){var t=this,n=arguments;return new Promise((function(o,l){var r=e.apply(t,n);function c(e){_(r,o,l,c,d,"next",e)}function d(e){_(r,o,l,c,d,"throw",e)}c(void 0)}))}}var x=t.default=e=>{var{model:t,core:n}=e,{windows:r}=n.modules;return[{order:0,title:"Editor",items:[{title:"New",hotKey:"N",keyCode:78,action:function(){t.reset()}},{title:"Open…",hotKey:"O",keyCode:79,action:function(){return h.apply(this,arguments)}},{title:"Save",hotKey:"S",keyCode:83,action:function(){return c()}},{title:"Save As…",action:function(){return c(!0)}},{separator:!0},{hotKey:"I",keyCode:73,title:"Info",action:function(){r.addWindow({title:"Info",component:m,componentData:{model:t},options:{scale:!1,scrollX:!1,scrollY:!1}},{group:"extras13WebBasic"})}},{title:"Close",action:function(){return t.actions.close()}}]},{order:1,title:"Document Settings",items:[{title:"Has Window Output",type:v.a.CHECKBOX,name:l.PROPERTY.HAS_WINDOW_OUTPUT,model:t.value}]},{order:1,title:"Run",hotKey:"R",keyCode:82,action:function(){return f.apply(this,arguments)}},{order:2,title:"Preview",type:v.a.CHECKBOX,name:l.CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW,model:n.config.observable,action:e=>n.config.set(l.CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW,e)}];function c(){return d.apply(this,arguments)}function d(){return(d=y((function*(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],l=Object.assign({},t.value,{content:t.value.content.split(/\n/g)});return l=yield Object(o.b)(JSON.stringify(l)),!e&&t.fsItem?(yield n.executeCommand('editfile "'.concat(t.fsItem.getPath(),'" --data="').concat(l,'"')))?n.executeCommand('openDialog "File saved."'):n.executeCommand('openDialog "File could not be saved."'):(t.fsItem=yield n.executeCommand('saveFileDialog --data="'.concat(l,'" --extension="bs"')),t.fsItem)}))).apply(this,arguments)}function h(){return(h=y((function*(){var data=yield n.executeCommand("openFileDialog");if(data){if(!(l.PROPERTY.CONTENT in data.value))throw new Error("Can't read file content");var e=Object.assign({},data.value,{[l.PROPERTY.CONTENT]:[].concat(data.value[l.PROPERTY.CONTENT]).join("\n")});t.fsItem=data.fsItem,t.openValue=e}}))).apply(this,arguments)}function f(){return(f=y((function*(){var e=[];yield n.modules.parser.parseBasic(t.value[l.PROPERTY.CONTENT].split(/\n/),function(){var t=y((function*(t,o){var l=yield n.executeCommand(t,o);return o.message&&e.push(o.message),l}));return function(e,n){return t.apply(this,arguments)}}()),t.output=e.map((line=>Object(o.c)(line)))}))).apply(this,arguments)}}},155:function(e,t,n){var content=n(221);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(6).default)("0665a08e",content,!0,{sourceMap:!1})},157:function(e,t,n){"use strict";n(127)},158:function(e,t,n){var o=n(5)(!1);o.push([e.i,"\n.wb-disks-extras13-web-basic-info {\n  min-width: 240px;\n  padding: calc(var(--default-element-margin) * 2);\n}\n",""]),e.exports=o},191:function(e,t,n){"use strict";var o=n(134).a,l=(n(220),n(7)),component=Object(l.a)(o,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wb-env-atom-input-text",class:e.styleClasses},[n("div",[n("div",{staticClass:"input-text__result"},[e.value.length>0&&e.selectionEnd>0?[e.selectionStart>=0&&e.selectionEnd===e.value.length?[n("span",{domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(0,e.selectionStart)))}}),e._v(" "),n("span",{staticClass:"input-text__selected",domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(e.selectionStart,e.selectionEnd+1))||"&nbsp;")}})]:e.selectionStart&&e.selectionStart===e.selectionEnd?[n("span",{domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(0,e.selectionStart)))}}),e._v(" "),n("span",{staticClass:"input-text__selected",domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(e.selectionStart,e.selectionStart+1))||"&nbsp;")}}),e._v(" "),n("span",{domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(e.selectionStart+1,e.value.length)))}})]:[n("span",{domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(0,e.selectionStart)))}}),e._v(" "),n("span",{staticClass:"input-text__selected",domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(e.selectionStart,e.selectionEnd)))}}),e._v(" "),n("span",{domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(e.selectionEnd,e.value.length)))}})]]:e._e(),e._v(" "),e.selectionStart||""!==e.value?e.value.length>0&&!e.selectionStart&&e.selectionStart===e.selectionEnd?[n("span",{staticClass:"input-text__selected",domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(0,1)))}}),e._v(" "),n("span",{domProps:{innerHTML:e._s(e.escapeHtml(e.value.slice(1,e.value.length)))}})]:e._e():n("span",{staticClass:"input-text__selected 5"},[e._v(" ")])],2),e._v(" "),n("div",{staticClass:"input-text__input"},[e.multiline?n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.value,expression:"value"}],ref:"input",attrs:{readonly:e.readonly},domProps:{value:e.value},on:{pointerdown:e.onPointerDown,input:[function(t){t.target.composing||(e.value=t.target.value)},e.onInput],click:e.onClick,keydown:e.onKeydown,keyup:e.onKeyup,focus:e.onClick}}):e._e(),e._v(" "),e.multiline?e._e():n("input",{directives:[{name:"model",rawName:"v-model",value:e.value,expression:"value"}],ref:"input",attrs:{type:"text",readonly:e.readonly},domProps:{value:e.value},on:{pointerdown:e.onPointerDown,input:[function(t){t.target.composing||(e.value=t.target.value)},e.onInput],click:e.onClick,keydown:e.onKeydown,keyup:e.onKeyup,focus:e.onClick}})])])])}),[],!1,null,null,null);t.a=component.exports},220:function(e,t,n){"use strict";n(155)},221:function(e,t,n){var o=n(5)(!1);o.push([e.i,'\n:root {\n  --color__inputText__selected: #05a;\n  --color__inputText__pointer: #fa5;\n}\n.wb-env-atom-input-text {\n  min-width: 120px;\n  padding-top: 1px;\n& > div {\n    position: relative;\n    min-height: 18px;\n}\n& * {\n    font-family: var(--workbenchFont_topaz_console);\n}\n& .input-text__result {\n    font-size: 0;\n& > span {\n      padding-top: 1px;\n      font-size: initial;\n}\n}\n&:not(.js--selection-empty) {\n& .input-text__selected {\n      display: inline;\n      background: var(--color__inputText__selected);\n      filter: var(--filter__default);\n}\n}\n& .input-text__input {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    overflow: visible;\n& textarea,\n    & input[type="text"] {\n      width: 100%;\n      height: 100%;\n      padding: 0;\n      overflow: visible;\n      line-height: 18px;\n      color: black;\n      resize: none;\n      border: 0;\n      outline: none;\n      opacity: 0;\n      appearance: none;\n}\n}\n&.js--multiline {\n& .input-text__result {\n      overflow: visible;\n      white-space: pre;\n}\n& .input-text__input {\n& textarea {\n        white-space: pre;\n}\n}\n}\n\n  /* &.js--full {\n    & .input-text__input {\n      padding-bottom: calc(18px * 2);\n\n      & textarea {\n        width: calc(100% + 30px);\n        height: calc(100% + 18px * 2);\n        padding-right: 30px;\n        overflow-y: scroll;\n      }\n    }\n  } */\n&:not(.js--readonly) {\n&.js--selection-empty {\n& .input-text__selected {\n        position: relative;\n&::before {\n          position: absolute;\n          top: 0;\n          bottom: 0;\n          left: 0;\n          display: inline-block;\n          width: 100%;\n          min-width: 8px;\n          content: "";\n          background: var(--color__inputText__pointer);\n          animation-name: editor_cursor_blinking;\n          animation-duration: 1200ms;\n          animation-play-state: paused;\n          animation-timing-function: linear;\n          animation-iteration-count: infinite;\n@nest .js--scaling &, .js--moving & {\n            display: none !important;\n}\n}\n}\n}\n&.js--focused,\n    &.js--focused.js--selection-empty {\n& .input-text__selected {\n&::before {\n          display: inline-block;\n          animation-play-state: running;\n}\n}\n}\n}\n}\n@keyframes editor_cursor_blinking {\n0% {\n    visibility: visible;\n}\n50% {\n    visibility: hidden;\n}\n100% {\n    visibility: hidden;\n}\n}\n',""]),e.exports=o},323:function(e,t,n){var content=n(564);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(6).default)("3e594717",content,!0,{sourceMap:!1})},484:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var o=n(83),l=n(92),r=n(138);function c(e,t){return void 0===t&&(t=r.a),function(source){return source.lift(new d(e,t))}}var d=function(){function e(e,t){this.dueTime=e,this.scheduler=t}return e.prototype.call=function(e,source){return source.subscribe(new h(e,this.dueTime,this.scheduler))},e}(),h=function(e){function t(t,n,o){var l=e.call(this,t)||this;return l.dueTime=n,l.scheduler=o,l.debouncedSubscription=null,l.lastValue=null,l.hasValue=!1,l}return o.a(t,e),t.prototype._next=function(e){this.clearDebounce(),this.lastValue=e,this.hasValue=!0,this.add(this.debouncedSubscription=this.scheduler.schedule(f,this.dueTime,this))},t.prototype._complete=function(){this.debouncedNext(),this.destination.complete()},t.prototype.debouncedNext=function(){if(this.clearDebounce(),this.hasValue){var e=this.lastValue;this.lastValue=null,this.hasValue=!1,this.destination.next(e)}},t.prototype.clearDebounce=function(){var e=this.debouncedSubscription;null!==e&&(this.remove(e),e.unsubscribe(),this.debouncedSubscription=null)},t}(l.a);function f(e){e.debouncedNext()}},563:function(e,t,n){"use strict";n(323)},564:function(e,t,n){var o=n(5)(!1);o.push([e.i,"\n.wb-disks-extras13-web-basic {\n  /* empty */\n}\n",""]),e.exports=o},629:function(e,t,n){"use strict";n.r(t);var o=n(96),l=n(191),r=n(78),c=n(141),d=n(81),h={components:{AtomInputText:l.a},mixins:[r.a],props:{model:{type:Object,default:()=>({value:Object(o.getBasicDefaultModelValue)(),fsItem:null,openValue:null})},core:{type:Object,required:!0}},computed:{openValue(){return this.model.openValue},contextMenu(){return new d.a(c.default,{core:this.core,model:this.model})},inputTextOptions(){return{focused:this.parentFocused}},showPreview(){return this.core.config.observable[o.CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW]}},watch:{"model.value"(){this.refresh()},openValue(e){e&&(this.model.value=e,this.$nextTick((()=>{this.$refs.input.resetSelection(),this.$emit("refresh",{scroll:!0})})))},showPreview(e){this.model.actions.togglePreview(e)}},mounted(){this.showPreview&&this.model.actions.togglePreview()},methods:{onRefreshInputText(){this.refresh()},refresh(){this.$nextTick((()=>{this.$emit("refresh",{scroll:!0})}))}}},f=(n(563),n(7)),component=Object(f.a)(h,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wb-disks-extras13-web-basic"},[n("atom-input-text",{ref:"input",attrs:{name:"content",options:e.inputTextOptions,model:e.model.value},on:{refresh:e.onRefreshInputText}})],1)}),[],!1,null,null,null);t.default=component.exports}}]);