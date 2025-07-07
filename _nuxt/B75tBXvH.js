import{g as e,D as t,a as n,X as r,C as i,Y as o,Z as s,G as a,$ as l,H as h,I as c,J as u,_ as d,a0 as p,a1 as _,L as m,O as f,a2 as y,o as g,Q as v,a3 as C,a4 as w,A as T,a5 as P,a6 as S,a7 as E,a8 as I,R as N,T as b,a9 as k,aa as R,ab as x,d as A,ac as F,ad as O,ae as L,af as D,S as M,e as W,r as q}from"./BShb_aPv.js";var Q={};const G="@firebase/database",U="1.0.20";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let V="";function setSDKVersion(e){V=e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DOMStorageWrapper{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){null==t?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),_(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return null==t?null:P(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MemoryStorage{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){null==t?delete this.cache_[e]:this.cache_[e]=t}get(e){return C(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const createStoragefor=function(e){try{if("undefined"!=typeof window&&void 0!==window[e]){const t=window[e];return t.setItem("firebase:sentinel","cache"),t.removeItem("firebase:sentinel"),new DOMStorageWrapper(t)}}catch(t){}return new MemoryStorage},B=createStoragefor("localStorage"),H=createStoragefor("sessionStorage"),j=new m("@firebase/database"),K=function(){let e=1;return function(){return e++}}(),sha1=function(e){const t=R(e),n=new x;n.update(t);const r=n.digest();return A.encodeByteArray(r)},buildLogMessage_=function(...e){let t="";for(let n=0;n<e.length;n++){const r=e[n];Array.isArray(r)||r&&"object"==typeof r&&"number"==typeof r.length?t+=buildLogMessage_.apply(null,r):t+="object"==typeof r?_(r):r,t+=" "}return t};let z=null,Y=!0;const enableLogging$1=function(e,t){r(!t||!0===e||!1===e,"Can't turn on custom loggers persistently."),!0===e?(j.logLevel=v.VERBOSE,z=j.log.bind(j),t&&H.set("logging_enabled",!0)):"function"==typeof e?z=e:(z=null,H.remove("logging_enabled"))},log=function(...e){if(!0===Y&&(Y=!1,null===z&&!0===H.get("logging_enabled")&&enableLogging$1(!0)),z){const t=buildLogMessage_.apply(null,e);z(t)}},logWrapper=function(e){return function(...t){log(e,...t)}},error=function(...e){const t="FIREBASE INTERNAL ERROR: "+buildLogMessage_(...e);j.error(t)},fatal=function(...e){const t=`FIREBASE FATAL ERROR: ${buildLogMessage_(...e)}`;throw j.error(t),new Error(t)},warn=function(...e){const t="FIREBASE WARNING: "+buildLogMessage_(...e);j.warn(t)},isInvalidJSONNumber=function(e){return"number"==typeof e&&(e!=e||e===Number.POSITIVE_INFINITY||e===Number.NEGATIVE_INFINITY)},$="[MIN_NAME]",J="[MAX_NAME]",nameCompare=function(e,t){if(e===t)return 0;if(e===$||t===J)return-1;if(t===$||e===J)return 1;{const n=tryParseInt(e),r=tryParseInt(t);return null!==n?null!==r?n-r===0?e.length-t.length:n-r:-1:null!==r?1:e<t?-1:1}},stringCompare=function(e,t){return e===t?0:e<t?-1:1},requireKey=function(e,t){if(t&&e in t)return t[e];throw new Error("Missing required key ("+e+") in object: "+_(t))},ObjectToUniqueKey=function(e){if("object"!=typeof e||null===e)return _(e);const t=[];for(const r in e)t.push(r);t.sort();let n="{";for(let r=0;r<t.length;r++)0!==r&&(n+=","),n+=_(t[r]),n+=":",n+=ObjectToUniqueKey(e[t[r]]);return n+="}",n},splitStringBySize=function(e,t){const n=e.length;if(n<=t)return[e];const r=[];for(let i=0;i<n;i+=t)i+t>n?r.push(e.substring(i,n)):r.push(e.substring(i,i+t));return r};function each(e,t){for(const n in e)e.hasOwnProperty(n)&&t(n,e[n])}const doubleToIEEE754String=function(e){r(!isInvalidJSONNumber(e),"Invalid JSON number");const t=1023;let n,i,o,s,a;0===e?(i=0,o=0,n=1/e==-1/0?1:0):(n=e<0,(e=Math.abs(e))>=Math.pow(2,-1022)?(s=Math.min(Math.floor(Math.log(e)/Math.LN2),t),i=s+t,o=Math.round(e*Math.pow(2,52-s)-Math.pow(2,52))):(i=0,o=Math.round(e/Math.pow(2,-1074))));const l=[];for(a=52;a;a-=1)l.push(o%2?1:0),o=Math.floor(o/2);for(a=11;a;a-=1)l.push(i%2?1:0),i=Math.floor(i/2);l.push(n?1:0),l.reverse();const h=l.join("");let c="";for(a=0;a<64;a+=8){let e=parseInt(h.substr(a,8),2).toString(16);1===e.length&&(e="0"+e),c+=e}return c.toLowerCase()};const X=new RegExp("^-?(0*)\\d{1,10}$"),tryParseInt=function(e){if(X.test(e)){const t=Number(e);if(t>=-2147483648&&t<=2147483647)return t}return null},exceptionGuard=function(e){try{e()}catch(t){setTimeout(()=>{const e=t.stack||"";throw warn("Exception was thrown by user callback.",e),t},Math.floor(0))}},setTimeoutNonBlocking=function(e,t){const n=setTimeout(e,t);return"number"==typeof n&&"undefined"!=typeof Deno&&Deno.unrefTimer?Deno.unrefTimer(n):"object"==typeof n&&n.unref&&n.unref(),n};
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class AppCheckTokenProvider{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,g(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=null==t?void 0:t.getImmediate({optional:!0}),this.appCheck||null==t||t.get().then(e=>this.appCheck=e)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,n)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,n):t(null)},0)})}addTokenChangeListener(e){var t;null===(t=this.appCheckProvider)||void 0===t||t.get().then(t=>t.addTokenListener(e))}notifyForInvalidToken(){warn(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FirebaseAuthTokenProvider{constructor(e,t,n){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=n,this.auth_=null,this.auth_=n.getImmediate({optional:!0}),this.auth_||n.onInit(e=>this.auth_=e)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(e=>e&&"auth/token-not-initialized"===e.code?(log("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(e)):new Promise((t,n)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,n):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',warn(e)}}class EmulatorTokenProvider{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}EmulatorTokenProvider.OWNER="owner";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Z=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,ee="ac",te="websocket",ne="long_polling";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class RepoInfo{constructor(e,t,n,r,i=!1,o="",s=!1,a=!1,l=null){this.secure=t,this.namespace=n,this.webSocketOnly=r,this.nodeAdmin=i,this.persistenceKey=o,this.includeNamespaceInQueryParams=s,this.isUsingEmulator=a,this.emulatorOptions=l,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=B.get("host:"+e)||this._host}isCacheableHost(){return"s-"===this.internalHost.substr(0,2)}isCustomHost(){return"firebaseio.com"!==this._domain&&"firebaseio-demo.com"!==this._domain}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&B.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function repoInfoConnectionURL(e,t,n){let i;if(r("string"==typeof t,"typeof type must == string"),r("object"==typeof n,"typeof params must == object"),t===te)i=(e.secure?"wss://":"ws://")+e.internalHost+"/.ws?";else{if(t!==ne)throw new Error("Unknown connection type: "+t);i=(e.secure?"https://":"http://")+e.internalHost+"/.lp?"}(function repoInfoNeedsQueryParam(e){return e.host!==e.internalHost||e.isCustomHost()||e.includeNamespaceInQueryParams})(e)&&(n.ns=e.namespace);const o=[];return each(n,(e,t)=>{o.push(e+"="+t)}),i+o.join("&")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class StatsCollection{constructor(){this.counters_={}}incrementCounter(e,t=1){C(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return F(this.counters_)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const re={},ie={};function statsManagerGetCollection(e){const t=e.toString();return re[t]||(re[t]=new StatsCollection),re[t]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PacketReceiver{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const e=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let t=0;t<e.length;++t)e[t]&&exceptionGuard(()=>{this.onMessage_(e[t])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oe="start";class BrowserPollConnection{constructor(e,t,n,r,i,o,s){this.connId=e,this.repoInfo=t,this.applicationId=n,this.appCheckToken=r,this.authToken=i,this.transportSessionId=o,this.lastSessionId=s,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=logWrapper(e),this.stats_=statsManagerGetCollection(t),this.urlFn=e=>(this.appCheckToken&&(e[ee]=this.appCheckToken),repoInfoConnectionURL(t,ne,e))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new PacketReceiver(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(3e4)),function(e){if("complete"===document.readyState)e();else{let t=!1;const wrappedFn=function(){document.body?t||(t=!0,e()):setTimeout(wrappedFn,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",wrappedFn,!1),window.addEventListener("load",wrappedFn,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{"complete"===document.readyState&&wrappedFn()}),window.attachEvent("onload",wrappedFn))}}(()=>{if(this.isClosed_)return;this.scriptTagHolder=new FirebaseIFrameScriptHolder((...e)=>{const[t,n,r,i,o]=e;if(this.incrementIncomingBytes_(e),this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,t===oe)this.id=n,this.password=r;else{if("close"!==t)throw new Error("Unrecognized command received: "+t);n?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(n,()=>{this.onClosed_()})):this.onClosed_()}},(...e)=>{const[t,n]=e;this.incrementIncomingBytes_(e),this.myPacketOrderer.handleResponse(t,n)},()=>{this.onClosed_()},this.urlFn);const e={};e[oe]="t",e.ser=Math.floor(1e8*Math.random()),this.scriptTagHolder.uniqueCallbackIdentifier&&(e.cb=this.scriptTagHolder.uniqueCallbackIdentifier),e.v="5",this.transportSessionId&&(e.s=this.transportSessionId),this.lastSessionId&&(e.ls=this.lastSessionId),this.applicationId&&(e.p=this.applicationId),this.appCheckToken&&(e[ee]=this.appCheckToken),"undefined"!=typeof location&&location.hostname&&Z.test(location.hostname)&&(e.r="f");const t=this.urlFn(e);this.log_("Connecting via long-poll to "+t),this.scriptTagHolder.addTag(t,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){BrowserPollConnection.forceAllow_=!0}static forceDisallow(){BrowserPollConnection.forceDisallow_=!0}static isAvailable(){return!!BrowserPollConnection.forceAllow_||!(BrowserPollConnection.forceDisallow_||"undefined"==typeof document||null==document.createElement||"object"==typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href)||"object"==typeof Windows&&"object"==typeof Windows.UI)}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=_(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=O(t),r=splitStringBySize(n,1840);for(let i=0;i<r.length;i++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,r.length,r[i]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const n={dframe:"t"};n.id=e,n.pw=t,this.myDisconnFrame.src=this.urlFn(n),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=_(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class FirebaseIFrameScriptHolder{constructor(e,t,n,r){this.onDisconnect=n,this.urlFn=r,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(1e8*Math.random()),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=K(),window["pLPCommand"+this.uniqueCallbackIdentifier]=e,window["pRTLPCB"+this.uniqueCallbackIdentifier]=t,this.myIFrame=FirebaseIFrameScriptHolder.createIFrame_();let n="";if(this.myIFrame.src&&"javascript:"===this.myIFrame.src.substr(0,11)){n='<script>document.domain="'+document.domain+'";<\/script>'}const r="<html><body>"+n+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(r),this.myIFrame.doc.close()}catch(i){log("frame writing exception"),i.stack&&log(i.stack),log(i)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",!document.body)throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";document.body.appendChild(e);try{e.contentWindow.document||log("No IE domain setting required")}catch(t){const n=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+n+"';document.close();})())"}return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{null!==this.myIFrame&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e.id=this.myID,e.pw=this.myPW,e.ser=this.currentSerial;let t=this.urlFn(e),n="",r=0;for(;this.pendingSegs.length>0;){if(!(this.pendingSegs[0].d.length+30+n.length<=1870))break;{const e=this.pendingSegs.shift();n=n+"&seg"+r+"="+e.seg+"&ts"+r+"="+e.ts+"&d"+r+"="+e.d,r++}}return t+=n,this.addLongPollTag_(t,this.currentSerial),!0}return!1}enqueueSegment(e,t,n){this.pendingSegs.push({seg:e,ts:t,d:n}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const doNewRequest=()=>{this.outstandingRequests.delete(t),this.newRequest_()},n=setTimeout(doNewRequest,Math.floor(25e3));this.addTag(e,()=>{clearTimeout(n),doNewRequest()})}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const n=this.myIFrame.doc.createElement("script");n.type="text/javascript",n.async=!0,n.src=e,n.onload=n.onreadystatechange=function(){const e=n.readyState;e&&"loaded"!==e&&"complete"!==e||(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),t())},n.onerror=()=>{log("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(n)}catch(n){}},Math.floor(1))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let se=null;"undefined"!=typeof MozWebSocket?se=MozWebSocket:"undefined"!=typeof WebSocket&&(se=WebSocket);class WebSocketConnection{constructor(e,t,n,r,i,o,s){this.connId=e,this.applicationId=n,this.appCheckToken=r,this.authToken=i,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=logWrapper(this.connId),this.stats_=statsManagerGetCollection(t),this.connURL=WebSocketConnection.connectionURL_(t,o,s,r,n),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,n,r,i){const o={v:"5"};return"undefined"!=typeof location&&location.hostname&&Z.test(location.hostname)&&(o.r="f"),t&&(o.s=t),n&&(o.ls=n),r&&(o[ee]=r),i&&(o.p=i),repoInfoConnectionURL(e,te,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,B.set("previous_websocket_failure",!0);try{let e;L(),this.mySock=new se(this.connURL,[],e)}catch(n){this.log_("Error instantiating WebSocket.");const e=n.message||n.data;return e&&this.log_(e),void this.onClosed_()}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=e=>{this.handleIncomingFrame(e)},this.mySock.onerror=e=>{this.log_("WebSocket error.  Closing connection.");const t=e.message||e.data;t&&this.log_(t),this.onClosed_()}}start(){}static forceDisallow(){WebSocketConnection.forceDisallow_=!0}static isAvailable(){let e=!1;if("undefined"!=typeof navigator&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,n=navigator.userAgent.match(t);n&&n.length>1&&parseFloat(n[1])<4.4&&(e=!0)}return!e&&null!==se&&!WebSocketConnection.forceDisallow_}static previouslyFailed(){return B.isInMemoryStorage||!0===B.get("previous_websocket_failure")}markConnectionHealthy(){B.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const e=this.frames.join("");this.frames=null;const t=P(e);this.onMessage(t)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(r(null===this.frames,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(null===this.mySock)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),null!==this.frames)this.appendFrame_(t);else{const e=this.extractFrameCount_(t);null!==e&&this.appendFrame_(e)}}send(e){this.resetKeepAlive();const t=_(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=splitStringBySize(t,16384);n.length>1&&this.sendString_(String(n.length));for(let r=0;r<n.length;r++)this.sendString_(n[r])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(45e3))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}WebSocketConnection.responsesRequiredToBeHealthy=2,WebSocketConnection.healthyTimeout=3e4;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class TransportManager{static get ALL_TRANSPORTS(){return[BrowserPollConnection,WebSocketConnection]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=WebSocketConnection&&WebSocketConnection.isAvailable();let n=t&&!WebSocketConnection.previouslyFailed();if(e.webSocketOnly&&(t||warn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),n=!0),n)this.transports_=[WebSocketConnection];else{const e=this.transports_=[];for(const t of TransportManager.ALL_TRANSPORTS)t&&t.isAvailable()&&e.push(t);TransportManager.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}TransportManager.globalTransportInitialized_=!1;class Connection{constructor(e,t,n,r,i,o,s,a,l,h){this.id=e,this.repoInfo_=t,this.applicationId_=n,this.appCheckToken_=r,this.authToken_=i,this.onMessage_=o,this.onReady_=s,this.onDisconnect_=a,this.onKill_=l,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=logWrapper("c:"+this.id+":"),this.transportManager_=new TransportManager(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),n=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,n)},Math.floor(0));const r=e.healthyTimeout||0;r>0&&(this.healthyTimeout_=setTimeoutNonBlocking(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>102400?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>10240?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(r)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{2!==this.state_&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if("t"in e){const t=e.t;"a"===t?this.upgradeIfSecondaryHealthy_():"r"===t?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),this.tx_!==this.secondaryConn_&&this.rx_!==this.secondaryConn_||this.close()):"o"===t&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=requireKey("t",e),n=requireKey("d",e);if("c"===t)this.onSecondaryControl_(n);else{if("d"!==t)throw new Error("Unknown protocol layer: "+t);this.pendingDataMessages.push(n)}}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:"p",d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:"a",d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:"n",d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=requireKey("t",e),n=requireKey("d",e);"c"===t?this.onControl_(n):"d"===t&&this.onDataMessage_(n)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=requireKey("t",e);if("d"in e){const n=e.d;if("h"===t){const e=Object.assign({},n);this.repoInfo_.isUsingEmulator&&(e.h=this.repoInfo_.host),this.onHandshake_(e)}else if("n"===t){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let e=0;e<this.pendingDataMessages.length;++e)this.onDataMessage_(this.pendingDataMessages[e]);this.pendingDataMessages=[],this.tryCleanupConnection()}else"s"===t?this.onConnectionShutdown_(n):"r"===t?this.onReset_(n):"e"===t?error("Server Error: "+n):"o"===t?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):error("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,n=e.v,r=e.h;this.sessionId=e.s,this.repoInfo_.host=r,0===this.state_&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),"5"!==n&&warn("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),n=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,n),setTimeoutNonBlocking(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(6e4))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,1===this.state_?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),0===this.primaryResponsesRequired_?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):setTimeoutNonBlocking(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(5e3))}sendPingOnPrimaryIfNecessary_(){this.isHealthy_||1!==this.state_||(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:"p",d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,this.tx_!==e&&this.rx_!==e||this.close()}onConnectionLost_(e){this.conn_=null,e||0!==this.state_?1===this.state_&&this.log_("Realtime connection lost."):(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(B.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(1!==this.state_)throw"Connection is not connected";this.tx_.send(e)}close(){2!==this.state_&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ServerActions{put(e,t,n,r){}merge(e,t,n,r){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,n){}onDisconnectMerge(e,t,n){}onDisconnectCancel(e,t){}reportStats(e){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EventEmitter{constructor(e){this.allowedEvents_=e,this.listeners_={},r(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const n=[...this.listeners_[e]];for(let e=0;e<n.length;e++)n[e].callback.apply(n[e].context,t)}}on(e,t,n){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:n});const r=this.getInitialEvent(e);r&&t.apply(n,r)}off(e,t,n){this.validateEventType_(e);const r=this.listeners_[e]||[];for(let i=0;i<r.length;i++)if(r[i].callback===t&&(!n||n===r[i].context))return void r.splice(i,1)}validateEventType_(e){r(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OnlineMonitor extends EventEmitter{static getInstance(){return new OnlineMonitor}constructor(){super(["online"]),this.online_=!0,"undefined"==typeof window||void 0===window.addEventListener||N()||(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return r("online"===e,"Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Path{constructor(e,t){if(void 0===t){this.pieces_=e.split("/");let t=0;for(let e=0;e<this.pieces_.length;e++)this.pieces_[e].length>0&&(this.pieces_[t]=this.pieces_[e],t++);this.pieces_.length=t,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)""!==this.pieces_[t]&&(e+="/"+this.pieces_[t]);return e||"/"}}function newEmptyPath(){return new Path("")}function pathGetFront(e){return e.pieceNum_>=e.pieces_.length?null:e.pieces_[e.pieceNum_]}function pathGetLength(e){return e.pieces_.length-e.pieceNum_}function pathPopFront(e){let t=e.pieceNum_;return t<e.pieces_.length&&t++,new Path(e.pieces_,t)}function pathGetBack(e){return e.pieceNum_<e.pieces_.length?e.pieces_[e.pieces_.length-1]:null}function pathSlice(e,t=0){return e.pieces_.slice(e.pieceNum_+t)}function pathParent(e){if(e.pieceNum_>=e.pieces_.length)return null;const t=[];for(let n=e.pieceNum_;n<e.pieces_.length-1;n++)t.push(e.pieces_[n]);return new Path(t,0)}function pathChild(e,t){const n=[];for(let r=e.pieceNum_;r<e.pieces_.length;r++)n.push(e.pieces_[r]);if(t instanceof Path)for(let r=t.pieceNum_;r<t.pieces_.length;r++)n.push(t.pieces_[r]);else{const e=t.split("/");for(let t=0;t<e.length;t++)e[t].length>0&&n.push(e[t])}return new Path(n,0)}function pathIsEmpty(e){return e.pieceNum_>=e.pieces_.length}function newRelativePath(e,t){const n=pathGetFront(e),r=pathGetFront(t);if(null===n)return t;if(n===r)return newRelativePath(pathPopFront(e),pathPopFront(t));throw new Error("INTERNAL ERROR: innerPath ("+t+") is not within outerPath ("+e+")")}function pathCompare(e,t){const n=pathSlice(e,0),r=pathSlice(t,0);for(let i=0;i<n.length&&i<r.length;i++){const e=nameCompare(n[i],r[i]);if(0!==e)return e}return n.length===r.length?0:n.length<r.length?-1:1}function pathEquals(e,t){if(pathGetLength(e)!==pathGetLength(t))return!1;for(let n=e.pieceNum_,r=t.pieceNum_;n<=e.pieces_.length;n++,r++)if(e.pieces_[n]!==t.pieces_[r])return!1;return!0}function pathContains(e,t){let n=e.pieceNum_,r=t.pieceNum_;if(pathGetLength(e)>pathGetLength(t))return!1;for(;n<e.pieces_.length;){if(e.pieces_[n]!==t.pieces_[r])return!1;++n,++r}return!0}class ValidationPath{constructor(e,t){this.errorPrefix_=t,this.parts_=pathSlice(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let n=0;n<this.parts_.length;n++)this.byteLength_+=k(this.parts_[n]);validationPathCheckValid(this)}}function validationPathCheckValid(e){if(e.byteLength_>768)throw new Error(e.errorPrefix_+"has a key path longer than 768 bytes ("+e.byteLength_+").");if(e.parts_.length>32)throw new Error(e.errorPrefix_+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+validationPathToErrorString(e))}function validationPathToErrorString(e){return 0===e.parts_.length?"":"in property '"+e.parts_.join(".")+"'"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VisibilityMonitor extends EventEmitter{static getInstance(){return new VisibilityMonitor}constructor(){let e,t;super(["visible"]),"undefined"!=typeof document&&void 0!==document.addEventListener&&(void 0!==document.hidden?(t="visibilitychange",e="hidden"):void 0!==document.mozHidden?(t="mozvisibilitychange",e="mozHidden"):void 0!==document.msHidden?(t="msvisibilitychange",e="msHidden"):void 0!==document.webkitHidden&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const t=!document[e];t!==this.visible_&&(this.visible_=t,this.trigger("visible",t))},!1)}getInitialEvent(e){return r("visible"===e,"Unknown event type: "+e),[this.visible_]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae=1e3;class PersistentConnection extends ServerActions{constructor(e,t,n,r,i,o,s,a){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=n,this.onConnectStatus_=r,this.onServerInfoUpdate_=i,this.authTokenProvider_=o,this.appCheckTokenProvider_=s,this.authOverride_=a,this.id=PersistentConnection.nextPersistentConnectionId_++,this.log_=logWrapper("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=ae,this.maxReconnectDelay_=3e5,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,a)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");VisibilityMonitor.getInstance().on("visible",this.onVisible_,this),-1===e.host.indexOf("fblocal")&&OnlineMonitor.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,n){const i=++this.requestNumber_,o={r:i,a:e,b:t};this.log_(_(o)),r(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(o),n&&(this.requestCBHash_[i]=n)}get(e){this.initConnection_();const n=new t,r={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:e=>{const t=e.d;"ok"===e.s?n.resolve(t):n.reject(t)}};this.outstandingGets_.push(r),this.outstandingGetCount_++;const i=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(i),n.promise}listen(e,t,n,i){this.initConnection_();const o=e._queryIdentifier,s=e._path.toString();this.log_("Listen called for "+s+" "+o),this.listens.has(s)||this.listens.set(s,new Map),r(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),r(!this.listens.get(s).has(o),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:t,query:e,tag:n};this.listens.get(s).set(o,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,n=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,0===this.outstandingGetCount_&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(n)})}sendListen_(e){const t=e.query,n=t._path.toString(),r=t._queryIdentifier;this.log_("Listen on "+n+" for "+r);const i={p:n};e.tag&&(i.q=t._queryObject,i.t=e.tag),i.h=e.hashFn(),this.sendRequest("q",i,i=>{const o=i.d,s=i.s;PersistentConnection.warnOnListenWarnings_(o,t);(this.listens.get(n)&&this.listens.get(n).get(r))===e&&(this.log_("listen response",i),"ok"!==s&&this.removeListen_(n,r),e.onComplete&&e.onComplete(s,o))})}static warnOnListenWarnings_(e,t){if(e&&"object"==typeof e&&C(e,"w")){const n=w(e,"w");if(Array.isArray(n)&&~n.indexOf("no_index")){const e='".indexOn": "'+t._queryParams.getIndex().toString()+'"',n=t._path.toString();warn(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${e} at ${n} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&40===e.length||E(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=3e4)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=I(e)?"auth":"gauth",n={cred:e};null===this.authOverride_?n.noauth=!0:"object"==typeof this.authOverride_&&(n.authvar=this.authOverride_),this.sendRequest(t,n,t=>{const n=t.s,r=t.d||"error";this.authToken_===e&&("ok"===n?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(n,r))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,n=e.d||"error";"ok"===t?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,n)})}unlisten(e,t){const n=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+n+" "+i),r(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query");this.removeListen_(n,i)&&this.connected_&&this.sendUnlisten_(n,i,e._queryObject,t)}sendUnlisten_(e,t,n,r){this.log_("Unlisten on "+e+" for "+t);const i={p:e};r&&(i.q=n,i.t=r),this.sendRequest("n",i)}onDisconnectPut(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:n})}onDisconnectMerge(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:n})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,n,r){const i={p:t,d:n};this.log_("onDisconnect "+e,i),this.sendRequest(e,i,e=>{r&&setTimeout(()=>{r(e.s,e.d)},Math.floor(0))})}put(e,t,n,r){this.putInternal("p",e,t,n,r)}merge(e,t,n,r){this.putInternal("m",e,t,n,r)}putInternal(e,t,n,r,i){this.initConnection_();const o={p:t,d:n};void 0!==i&&(o.h=i),this.outstandingPuts_.push({action:e,request:o,onComplete:r}),this.outstandingPutCount_++;const s=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(s):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,n=this.outstandingPuts_[e].request,r=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,n,n=>{this.log_(t+" response",n),delete this.outstandingPuts_[e],this.outstandingPutCount_--,0===this.outstandingPutCount_&&(this.outstandingPuts_=[]),r&&r(n.s,n.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,e=>{if("ok"!==e.s){const t=e.d;this.log_("reportStats","Error sending stats: "+t)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+_(e));const t=e.r,n=this.requestCBHash_[t];n&&(delete this.requestCBHash_[t],n(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),"d"===e?this.onDataUpdate_(t.p,t.d,!1,t.t):"m"===e?this.onDataUpdate_(t.p,t.d,!0,t.t):"c"===e?this.onListenRevoked_(t.p,t.q):"ac"===e?this.onAuthRevoked_(t.s,t.d):"apc"===e?this.onAppCheckRevoked_(t.s,t.d):"sd"===e?this.onSecurityDebugPacket_(t):error("Unrecognized action received from server: "+_(e)+"\nAre you using the latest client?")}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=(new Date).getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){r(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=ae,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=ae,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){if(this.visible_){if(this.lastConnectionEstablishedTime_){(new Date).getTime()-this.lastConnectionEstablishedTime_>3e4&&(this.reconnectDelay_=ae),this.lastConnectionEstablishedTime_=null}}else this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=(new Date).getTime();const e=Math.max(0,(new Date).getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,1.3*this.reconnectDelay_)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=(new Date).getTime(),this.lastConnectionEstablishedTime_=null;const t=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),o=this.id+":"+PersistentConnection.nextConnectionId_++,s=this.lastSessionId;let a=!1,l=null;const closeFn=function(){l?l.close():(a=!0,i())},sendRequestFn=function(e){r(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(e)};this.realtime_={close:closeFn,sendRequest:sendRequestFn};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[e,r]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);a?log("getToken() completed but was canceled"):(log("getToken() completed. Creating connection."),this.authToken_=e&&e.accessToken,this.appCheckToken_=r&&r.token,l=new Connection(o,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,t,n,i,e=>{warn(e+" ("+this.repoInfo_.toString()+")"),this.interrupt("server_kill")},s))}catch(e){this.log_("Failed to get token: "+e),a||(this.repoInfo_.nodeAdmin&&warn(e),closeFn())}}}interrupt(e){log("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){log("Resuming connection for reason: "+e),delete this.interruptReasons_[e],f(this.interruptReasons_)&&(this.reconnectDelay_=ae,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-(new Date).getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}0===this.outstandingPutCount_&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let n;n=t?t.map(e=>ObjectToUniqueKey(e)).join("$"):"default";const r=this.removeListen_(e,n);r&&r.onComplete&&r.onComplete("permission_denied")}removeListen_(e,t){const n=new Path(e).toString();let r;if(this.listens.has(n)){const e=this.listens.get(n);r=e.get(t),e.delete(t),0===e.size&&this.listens.delete(n)}else r=void 0;return r}onAuthRevoked_(e,t){log("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=3&&(this.reconnectDelay_=3e4,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){log("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=3&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace("\n","\nFIREBASE: "))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};e["sdk.js."+V.replace(/\./g,"-")]=1,N()?e["framework.cordova"]=1:b()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=OnlineMonitor.getInstance().currentlyOnline();return f(this.interruptReasons_)&&e}}PersistentConnection.nextPersistentConnectionId_=0,PersistentConnection.nextConnectionId_=0;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class NamedNode{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new NamedNode(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Index{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const n=new NamedNode($,e),r=new NamedNode($,t);return 0!==this.compare(n,r)}minPost(){return NamedNode.MIN}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let le;class KeyIndex extends Index{static get __EMPTY_NODE(){return le}static set __EMPTY_NODE(e){le=e}compare(e,t){return nameCompare(e.name,t.name)}isDefinedOn(e){throw D("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return NamedNode.MIN}maxPost(){return new NamedNode(J,le)}makePost(e,t){return r("string"==typeof e,"KeyIndex indexValue must always be a string."),new NamedNode(e,le)}toString(){return".key"}}const he=new KeyIndex;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SortedMapIterator{constructor(e,t,n,r,i=null){this.isReverse_=r,this.resultGenerator_=i,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(o=t?n(e.key,t):1,r&&(o*=-1),o<0)e=this.isReverse_?e.left:e.right;else{if(0===o){this.nodeStack_.push(e);break}this.nodeStack_.push(e),e=this.isReverse_?e.right:e.left}}getNext(){if(0===this.nodeStack_.length)return null;let e,t=this.nodeStack_.pop();if(e=this.resultGenerator_?this.resultGenerator_(t.key,t.value):{key:t.key,value:t.value},this.isReverse_)for(t=t.left;!t.isEmpty();)this.nodeStack_.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack_.push(t),t=t.left;return e}hasNext(){return this.nodeStack_.length>0}peek(){if(0===this.nodeStack_.length)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class LLRBNode{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:LLRBNode.RED,this.left=null!=r?r:SortedMap.EMPTY_NODE,this.right=null!=i?i:SortedMap.EMPTY_NODE}copy(e,t,n,r,i){return new LLRBNode(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp_()}removeMin_(){if(this.left.isEmpty())return SortedMap.EMPTY_NODE;let e=this;return e.left.isRed_()||e.left.left.isRed_()||(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let n,r;if(n=this,t(e,n.key)<0)n.left.isEmpty()||n.left.isRed_()||n.left.left.isRed_()||(n=n.moveRedLeft_()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed_()&&(n=n.rotateRight_()),n.right.isEmpty()||n.right.isRed_()||n.right.left.isRed_()||(n=n.moveRedRight_()),0===t(e,n.key)){if(n.right.isEmpty())return SortedMap.EMPTY_NODE;r=n.right.min_(),n=n.copy(r.key,r.value,null,null,n.right.removeMin_())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,LLRBNode.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,LLRBNode.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}LLRBNode.RED=!0,LLRBNode.BLACK=!1;class SortedMap{constructor(e,t=SortedMap.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new SortedMap(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,LLRBNode.BLACK,null,null))}remove(e){return new SortedMap(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,LLRBNode.BLACK,null,null))}get(e){let t,n=this.root_;for(;!n.isEmpty();){if(t=this.comparator_(e,n.key),0===t)return n.value;t<0?n=n.left:t>0&&(n=n.right)}return null}getPredecessorKey(e){let t,n=this.root_,r=null;for(;!n.isEmpty();){if(t=this.comparator_(e,n.key),0===t){if(n.left.isEmpty())return r?r.key:null;for(n=n.left;!n.right.isEmpty();)n=n.right;return n.key}t<0?n=n.left:t>0&&(r=n,n=n.right)}throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new SortedMapIterator(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new SortedMapIterator(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new SortedMapIterator(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new SortedMapIterator(this.root_,null,this.comparator_,!0,e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function NAME_ONLY_COMPARATOR(e,t){return nameCompare(e.name,t.name)}function NAME_COMPARATOR(e,t){return nameCompare(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ce;SortedMap.EMPTY_NODE=new class LLRBEmptyNode{copy(e,t,n,r,i){return this}insert(e,t,n){return new LLRBNode(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}};const priorityHashText=function(e){return"number"==typeof e?"number:"+doubleToIEEE754String(e):"string:"+e},validatePriorityNode=function(e){if(e.isLeafNode()){const t=e.val();r("string"==typeof t||"number"==typeof t||"object"==typeof t&&C(t,".sv"),"Priority must be a string or number.")}else r(e===ce||e.isEmpty(),"priority of unexpected type.");r(e===ce||e.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let ue,de,pe;class LeafNode{static set __childrenNodeConstructor(e){ue=e}static get __childrenNodeConstructor(){return ue}constructor(e,t=LeafNode.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,r(void 0!==this.value_&&null!==this.value_,"LeafNode shouldn't be created with null/undefined value."),validatePriorityNode(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new LeafNode(this.value_,e)}getImmediateChild(e){return".priority"===e?this.priorityNode_:LeafNode.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return pathIsEmpty(e)?this:".priority"===pathGetFront(e)?this.priorityNode_:LeafNode.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return".priority"===e?this.updatePriority(t):t.isEmpty()&&".priority"!==e?this:LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const n=pathGetFront(e);return null===n?t:t.isEmpty()&&".priority"!==n?this:(r(".priority"!==n||1===pathGetLength(e),".priority must be the last token in a path"),this.updateImmediateChild(n,LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateChild(pathPopFront(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(null===this.lazyHash_){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+priorityHashText(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",e+="number"===t?doubleToIEEE754String(this.value_):this.value_,this.lazyHash_=sha1(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===LeafNode.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof LeafNode.__childrenNodeConstructor?-1:(r(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,n=typeof this.value_,i=LeafNode.VALUE_TYPE_ORDER.indexOf(t),o=LeafNode.VALUE_TYPE_ORDER.indexOf(n);return r(i>=0,"Unknown leaf type: "+t),r(o>=0,"Unknown leaf type: "+n),i===o?"object"===n?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:o-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}return!1}}LeafNode.VALUE_TYPE_ORDER=["object","boolean","number","string"];const _e=new class PriorityIndex extends Index{compare(e,t){const n=e.node.getPriority(),r=t.node.getPriority(),i=n.compareTo(r);return 0===i?nameCompare(e.name,t.name):i}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return NamedNode.MIN}maxPost(){return new NamedNode(J,new LeafNode("[PRIORITY-POST]",pe))}makePost(e,t){const n=de(e);return new NamedNode(t,new LeafNode("[PRIORITY-POST]",n))}toString(){return".priority"}},me=Math.log(2);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Base12Num{constructor(e){var t;this.count=(t=e+1,parseInt(Math.log(t)/me,10)),this.current_=this.count-1;const n=(r=this.count,parseInt(Array(r+1).join("1"),2));var r;this.bits_=e+1&n}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const buildChildSet=function(e,t,n,r){e.sort(t);const buildBalancedTree=function(t,r){const i=r-t;let o,s;if(0===i)return null;if(1===i)return o=e[t],s=n?n(o):o,new LLRBNode(s,o.node,LLRBNode.BLACK,null,null);{const a=parseInt(i/2,10)+t,l=buildBalancedTree(t,a),h=buildBalancedTree(a+1,r);return o=e[a],s=n?n(o):o,new LLRBNode(s,o.node,LLRBNode.BLACK,l,h)}},i=function(t){let r=null,i=null,o=e.length;const buildPennant=function(t,r){const i=o-t,s=o;o-=t;const a=buildBalancedTree(i+1,s),l=e[i],h=n?n(l):l;attachPennant(new LLRBNode(h,l.node,r,null,a))},attachPennant=function(e){r?(r.left=e,r=e):(i=e,r=e)};for(let e=0;e<t.count;++e){const n=t.nextBitIsOne(),r=Math.pow(2,t.count-(e+1));n?buildPennant(r,LLRBNode.BLACK):(buildPennant(r,LLRBNode.BLACK),buildPennant(r,LLRBNode.RED))}return i}(new Base12Num(e.length));return new SortedMap(r||t,i)};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fe;const ye={};class IndexMap{static get Default(){return r(ye&&_e,"ChildrenNode.ts has not been loaded"),fe=fe||new IndexMap({".priority":ye},{".priority":_e}),fe}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=w(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof SortedMap?t:null}hasIndex(e){return C(this.indexSet_,e.toString())}addIndex(e,t){r(e!==he,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const n=[];let i=!1;const o=t.getIterator(NamedNode.Wrap);let s,a=o.getNext();for(;a;)i=i||e.isDefinedOn(a.node),n.push(a),a=o.getNext();s=i?buildChildSet(n,e.getCompare()):ye;const l=e.toString(),h=Object.assign({},this.indexSet_);h[l]=e;const c=Object.assign({},this.indexes_);return c[l]=s,new IndexMap(c,h)}addToIndexes(e,t){const n=S(this.indexes_,(n,i)=>{const o=w(this.indexSet_,i);if(r(o,"Missing index implementation for "+i),n===ye){if(o.isDefinedOn(e.node)){const n=[],r=t.getIterator(NamedNode.Wrap);let i=r.getNext();for(;i;)i.name!==e.name&&n.push(i),i=r.getNext();return n.push(e),buildChildSet(n,o.getCompare())}return ye}{const r=t.get(e.name);let i=n;return r&&(i=i.remove(new NamedNode(e.name,r))),i.insert(e,e.node)}});return new IndexMap(n,this.indexSet_)}removeFromIndexes(e,t){const n=S(this.indexes_,n=>{if(n===ye)return n;{const r=t.get(e.name);return r?n.remove(new NamedNode(e.name,r)):n}});return new IndexMap(n,this.indexSet_)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ge;class ChildrenNode{static get EMPTY_NODE(){return ge||(ge=new ChildrenNode(new SortedMap(NAME_COMPARATOR),null,IndexMap.Default))}constructor(e,t,n){this.children_=e,this.priorityNode_=t,this.indexMap_=n,this.lazyHash_=null,this.priorityNode_&&validatePriorityNode(this.priorityNode_),this.children_.isEmpty()&&r(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||ge}updatePriority(e){return this.children_.isEmpty()?this:new ChildrenNode(this.children_,e,this.indexMap_)}getImmediateChild(e){if(".priority"===e)return this.getPriority();{const t=this.children_.get(e);return null===t?ge:t}}getChild(e){const t=pathGetFront(e);return null===t?this:this.getImmediateChild(t).getChild(pathPopFront(e))}hasChild(e){return null!==this.children_.get(e)}updateImmediateChild(e,t){if(r(t,"We should always be passing snapshot nodes"),".priority"===e)return this.updatePriority(t);{const n=new NamedNode(e,t);let r,i;t.isEmpty()?(r=this.children_.remove(e),i=this.indexMap_.removeFromIndexes(n,this.children_)):(r=this.children_.insert(e,t),i=this.indexMap_.addToIndexes(n,this.children_));const o=r.isEmpty()?ge:this.priorityNode_;return new ChildrenNode(r,o,i)}}updateChild(e,t){const n=pathGetFront(e);if(null===n)return t;{r(".priority"!==pathGetFront(e)||1===pathGetLength(e),".priority must be the last token in a path");const i=this.getImmediateChild(n).updateChild(pathPopFront(e),t);return this.updateImmediateChild(n,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let n=0,r=0,i=!0;if(this.forEachChild(_e,(o,s)=>{t[o]=s.val(e),n++,i&&ChildrenNode.INTEGER_REGEXP_.test(o)?r=Math.max(r,Number(o)):i=!1}),!e&&i&&r<2*n){const e=[];for(const n in t)e[n]=t[n];return e}return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(null===this.lazyHash_){let e="";this.getPriority().isEmpty()||(e+="priority:"+priorityHashText(this.getPriority().val())+":"),this.forEachChild(_e,(t,n)=>{const r=n.hash();""!==r&&(e+=":"+t+":"+r)}),this.lazyHash_=""===e?"":sha1(e)}return this.lazyHash_}getPredecessorChildName(e,t,n){const r=this.resolveIndex_(n);if(r){const n=r.getPredecessorKey(new NamedNode(e,t));return n?n.name:null}return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.minKey();return e&&e.name}return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new NamedNode(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.maxKey();return e&&e.name}return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new NamedNode(t,this.children_.get(t)):null}forEachChild(e,t){const n=this.resolveIndex_(e);return n?n.inorderTraversal(e=>t(e.name,e.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getIteratorFrom(e,e=>e);{const n=this.children_.getIteratorFrom(e.name,NamedNode.Wrap);let r=n.peek();for(;null!=r&&t.compare(r,e)<0;)n.getNext(),r=n.peek();return n}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getReverseIteratorFrom(e,e=>e);{const n=this.children_.getReverseIteratorFrom(e.name,NamedNode.Wrap);let r=n.peek();for(;null!=r&&t.compare(r,e)>0;)n.getNext(),r=n.peek();return n}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===ve?-1:0}withIndex(e){if(e===he||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new ChildrenNode(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===he||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority())){if(this.children_.count()===t.children_.count()){const e=this.getIterator(_e),n=t.getIterator(_e);let r=e.getNext(),i=n.getNext();for(;r&&i;){if(r.name!==i.name||!r.node.equals(i.node))return!1;r=e.getNext(),i=n.getNext()}return null===r&&null===i}return!1}return!1}}resolveIndex_(e){return e===he?null:this.indexMap_.get(e.toString())}}ChildrenNode.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;const ve=new class MaxNode extends ChildrenNode{constructor(){super(new SortedMap(NAME_COMPARATOR),ChildrenNode.EMPTY_NODE,IndexMap.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return ChildrenNode.EMPTY_NODE}isEmpty(){return!1}};Object.defineProperties(NamedNode,{MIN:{value:new NamedNode($,ChildrenNode.EMPTY_NODE)},MAX:{value:new NamedNode(J,ve)}}),KeyIndex.__EMPTY_NODE=ChildrenNode.EMPTY_NODE,LeafNode.__childrenNodeConstructor=ChildrenNode,function setMaxNode$1(e){ce=e}(ve),function setMaxNode(e){pe=e}(ve);function nodeFromJSON(e,t=null){if(null===e)return ChildrenNode.EMPTY_NODE;if("object"==typeof e&&".priority"in e&&(t=e[".priority"]),r(null===t||"string"==typeof t||"number"==typeof t||"object"==typeof t&&".sv"in t,"Invalid priority type found: "+typeof t),"object"==typeof e&&".value"in e&&null!==e[".value"]&&(e=e[".value"]),"object"!=typeof e||".sv"in e){return new LeafNode(e,nodeFromJSON(t))}if(e instanceof Array){let n=ChildrenNode.EMPTY_NODE;return each(e,(t,r)=>{if(C(e,t)&&"."!==t.substring(0,1)){const e=nodeFromJSON(r);!e.isLeafNode()&&e.isEmpty()||(n=n.updateImmediateChild(t,e))}}),n.updatePriority(nodeFromJSON(t))}{const n=[];let r=!1;if(each(e,(e,t)=>{if("."!==e.substring(0,1)){const i=nodeFromJSON(t);i.isEmpty()||(r=r||!i.getPriority().isEmpty(),n.push(new NamedNode(e,i)))}}),0===n.length)return ChildrenNode.EMPTY_NODE;const i=buildChildSet(n,NAME_ONLY_COMPARATOR,e=>e.name,NAME_COMPARATOR);if(r){const e=buildChildSet(n,_e.getCompare());return new ChildrenNode(i,nodeFromJSON(t),new IndexMap({".priority":e},{".priority":_e}))}return new ChildrenNode(i,nodeFromJSON(t),IndexMap.Default)}}!function setNodeFromJSON(e){de=e}(nodeFromJSON);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PathIndex extends Index{constructor(e){super(),this.indexPath_=e,r(!pathIsEmpty(e)&&".priority"!==pathGetFront(e),"Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const n=this.extractChild(e.node),r=this.extractChild(t.node),i=n.compareTo(r);return 0===i?nameCompare(e.name,t.name):i}makePost(e,t){const n=nodeFromJSON(e),r=ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_,n);return new NamedNode(t,r)}maxPost(){const e=ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_,ve);return new NamedNode(J,e)}toString(){return pathSlice(this.indexPath_,0).join("/")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ce=new class ValueIndex extends Index{compare(e,t){const n=e.node.compareTo(t.node);return 0===n?nameCompare(e.name,t.name):n}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return NamedNode.MIN}maxPost(){return NamedNode.MAX}makePost(e,t){const n=nodeFromJSON(e);return new NamedNode(t,n)}toString(){return".value"}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function changeValue(e){return{type:"value",snapshotNode:e}}function changeChildAdded(e,t){return{type:"child_added",snapshotNode:t,childName:e}}function changeChildRemoved(e,t){return{type:"child_removed",snapshotNode:t,childName:e}}function changeChildChanged(e,t,n){return{type:"child_changed",snapshotNode:t,childName:e,oldSnap:n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class IndexedFilter{constructor(e){this.index_=e}updateChild(e,t,n,i,o,s){r(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(i).equals(n.getChild(i))&&a.isEmpty()===n.isEmpty()?e:(null!=s&&(n.isEmpty()?e.hasChild(t)?s.trackChildChange(changeChildRemoved(t,a)):r(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?s.trackChildChange(changeChildAdded(t,n)):s.trackChildChange(changeChildChanged(t,n,a))),e.isLeafNode()&&n.isEmpty()?e:e.updateImmediateChild(t,n).withIndex(this.index_))}updateFullNode(e,t,n){return null!=n&&(e.isLeafNode()||e.forEachChild(_e,(e,r)=>{t.hasChild(e)||n.trackChildChange(changeChildRemoved(e,r))}),t.isLeafNode()||t.forEachChild(_e,(t,r)=>{if(e.hasChild(t)){const i=e.getImmediateChild(t);i.equals(r)||n.trackChildChange(changeChildChanged(t,r,i))}else n.trackChildChange(changeChildAdded(t,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?ChildrenNode.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RangedFilter{constructor(e){this.indexedFilter_=new IndexedFilter(e.getIndex()),this.index_=e.getIndex(),this.startPost_=RangedFilter.getStartPost_(e),this.endPost_=RangedFilter.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,n=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&n}updateChild(e,t,n,r,i,o){return this.matches(new NamedNode(t,n))||(n=ChildrenNode.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,n,r,i,o)}updateFullNode(e,t,n){t.isLeafNode()&&(t=ChildrenNode.EMPTY_NODE);let r=t.withIndex(this.index_);r=r.updatePriority(ChildrenNode.EMPTY_NODE);const i=this;return t.forEachChild(_e,(e,t)=>{i.matches(new NamedNode(e,t))||(r=r.updateImmediateChild(e,ChildrenNode.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,r,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}return e.getIndex().maxPost()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LimitedFilter{constructor(e){this.withinDirectionalStart=e=>this.reverse_?this.withinEndPost(e):this.withinStartPost(e),this.withinDirectionalEnd=e=>this.reverse_?this.withinStartPost(e):this.withinEndPost(e),this.withinStartPost=e=>{const t=this.index_.compare(this.rangedFilter_.getStartPost(),e);return this.startIsInclusive_?t<=0:t<0},this.withinEndPost=e=>{const t=this.index_.compare(e,this.rangedFilter_.getEndPost());return this.endIsInclusive_?t<=0:t<0},this.rangedFilter_=new RangedFilter(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,n,r,i,o){return this.rangedFilter_.matches(new NamedNode(t,n))||(n=ChildrenNode.EMPTY_NODE),e.getImmediateChild(t).equals(n)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,n,r,i,o):this.fullLimitUpdateChild_(e,t,n,i,o)}updateFullNode(e,t,n){let r;if(t.isLeafNode()||t.isEmpty())r=ChildrenNode.EMPTY_NODE.withIndex(this.index_);else if(2*this.limit_<t.numChildren()&&t.isIndexed(this.index_)){let e;r=ChildrenNode.EMPTY_NODE.withIndex(this.index_),e=this.reverse_?t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let n=0;for(;e.hasNext()&&n<this.limit_;){const t=e.getNext();if(this.withinDirectionalStart(t)){if(!this.withinDirectionalEnd(t))break;r=r.updateImmediateChild(t.name,t.node),n++}}}else{let e;r=t.withIndex(this.index_),r=r.updatePriority(ChildrenNode.EMPTY_NODE),e=this.reverse_?r.getReverseIterator(this.index_):r.getIterator(this.index_);let n=0;for(;e.hasNext();){const t=e.getNext();n<this.limit_&&this.withinDirectionalStart(t)&&this.withinDirectionalEnd(t)?n++:r=r.updateImmediateChild(t.name,ChildrenNode.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,r,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,n,i,o){let s;if(this.reverse_){const e=this.index_.getCompare();s=(t,n)=>e(n,t)}else s=this.index_.getCompare();const a=e;r(a.numChildren()===this.limit_,"");const l=new NamedNode(t,n),h=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),c=this.rangedFilter_.matches(l);if(a.hasChild(t)){const e=a.getImmediateChild(t);let r=i.getChildAfterChild(this.index_,h,this.reverse_);for(;null!=r&&(r.name===t||a.hasChild(r.name));)r=i.getChildAfterChild(this.index_,r,this.reverse_);const u=null==r?1:s(r,l);if(c&&!n.isEmpty()&&u>=0)return null!=o&&o.trackChildChange(changeChildChanged(t,n,e)),a.updateImmediateChild(t,n);{null!=o&&o.trackChildChange(changeChildRemoved(t,e));const n=a.updateImmediateChild(t,ChildrenNode.EMPTY_NODE);return null!=r&&this.rangedFilter_.matches(r)?(null!=o&&o.trackChildChange(changeChildAdded(r.name,r.node)),n.updateImmediateChild(r.name,r.node)):n}}return n.isEmpty()?e:c&&s(h,l)>=0?(null!=o&&(o.trackChildChange(changeChildRemoved(h.name,h.node)),o.trackChildChange(changeChildAdded(t,n))),a.updateImmediateChild(t,n).updateImmediateChild(h.name,ChildrenNode.EMPTY_NODE)):e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QueryParams{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=_e}hasStart(){return this.startSet_}isViewFromLeft(){return""===this.viewFrom_?this.startSet_:"l"===this.viewFrom_}getIndexStartValue(){return r(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return r(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:$}hasEnd(){return this.endSet_}getIndexEndValue(){return r(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return r(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:J}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&""!==this.viewFrom_}getLimit(){return r(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===_e}copy(){const e=new QueryParams;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function queryParamsStartAt(e,t,n){const r=e.copy();return r.startSet_=!0,void 0===t&&(t=null),r.indexStartValue_=t,null!=n?(r.startNameSet_=!0,r.indexStartName_=n):(r.startNameSet_=!1,r.indexStartName_=""),r}function queryParamsEndAt(e,t,n){const r=e.copy();return r.endSet_=!0,void 0===t&&(t=null),r.indexEndValue_=t,void 0!==n?(r.endNameSet_=!0,r.indexEndName_=n):(r.endNameSet_=!1,r.indexEndName_=""),r}function queryParamsOrderBy(e,t){const n=e.copy();return n.index_=t,n}function queryParamsToRestQueryStringParameters(e){const t={};if(e.isDefault())return t;let n;if(e.index_===_e?n="$priority":e.index_===Ce?n="$value":e.index_===he?n="$key":(r(e.index_ instanceof PathIndex,"Unrecognized index type!"),n=e.index_.toString()),t.orderBy=_(n),e.startSet_){const n=e.startAfterSet_?"startAfter":"startAt";t[n]=_(e.indexStartValue_),e.startNameSet_&&(t[n]+=","+_(e.indexStartName_))}if(e.endSet_){const n=e.endBeforeSet_?"endBefore":"endAt";t[n]=_(e.indexEndValue_),e.endNameSet_&&(t[n]+=","+_(e.indexEndName_))}return e.limitSet_&&(e.isViewFromLeft()?t.limitToFirst=e.limit_:t.limitToLast=e.limit_),t}function queryParamsGetQueryObject(e){const t={};if(e.startSet_&&(t.sp=e.indexStartValue_,e.startNameSet_&&(t.sn=e.indexStartName_),t.sin=!e.startAfterSet_),e.endSet_&&(t.ep=e.indexEndValue_,e.endNameSet_&&(t.en=e.indexEndName_),t.ein=!e.endBeforeSet_),e.limitSet_){t.l=e.limit_;let n=e.viewFrom_;""===n&&(n=e.isViewFromLeft()?"l":"r"),t.vf=n}return e.index_!==_e&&(t.i=e.index_.toString()),t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ReadonlyRestClient extends ServerActions{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return void 0!==t?"tag$"+t:(r(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,n,r){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=n,this.appCheckTokenProvider_=r,this.log_=logWrapper("p:rest:"),this.listens_={}}listen(e,t,n,r){const i=e._path.toString();this.log_("Listen called for "+i+" "+e._queryIdentifier);const o=ReadonlyRestClient.getListenId_(e,n),s={};this.listens_[o]=s;const a=queryParamsToRestQueryStringParameters(e._queryParams);this.restRequest_(i+".json",a,(e,t)=>{let a=t;if(404===e&&(a=null,e=null),null===e&&this.onDataUpdate_(i,a,!1,n),w(this.listens_,o)===s){let t;t=e?401===e?"permission_denied":"rest_error:"+e:"ok",r(t,null)}})}unlisten(e,t){const n=ReadonlyRestClient.getListenId_(e,t);delete this.listens_[n]}get(e){const n=queryParamsToRestQueryStringParameters(e._queryParams),r=e._path.toString(),i=new t;return this.restRequest_(r+".json",n,(e,t)=>{let n=t;404===e&&(n=null,e=null),null===e?(this.onDataUpdate_(r,n,!1,null),i.resolve(n)):i.reject(new Error(n))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},n){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([r,i])=>{r&&r.accessToken&&(t.auth=r.accessToken),i&&i.token&&(t.ac=i.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+T(t);this.log_("Sending REST request for "+o);const s=new XMLHttpRequest;s.onreadystatechange=()=>{if(n&&4===s.readyState){this.log_("REST Response for "+o+" received. status:",s.status,"response:",s.responseText);let t=null;if(s.status>=200&&s.status<300){try{t=P(s.responseText)}catch(e){warn("Failed to parse JSON response for "+o+": "+s.responseText)}n(null,t)}else 401!==s.status&&404!==s.status&&warn("Got unsuccessful REST response for "+o+" Status: "+s.status),n(s.status);n=null}},s.open("GET",o,!0),s.send()})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SnapshotHolder{constructor(){this.rootNode_=ChildrenNode.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function newSparseSnapshotTree(){return{value:null,children:new Map}}function sparseSnapshotTreeRemember(e,t,n){if(pathIsEmpty(t))e.value=n,e.children.clear();else if(null!==e.value)e.value=e.value.updateChild(t,n);else{const r=pathGetFront(t);e.children.has(r)||e.children.set(r,newSparseSnapshotTree());sparseSnapshotTreeRemember(e.children.get(r),t=pathPopFront(t),n)}}function sparseSnapshotTreeForget(e,t){if(pathIsEmpty(t))return e.value=null,e.children.clear(),!0;if(null!==e.value){if(e.value.isLeafNode())return!1;{const n=e.value;return e.value=null,n.forEachChild(_e,(t,n)=>{sparseSnapshotTreeRemember(e,new Path(t),n)}),sparseSnapshotTreeForget(e,t)}}if(e.children.size>0){const n=pathGetFront(t);if(t=pathPopFront(t),e.children.has(n)){sparseSnapshotTreeForget(e.children.get(n),t)&&e.children.delete(n)}return 0===e.children.size}return!0}function sparseSnapshotTreeForEachTree(e,t,n){null!==e.value?n(t,e.value):function sparseSnapshotTreeForEachChild(e,t){e.children.forEach((e,n)=>{t(n,e)})}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,(e,r)=>{sparseSnapshotTreeForEachTree(r,new Path(t.toString()+"/"+e),n)})}class StatsListener{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&each(this.last_,(e,n)=>{t[e]=t[e]-n}),this.last_=e,t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class StatsReporter{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new StatsListener(e);const n=1e4+2e4*Math.random();setTimeoutNonBlocking(this.reportStats_.bind(this),Math.floor(n))}reportStats_(){const e=this.statsListener_.get(),t={};let n=!1;each(e,(e,r)=>{r>0&&C(this.statsToReport_,e)&&(t[e]=r,n=!0)}),n&&this.server_.reportStats(t),setTimeoutNonBlocking(this.reportStats_.bind(this),Math.floor(2*Math.random()*3e5))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var we,Te;function newOperationSourceServerTaggedQuery(e){return{fromUser:!1,fromServer:!0,queryId:e,tagged:!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(Te=we||(we={}))[Te.OVERWRITE=0]="OVERWRITE",Te[Te.MERGE=1]="MERGE",Te[Te.ACK_USER_WRITE=2]="ACK_USER_WRITE",Te[Te.LISTEN_COMPLETE=3]="LISTEN_COMPLETE";class AckUserWrite{constructor(e,t,n){this.path=e,this.affectedTree=t,this.revert=n,this.type=we.ACK_USER_WRITE,this.source={fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}operationForChild(e){if(pathIsEmpty(this.path)){if(null!=this.affectedTree.value)return r(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new Path(e));return new AckUserWrite(newEmptyPath(),t,this.revert)}}return r(pathGetFront(this.path)===e,"operationForChild called for unrelated child."),new AckUserWrite(pathPopFront(this.path),this.affectedTree,this.revert)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ListenComplete{constructor(e,t){this.source=e,this.path=t,this.type=we.LISTEN_COMPLETE}operationForChild(e){return pathIsEmpty(this.path)?new ListenComplete(this.source,newEmptyPath()):new ListenComplete(this.source,pathPopFront(this.path))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Overwrite{constructor(e,t,n){this.source=e,this.path=t,this.snap=n,this.type=we.OVERWRITE}operationForChild(e){return pathIsEmpty(this.path)?new Overwrite(this.source,newEmptyPath(),this.snap.getImmediateChild(e)):new Overwrite(this.source,pathPopFront(this.path),this.snap)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Merge{constructor(e,t,n){this.source=e,this.path=t,this.children=n,this.type=we.MERGE}operationForChild(e){if(pathIsEmpty(this.path)){const t=this.children.subtree(new Path(e));return t.isEmpty()?null:t.value?new Overwrite(this.source,newEmptyPath(),t.value):new Merge(this.source,newEmptyPath(),t)}return r(pathGetFront(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Merge(this.source,pathPopFront(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CacheNode{constructor(e,t,n){this.node_=e,this.fullyInitialized_=t,this.filtered_=n}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(pathIsEmpty(e))return this.isFullyInitialized()&&!this.filtered_;const t=pathGetFront(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EventGenerator{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function eventGeneratorGenerateEventsForType(e,t,n,r,i,o){const s=r.filter(e=>e.type===n);s.sort((t,n)=>function eventGeneratorCompareChanges(e,t,n){if(null==t.childName||null==n.childName)throw D("Should only compare child_ events.");const r=new NamedNode(t.childName,t.snapshotNode),i=new NamedNode(n.childName,n.snapshotNode);return e.index_.compare(r,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t,n)),s.forEach(n=>{const r=function eventGeneratorMaterializeSingleChange(e,t,n){return"value"===t.type||"child_removed"===t.type||(t.prevName=n.getPredecessorChildName(t.childName,t.snapshotNode,e.index_)),t}(e,n,o);i.forEach(i=>{i.respondsTo(n.type)&&t.push(i.createEvent(r,e.query_))})})}function newViewCache(e,t){return{eventCache:e,serverCache:t}}function viewCacheUpdateEventSnap(e,t,n,r){return newViewCache(new CacheNode(t,n,r),e.serverCache)}function viewCacheUpdateServerSnap(e,t,n,r){return newViewCache(e.eventCache,new CacheNode(t,n,r))}function viewCacheGetCompleteEventSnap(e){return e.eventCache.isFullyInitialized()?e.eventCache.getNode():null}function viewCacheGetCompleteServerSnap(e){return e.serverCache.isFullyInitialized()?e.serverCache.getNode():null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Pe;class ImmutableTree{static fromObject(e){let t=new ImmutableTree(null);return each(e,(e,n)=>{t=t.set(new Path(e),n)}),t}constructor(e,t=(()=>(Pe||(Pe=new SortedMap(stringCompare)),Pe))()){this.value=e,this.children=t}isEmpty(){return null===this.value&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(null!=this.value&&t(this.value))return{path:newEmptyPath(),value:this.value};if(pathIsEmpty(e))return null;{const n=pathGetFront(e),r=this.children.get(n);if(null!==r){const i=r.findRootMostMatchingPathAndValue(pathPopFront(e),t);if(null!=i){return{path:pathChild(new Path(n),i.path),value:i.value}}return null}return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(pathIsEmpty(e))return this;{const t=pathGetFront(e),n=this.children.get(t);return null!==n?n.subtree(pathPopFront(e)):new ImmutableTree(null)}}set(e,t){if(pathIsEmpty(e))return new ImmutableTree(t,this.children);{const n=pathGetFront(e),r=(this.children.get(n)||new ImmutableTree(null)).set(pathPopFront(e),t),i=this.children.insert(n,r);return new ImmutableTree(this.value,i)}}remove(e){if(pathIsEmpty(e))return this.children.isEmpty()?new ImmutableTree(null):new ImmutableTree(null,this.children);{const t=pathGetFront(e),n=this.children.get(t);if(n){const r=n.remove(pathPopFront(e));let i;return i=r.isEmpty()?this.children.remove(t):this.children.insert(t,r),null===this.value&&i.isEmpty()?new ImmutableTree(null):new ImmutableTree(this.value,i)}return this}}get(e){if(pathIsEmpty(e))return this.value;{const t=pathGetFront(e),n=this.children.get(t);return n?n.get(pathPopFront(e)):null}}setTree(e,t){if(pathIsEmpty(e))return t;{const n=pathGetFront(e),r=(this.children.get(n)||new ImmutableTree(null)).setTree(pathPopFront(e),t);let i;return i=r.isEmpty()?this.children.remove(n):this.children.insert(n,r),new ImmutableTree(this.value,i)}}fold(e){return this.fold_(newEmptyPath(),e)}fold_(e,t){const n={};return this.children.inorderTraversal((r,i)=>{n[r]=i.fold_(pathChild(e,r),t)}),t(e,this.value,n)}findOnPath(e,t){return this.findOnPath_(e,newEmptyPath(),t)}findOnPath_(e,t,n){const r=!!this.value&&n(t,this.value);if(r)return r;if(pathIsEmpty(e))return null;{const r=pathGetFront(e),i=this.children.get(r);return i?i.findOnPath_(pathPopFront(e),pathChild(t,r),n):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,newEmptyPath(),t)}foreachOnPath_(e,t,n){if(pathIsEmpty(e))return this;{this.value&&n(t,this.value);const r=pathGetFront(e),i=this.children.get(r);return i?i.foreachOnPath_(pathPopFront(e),pathChild(t,r),n):new ImmutableTree(null)}}foreach(e){this.foreach_(newEmptyPath(),e)}foreach_(e,t){this.children.inorderTraversal((n,r)=>{r.foreach_(pathChild(e,n),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,n)=>{n.value&&e(t,n.value)})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CompoundWrite{constructor(e){this.writeTree_=e}static empty(){return new CompoundWrite(new ImmutableTree(null))}}function compoundWriteAddWrite(e,t,n){if(pathIsEmpty(t))return new CompoundWrite(new ImmutableTree(n));{const r=e.writeTree_.findRootMostValueAndPath(t);if(null!=r){const i=r.path;let o=r.value;const s=newRelativePath(i,t);return o=o.updateChild(s,n),new CompoundWrite(e.writeTree_.set(i,o))}{const r=new ImmutableTree(n),i=e.writeTree_.setTree(t,r);return new CompoundWrite(i)}}}function compoundWriteAddWrites(e,t,n){let r=e;return each(n,(e,n)=>{r=compoundWriteAddWrite(r,pathChild(t,e),n)}),r}function compoundWriteRemoveWrite(e,t){if(pathIsEmpty(t))return CompoundWrite.empty();{const n=e.writeTree_.setTree(t,new ImmutableTree(null));return new CompoundWrite(n)}}function compoundWriteHasCompleteWrite(e,t){return null!=compoundWriteGetCompleteNode(e,t)}function compoundWriteGetCompleteNode(e,t){const n=e.writeTree_.findRootMostValueAndPath(t);return null!=n?e.writeTree_.get(n.path).getChild(newRelativePath(n.path,t)):null}function compoundWriteGetCompleteChildren(e){const t=[],n=e.writeTree_.value;return null!=n?n.isLeafNode()||n.forEachChild(_e,(e,n)=>{t.push(new NamedNode(e,n))}):e.writeTree_.children.inorderTraversal((e,n)=>{null!=n.value&&t.push(new NamedNode(e,n.value))}),t}function compoundWriteChildCompoundWrite(e,t){if(pathIsEmpty(t))return e;{const n=compoundWriteGetCompleteNode(e,t);return new CompoundWrite(null!=n?new ImmutableTree(n):e.writeTree_.subtree(t))}}function compoundWriteIsEmpty(e){return e.writeTree_.isEmpty()}function compoundWriteApply(e,t){return applySubtreeWrite(newEmptyPath(),e.writeTree_,t)}function applySubtreeWrite(e,t,n){if(null!=t.value)return n.updateChild(e,t.value);{let i=null;return t.children.inorderTraversal((t,o)=>{".priority"===t?(r(null!==o.value,"Priority writes must always be leaf nodes"),i=o.value):n=applySubtreeWrite(pathChild(e,t),o,n)}),n.getChild(e).isEmpty()||null===i||(n=n.updateChild(pathChild(e,".priority"),i)),n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function writeTreeChildWrites(e,t){return newWriteTreeRef(t,e)}function writeTreeRemoveWrite(e,t){const n=e.allWrites.findIndex(e=>e.writeId===t);r(n>=0,"removeWrite called with nonexistent writeId.");const i=e.allWrites[n];e.allWrites.splice(n,1);let o=i.visible,s=!1,a=e.allWrites.length-1;for(;o&&a>=0;){const t=e.allWrites[a];t.visible&&(a>=n&&writeTreeRecordContainsPath_(t,i.path)?o=!1:pathContains(i.path,t.path)&&(s=!0)),a--}if(o){if(s)return function writeTreeResetTree_(e){e.visibleWrites=writeTreeLayerTree_(e.allWrites,writeTreeDefaultFilter_,newEmptyPath()),e.allWrites.length>0?e.lastWriteId=e.allWrites[e.allWrites.length-1].writeId:e.lastWriteId=-1}(e),!0;if(i.snap)e.visibleWrites=compoundWriteRemoveWrite(e.visibleWrites,i.path);else{each(i.children,t=>{e.visibleWrites=compoundWriteRemoveWrite(e.visibleWrites,pathChild(i.path,t))})}return!0}return!1}function writeTreeRecordContainsPath_(e,t){if(e.snap)return pathContains(e.path,t);for(const n in e.children)if(e.children.hasOwnProperty(n)&&pathContains(pathChild(e.path,n),t))return!0;return!1}function writeTreeDefaultFilter_(e){return e.visible}function writeTreeLayerTree_(e,t,n){let r=CompoundWrite.empty();for(let i=0;i<e.length;++i){const o=e[i];if(t(o)){const e=o.path;let t;if(o.snap)pathContains(n,e)?(t=newRelativePath(n,e),r=compoundWriteAddWrite(r,t,o.snap)):pathContains(e,n)&&(t=newRelativePath(e,n),r=compoundWriteAddWrite(r,newEmptyPath(),o.snap.getChild(t)));else{if(!o.children)throw D("WriteRecord should have .snap or .children");if(pathContains(n,e))t=newRelativePath(n,e),r=compoundWriteAddWrites(r,t,o.children);else if(pathContains(e,n))if(t=newRelativePath(e,n),pathIsEmpty(t))r=compoundWriteAddWrites(r,newEmptyPath(),o.children);else{const e=w(o.children,pathGetFront(t));if(e){const n=e.getChild(pathPopFront(t));r=compoundWriteAddWrite(r,newEmptyPath(),n)}}}}}return r}function writeTreeCalcCompleteEventCache(e,t,n,r,i){if(r||i){const o=compoundWriteChildCompoundWrite(e.visibleWrites,t);if(!i&&compoundWriteIsEmpty(o))return n;if(i||null!=n||compoundWriteHasCompleteWrite(o,newEmptyPath())){const filter=function(e){return(e.visible||i)&&(!r||!~r.indexOf(e.writeId))&&(pathContains(e.path,t)||pathContains(t,e.path))};return compoundWriteApply(writeTreeLayerTree_(e.allWrites,filter,t),n||ChildrenNode.EMPTY_NODE)}return null}{const r=compoundWriteGetCompleteNode(e.visibleWrites,t);if(null!=r)return r;{const r=compoundWriteChildCompoundWrite(e.visibleWrites,t);if(compoundWriteIsEmpty(r))return n;if(null!=n||compoundWriteHasCompleteWrite(r,newEmptyPath())){return compoundWriteApply(r,n||ChildrenNode.EMPTY_NODE)}return null}}}function writeTreeRefCalcCompleteEventCache(e,t,n,r){return writeTreeCalcCompleteEventCache(e.writeTree,e.treePath,t,n,r)}function writeTreeRefCalcCompleteEventChildren(e,t){return function writeTreeCalcCompleteEventChildren(e,t,n){let r=ChildrenNode.EMPTY_NODE;const i=compoundWriteGetCompleteNode(e.visibleWrites,t);if(i)return i.isLeafNode()||i.forEachChild(_e,(e,t)=>{r=r.updateImmediateChild(e,t)}),r;if(n){const i=compoundWriteChildCompoundWrite(e.visibleWrites,t);return n.forEachChild(_e,(e,t)=>{const n=compoundWriteApply(compoundWriteChildCompoundWrite(i,new Path(e)),t);r=r.updateImmediateChild(e,n)}),compoundWriteGetCompleteChildren(i).forEach(e=>{r=r.updateImmediateChild(e.name,e.node)}),r}return compoundWriteGetCompleteChildren(compoundWriteChildCompoundWrite(e.visibleWrites,t)).forEach(e=>{r=r.updateImmediateChild(e.name,e.node)}),r}(e.writeTree,e.treePath,t)}function writeTreeRefCalcEventCacheAfterServerOverwrite(e,t,n,i){return function writeTreeCalcEventCacheAfterServerOverwrite(e,t,n,i,o){r(i||o,"Either existingEventSnap or existingServerSnap must exist");const s=pathChild(t,n);if(compoundWriteHasCompleteWrite(e.visibleWrites,s))return null;{const t=compoundWriteChildCompoundWrite(e.visibleWrites,s);return compoundWriteIsEmpty(t)?o.getChild(n):compoundWriteApply(t,o.getChild(n))}}(e.writeTree,e.treePath,t,n,i)}function writeTreeRefShadowingWrite(e,t){return function writeTreeShadowingWrite(e,t){return compoundWriteGetCompleteNode(e.visibleWrites,t)}(e.writeTree,pathChild(e.treePath,t))}function writeTreeRefCalcIndexedSlice(e,t,n,r,i,o){return function writeTreeCalcIndexedSlice(e,t,n,r,i,o,s){let a;const l=compoundWriteChildCompoundWrite(e.visibleWrites,t),h=compoundWriteGetCompleteNode(l,newEmptyPath());if(null!=h)a=h;else{if(null==n)return[];a=compoundWriteApply(l,n)}if(a=a.withIndex(s),a.isEmpty()||a.isLeafNode())return[];{const e=[],t=s.getCompare(),n=o?a.getReverseIteratorFrom(r,s):a.getIteratorFrom(r,s);let l=n.getNext();for(;l&&e.length<i;)0!==t(l,r)&&e.push(l),l=n.getNext();return e}}(e.writeTree,e.treePath,t,n,r,i,o)}function writeTreeRefCalcCompleteChild(e,t,n){return function writeTreeCalcCompleteChild(e,t,n,r){const i=pathChild(t,n),o=compoundWriteGetCompleteNode(e.visibleWrites,i);if(null!=o)return o;if(r.isCompleteForChild(n))return compoundWriteApply(compoundWriteChildCompoundWrite(e.visibleWrites,i),r.getNode().getImmediateChild(n));return null}(e.writeTree,e.treePath,t,n)}function writeTreeRefChild(e,t){return newWriteTreeRef(pathChild(e.treePath,t),e.writeTree)}function newWriteTreeRef(e,t){return{treePath:e,writeTree:t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ChildChangeAccumulator{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,n=e.childName;r("child_added"===t||"child_changed"===t||"child_removed"===t,"Only child changes supported for tracking"),r(".priority"!==n,"Only non-priority child changes can be tracked.");const i=this.changeMap.get(n);if(i){const r=i.type;if("child_added"===t&&"child_removed"===r)this.changeMap.set(n,changeChildChanged(n,e.snapshotNode,i.snapshotNode));else if("child_removed"===t&&"child_added"===r)this.changeMap.delete(n);else if("child_removed"===t&&"child_changed"===r)this.changeMap.set(n,changeChildRemoved(n,i.oldSnap));else if("child_changed"===t&&"child_added"===r)this.changeMap.set(n,changeChildAdded(n,e.snapshotNode));else{if("child_changed"!==t||"child_changed"!==r)throw D("Illegal combination of changes: "+e+" occurred after "+i);this.changeMap.set(n,changeChildChanged(n,e.snapshotNode,i.oldSnap))}}else this.changeMap.set(n,e)}getChanges(){return Array.from(this.changeMap.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Se=new class NoCompleteChildSource_{getCompleteChild(e){return null}getChildAfterChild(e,t,n){return null}};class WriteTreeCompleteChildSource{constructor(e,t,n=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=n}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const t=null!=this.optCompleteServerCache_?new CacheNode(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return writeTreeRefCalcCompleteChild(this.writes_,e,t)}}getChildAfterChild(e,t,n){const r=null!=this.optCompleteServerCache_?this.optCompleteServerCache_:viewCacheGetCompleteServerSnap(this.viewCache_),i=writeTreeRefCalcIndexedSlice(this.writes_,r,t,1,n,e);return 0===i.length?null:i[0]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function viewProcessorApplyOperation(e,t,n,i,o){const s=new ChildChangeAccumulator;let a,l;if(n.type===we.OVERWRITE){const h=n;h.source.fromUser?a=viewProcessorApplyUserOverwrite(e,t,h.path,h.snap,i,o,s):(r(h.source.fromServer,"Unknown source."),l=h.source.tagged||t.serverCache.isFiltered()&&!pathIsEmpty(h.path),a=viewProcessorApplyServerOverwrite(e,t,h.path,h.snap,i,o,l,s))}else if(n.type===we.MERGE){const h=n;h.source.fromUser?a=function viewProcessorApplyUserMerge(e,t,n,r,i,o,s){let a=t;return r.foreach((r,l)=>{const h=pathChild(n,r);viewProcessorCacheHasChild(t,pathGetFront(h))&&(a=viewProcessorApplyUserOverwrite(e,a,h,l,i,o,s))}),r.foreach((r,l)=>{const h=pathChild(n,r);viewProcessorCacheHasChild(t,pathGetFront(h))||(a=viewProcessorApplyUserOverwrite(e,a,h,l,i,o,s))}),a}(e,t,h.path,h.children,i,o,s):(r(h.source.fromServer,"Unknown source."),l=h.source.tagged||t.serverCache.isFiltered(),a=viewProcessorApplyServerMerge(e,t,h.path,h.children,i,o,l,s))}else if(n.type===we.ACK_USER_WRITE){const l=n;a=l.revert?function viewProcessorRevertUserWrite(e,t,n,i,o,s){let a;if(null!=writeTreeRefShadowingWrite(i,n))return t;{const l=new WriteTreeCompleteChildSource(i,t,o),h=t.eventCache.getNode();let c;if(pathIsEmpty(n)||".priority"===pathGetFront(n)){let n;if(t.serverCache.isFullyInitialized())n=writeTreeRefCalcCompleteEventCache(i,viewCacheGetCompleteServerSnap(t));else{const e=t.serverCache.getNode();r(e instanceof ChildrenNode,"serverChildren would be complete if leaf node"),n=writeTreeRefCalcCompleteEventChildren(i,e)}c=e.filter.updateFullNode(h,n,s)}else{const r=pathGetFront(n);let o=writeTreeRefCalcCompleteChild(i,r,t.serverCache);null==o&&t.serverCache.isCompleteForChild(r)&&(o=h.getImmediateChild(r)),c=null!=o?e.filter.updateChild(h,r,o,pathPopFront(n),l,s):t.eventCache.getNode().hasChild(r)?e.filter.updateChild(h,r,ChildrenNode.EMPTY_NODE,pathPopFront(n),l,s):h,c.isEmpty()&&t.serverCache.isFullyInitialized()&&(a=writeTreeRefCalcCompleteEventCache(i,viewCacheGetCompleteServerSnap(t)),a.isLeafNode()&&(c=e.filter.updateFullNode(c,a,s)))}return a=t.serverCache.isFullyInitialized()||null!=writeTreeRefShadowingWrite(i,newEmptyPath()),viewCacheUpdateEventSnap(t,c,a,e.filter.filtersNodes())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t,l.path,i,o,s):function viewProcessorAckUserWrite(e,t,n,r,i,o,s){if(null!=writeTreeRefShadowingWrite(i,n))return t;const a=t.serverCache.isFiltered(),l=t.serverCache;if(null!=r.value){if(pathIsEmpty(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return viewProcessorApplyServerOverwrite(e,t,n,l.getNode().getChild(n),i,o,a,s);if(pathIsEmpty(n)){let r=new ImmutableTree(null);return l.getNode().forEachChild(he,(e,t)=>{r=r.set(new Path(e),t)}),viewProcessorApplyServerMerge(e,t,n,r,i,o,a,s)}return t}{let h=new ImmutableTree(null);return r.foreach((e,t)=>{const r=pathChild(n,e);l.isCompleteForPath(r)&&(h=h.set(e,l.getNode().getChild(r)))}),viewProcessorApplyServerMerge(e,t,n,h,i,o,a,s)}}(e,t,l.path,l.affectedTree,i,o,s)}else{if(n.type!==we.LISTEN_COMPLETE)throw D("Unknown operation type: "+n.type);a=function viewProcessorListenComplete(e,t,n,r,i){const o=t.serverCache,s=viewCacheUpdateServerSnap(t,o.getNode(),o.isFullyInitialized()||pathIsEmpty(n),o.isFiltered());return viewProcessorGenerateEventCacheAfterServerEvent(e,s,n,r,Se,i)}(e,t,n.path,i,s)}const h=s.getChanges();return function viewProcessorMaybeAddValueEvent(e,t,n){const r=t.eventCache;if(r.isFullyInitialized()){const i=r.getNode().isLeafNode()||r.getNode().isEmpty(),o=viewCacheGetCompleteEventSnap(e);(n.length>0||!e.eventCache.isFullyInitialized()||i&&!r.getNode().equals(o)||!r.getNode().getPriority().equals(o.getPriority()))&&n.push(changeValue(viewCacheGetCompleteEventSnap(t)))}}(t,a,h),{viewCache:a,changes:h}}function viewProcessorGenerateEventCacheAfterServerEvent(e,t,n,i,o,s){const a=t.eventCache;if(null!=writeTreeRefShadowingWrite(i,n))return t;{let l,h;if(pathIsEmpty(n))if(r(t.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),t.serverCache.isFiltered()){const n=viewCacheGetCompleteServerSnap(t),r=writeTreeRefCalcCompleteEventChildren(i,n instanceof ChildrenNode?n:ChildrenNode.EMPTY_NODE);l=e.filter.updateFullNode(t.eventCache.getNode(),r,s)}else{const n=writeTreeRefCalcCompleteEventCache(i,viewCacheGetCompleteServerSnap(t));l=e.filter.updateFullNode(t.eventCache.getNode(),n,s)}else{const c=pathGetFront(n);if(".priority"===c){r(1===pathGetLength(n),"Can't have a priority with additional path components");const o=a.getNode();h=t.serverCache.getNode();const s=writeTreeRefCalcEventCacheAfterServerOverwrite(i,n,o,h);l=null!=s?e.filter.updatePriority(o,s):a.getNode()}else{const r=pathPopFront(n);let u;if(a.isCompleteForChild(c)){h=t.serverCache.getNode();const e=writeTreeRefCalcEventCacheAfterServerOverwrite(i,n,a.getNode(),h);u=null!=e?a.getNode().getImmediateChild(c).updateChild(r,e):a.getNode().getImmediateChild(c)}else u=writeTreeRefCalcCompleteChild(i,c,t.serverCache);l=null!=u?e.filter.updateChild(a.getNode(),c,u,r,o,s):a.getNode()}}return viewCacheUpdateEventSnap(t,l,a.isFullyInitialized()||pathIsEmpty(n),e.filter.filtersNodes())}}function viewProcessorApplyServerOverwrite(e,t,n,r,i,o,s,a){const l=t.serverCache;let h;const c=s?e.filter:e.filter.getIndexedFilter();if(pathIsEmpty(n))h=c.updateFullNode(l.getNode(),r,null);else if(c.filtersNodes()&&!l.isFiltered()){const e=l.getNode().updateChild(n,r);h=c.updateFullNode(l.getNode(),e,null)}else{const e=pathGetFront(n);if(!l.isCompleteForPath(n)&&pathGetLength(n)>1)return t;const i=pathPopFront(n),o=l.getNode().getImmediateChild(e).updateChild(i,r);h=".priority"===e?c.updatePriority(l.getNode(),o):c.updateChild(l.getNode(),e,o,i,Se,null)}const u=viewCacheUpdateServerSnap(t,h,l.isFullyInitialized()||pathIsEmpty(n),c.filtersNodes());return viewProcessorGenerateEventCacheAfterServerEvent(e,u,n,i,new WriteTreeCompleteChildSource(i,u,o),a)}function viewProcessorApplyUserOverwrite(e,t,n,r,i,o,s){const a=t.eventCache;let l,h;const c=new WriteTreeCompleteChildSource(i,t,o);if(pathIsEmpty(n))h=e.filter.updateFullNode(t.eventCache.getNode(),r,s),l=viewCacheUpdateEventSnap(t,h,!0,e.filter.filtersNodes());else{const i=pathGetFront(n);if(".priority"===i)h=e.filter.updatePriority(t.eventCache.getNode(),r),l=viewCacheUpdateEventSnap(t,h,a.isFullyInitialized(),a.isFiltered());else{const o=pathPopFront(n),h=a.getNode().getImmediateChild(i);let u;if(pathIsEmpty(o))u=r;else{const e=c.getCompleteChild(i);u=null!=e?".priority"===pathGetBack(o)&&e.getChild(pathParent(o)).isEmpty()?e:e.updateChild(o,r):ChildrenNode.EMPTY_NODE}if(h.equals(u))l=t;else{l=viewCacheUpdateEventSnap(t,e.filter.updateChild(a.getNode(),i,u,o,c,s),a.isFullyInitialized(),e.filter.filtersNodes())}}}return l}function viewProcessorCacheHasChild(e,t){return e.eventCache.isCompleteForChild(t)}function viewProcessorApplyMerge(e,t,n){return n.foreach((e,n)=>{t=t.updateChild(e,n)}),t}function viewProcessorApplyServerMerge(e,t,n,r,i,o,s,a){if(t.serverCache.getNode().isEmpty()&&!t.serverCache.isFullyInitialized())return t;let l,h=t;l=pathIsEmpty(n)?r:new ImmutableTree(null).setTree(n,r);const c=t.serverCache.getNode();return l.children.inorderTraversal((n,r)=>{if(c.hasChild(n)){const l=viewProcessorApplyMerge(0,t.serverCache.getNode().getImmediateChild(n),r);h=viewProcessorApplyServerOverwrite(e,h,new Path(n),l,i,o,s,a)}}),l.children.inorderTraversal((n,r)=>{const l=!t.serverCache.isCompleteForChild(n)&&null===r.value;if(!c.hasChild(n)&&!l){const l=viewProcessorApplyMerge(0,t.serverCache.getNode().getImmediateChild(n),r);h=viewProcessorApplyServerOverwrite(e,h,new Path(n),l,i,o,s,a)}}),h}class View{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const n=this.query_._queryParams,r=new IndexedFilter(n.getIndex()),i=function queryParamsGetNodeFilter(e){return e.loadsAllData()?new IndexedFilter(e.getIndex()):e.hasLimit()?new LimitedFilter(e):new RangedFilter(e)}(n);this.processor_=function newViewProcessor(e){return{filter:e}}(i);const o=t.serverCache,s=t.eventCache,a=r.updateFullNode(ChildrenNode.EMPTY_NODE,o.getNode(),null),l=i.updateFullNode(ChildrenNode.EMPTY_NODE,s.getNode(),null),h=new CacheNode(a,o.isFullyInitialized(),r.filtersNodes()),c=new CacheNode(l,s.isFullyInitialized(),i.filtersNodes());this.viewCache_=newViewCache(c,h),this.eventGenerator_=new EventGenerator(this.query_)}get query(){return this.query_}}function viewGetCompleteServerCache(e,t){const n=viewCacheGetCompleteServerSnap(e.viewCache_);return n&&(e.query._queryParams.loadsAllData()||!pathIsEmpty(t)&&!n.getImmediateChild(pathGetFront(t)).isEmpty())?n.getChild(t):null}function viewIsEmpty(e){return 0===e.eventRegistrations_.length}function viewRemoveEventRegistration(e,t,n){const i=[];if(n){r(null==t,"A cancel should cancel all event registrations.");const o=e.query._path;e.eventRegistrations_.forEach(e=>{const t=e.createCancelEvent(n,o);t&&i.push(t)})}if(t){let n=[];for(let r=0;r<e.eventRegistrations_.length;++r){const i=e.eventRegistrations_[r];if(i.matches(t)){if(t.hasAnyCallback()){n=n.concat(e.eventRegistrations_.slice(r+1));break}}else n.push(i)}e.eventRegistrations_=n}else e.eventRegistrations_=[];return i}function viewApplyOperation(e,t,n,i){t.type===we.MERGE&&null!==t.source.queryId&&(r(viewCacheGetCompleteServerSnap(e.viewCache_),"We should always have a full cache before handling merges"),r(viewCacheGetCompleteEventSnap(e.viewCache_),"Missing event cache, even though we have a server cache"));const o=e.viewCache_,s=viewProcessorApplyOperation(e.processor_,o,t,n,i);return function viewProcessorAssertIndexed(e,t){r(t.eventCache.getNode().isIndexed(e.filter.getIndex()),"Event snap not indexed"),r(t.serverCache.getNode().isIndexed(e.filter.getIndex()),"Server snap not indexed")}(e.processor_,s.viewCache),r(s.viewCache.serverCache.isFullyInitialized()||!o.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),e.viewCache_=s.viewCache,viewGenerateEventsForChanges_(e,s.changes,s.viewCache.eventCache.getNode(),null)}function viewGenerateEventsForChanges_(e,t,n,r){const i=r?[r]:e.eventRegistrations_;return function eventGeneratorGenerateEventsForChanges(e,t,n,r){const i=[],o=[];return t.forEach(t=>{"child_changed"===t.type&&e.index_.indexedValueChanged(t.oldSnap,t.snapshotNode)&&o.push(function changeChildMoved(e,t){return{type:"child_moved",snapshotNode:t,childName:e}}(t.childName,t.snapshotNode))}),eventGeneratorGenerateEventsForType(e,i,"child_removed",t,r,n),eventGeneratorGenerateEventsForType(e,i,"child_added",t,r,n),eventGeneratorGenerateEventsForType(e,i,"child_moved",o,r,n),eventGeneratorGenerateEventsForType(e,i,"child_changed",t,r,n),eventGeneratorGenerateEventsForType(e,i,"value",t,r,n),i}(e.eventGenerator_,t,n,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ee,Ie;class SyncPoint{constructor(){this.views=new Map}}function syncPointApplyOperation(e,t,n,i){const o=t.source.queryId;if(null!==o){const s=e.views.get(o);return r(null!=s,"SyncTree gave us an op for an invalid query."),viewApplyOperation(s,t,n,i)}{let r=[];for(const o of e.views.values())r=r.concat(viewApplyOperation(o,t,n,i));return r}}function syncPointGetView(e,t,n,r,i){const o=t._queryIdentifier,s=e.views.get(o);if(!s){let e=writeTreeRefCalcCompleteEventCache(n,i?r:null),o=!1;e?o=!0:r instanceof ChildrenNode?(e=writeTreeRefCalcCompleteEventChildren(n,r),o=!1):(e=ChildrenNode.EMPTY_NODE,o=!1);const s=newViewCache(new CacheNode(e,o,!1),new CacheNode(r,i,!1));return new View(t,s)}return s}function syncPointAddEventRegistration(e,t,n,r,i,o){const s=syncPointGetView(e,t,r,i,o);return e.views.has(t._queryIdentifier)||e.views.set(t._queryIdentifier,s),function viewAddEventRegistration(e,t){e.eventRegistrations_.push(t)}(s,n),function viewGetInitialEvents(e,t){const n=e.viewCache_.eventCache,r=[];n.getNode().isLeafNode()||n.getNode().forEachChild(_e,(e,t)=>{r.push(changeChildAdded(e,t))});return n.isFullyInitialized()&&r.push(changeValue(n.getNode())),viewGenerateEventsForChanges_(e,r,n.getNode(),t)}(s,n)}function syncPointRemoveEventRegistration(e,t,n,i){const o=t._queryIdentifier,s=[];let a=[];const l=syncPointHasCompleteView(e);if("default"===o)for(const[r,h]of e.views.entries())a=a.concat(viewRemoveEventRegistration(h,n,i)),viewIsEmpty(h)&&(e.views.delete(r),h.query._queryParams.loadsAllData()||s.push(h.query));else{const t=e.views.get(o);t&&(a=a.concat(viewRemoveEventRegistration(t,n,i)),viewIsEmpty(t)&&(e.views.delete(o),t.query._queryParams.loadsAllData()||s.push(t.query)))}return l&&!syncPointHasCompleteView(e)&&s.push(new(function syncPointGetReferenceConstructor(){return r(Ee,"Reference.ts has not been loaded"),Ee}())(t._repo,t._path)),{removed:s,events:a}}function syncPointGetQueryViews(e){const t=[];for(const n of e.views.values())n.query._queryParams.loadsAllData()||t.push(n);return t}function syncPointGetCompleteServerCache(e,t){let n=null;for(const r of e.views.values())n=n||viewGetCompleteServerCache(r,t);return n}function syncPointViewForQuery(e,t){if(t._queryParams.loadsAllData())return syncPointGetCompleteView(e);{const n=t._queryIdentifier;return e.views.get(n)}}function syncPointViewExistsForQuery(e,t){return null!=syncPointViewForQuery(e,t)}function syncPointHasCompleteView(e){return null!=syncPointGetCompleteView(e)}function syncPointGetCompleteView(e){for(const t of e.views.values())if(t.query._queryParams.loadsAllData())return t;return null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ne=1;class SyncTree{constructor(e){this.listenProvider_=e,this.syncPointTree_=new ImmutableTree(null),this.pendingWriteTree_=function newWriteTree(){return{visibleWrites:CompoundWrite.empty(),allWrites:[],lastWriteId:-1}}(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function syncTreeApplyUserOverwrite(e,t,n,i,o){return function writeTreeAddOverwrite(e,t,n,i,o){r(i>e.lastWriteId,"Stacking an older write on top of newer ones"),void 0===o&&(o=!0),e.allWrites.push({path:t,snap:n,writeId:i,visible:o}),o&&(e.visibleWrites=compoundWriteAddWrite(e.visibleWrites,t,n)),e.lastWriteId=i}(e.pendingWriteTree_,t,n,i,o),o?syncTreeApplyOperationToSyncPoints_(e,new Overwrite({fromUser:!0,fromServer:!1,queryId:null,tagged:!1},t,n)):[]}function syncTreeApplyUserMerge(e,t,n,i){!function writeTreeAddMerge(e,t,n,i){r(i>e.lastWriteId,"Stacking an older merge on top of newer ones"),e.allWrites.push({path:t,children:n,writeId:i,visible:!0}),e.visibleWrites=compoundWriteAddWrites(e.visibleWrites,t,n),e.lastWriteId=i}(e.pendingWriteTree_,t,n,i);const o=ImmutableTree.fromObject(n);return syncTreeApplyOperationToSyncPoints_(e,new Merge({fromUser:!0,fromServer:!1,queryId:null,tagged:!1},t,o))}function syncTreeAckUserWrite(e,t,n=!1){const r=function writeTreeGetWrite(e,t){for(let n=0;n<e.allWrites.length;n++){const r=e.allWrites[n];if(r.writeId===t)return r}return null}(e.pendingWriteTree_,t);if(writeTreeRemoveWrite(e.pendingWriteTree_,t)){let t=new ImmutableTree(null);return null!=r.snap?t=t.set(newEmptyPath(),!0):each(r.children,e=>{t=t.set(new Path(e),!0)}),syncTreeApplyOperationToSyncPoints_(e,new AckUserWrite(r.path,t,n))}return[]}function syncTreeApplyServerOverwrite(e,t,n){return syncTreeApplyOperationToSyncPoints_(e,new Overwrite({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t,n))}function syncTreeRemoveEventRegistration(e,t,n,r,i=!1){const o=t._path,s=e.syncPointTree_.get(o);let a=[];if(s&&("default"===t._queryIdentifier||syncPointViewExistsForQuery(s,t))){const l=syncPointRemoveEventRegistration(s,t,n,r);(function syncPointIsEmpty(e){return 0===e.views.size})(s)&&(e.syncPointTree_=e.syncPointTree_.remove(o));const h=l.removed;if(a=l.events,!i){const n=-1!==h.findIndex(e=>e._queryParams.loadsAllData()),i=e.syncPointTree_.findOnPath(o,(e,t)=>syncPointHasCompleteView(t));if(n&&!i){const t=e.syncPointTree_.subtree(o);if(!t.isEmpty()){const n=function syncTreeCollectDistinctViewsForSubTree_(e){return e.fold((e,t,n)=>{if(t&&syncPointHasCompleteView(t)){return[syncPointGetCompleteView(t)]}{let e=[];return t&&(e=syncPointGetQueryViews(t)),each(n,(t,n)=>{e=e.concat(n)}),e}})}(t);for(let t=0;t<n.length;++t){const r=n[t],i=r.query,o=syncTreeCreateListenerForView_(e,r);e.listenProvider_.startListening(syncTreeQueryForListening_(i),syncTreeTagForQuery(e,i),o.hashFn,o.onComplete)}}}if(!i&&h.length>0&&!r)if(n){const n=null;e.listenProvider_.stopListening(syncTreeQueryForListening_(t),n)}else h.forEach(t=>{const n=e.queryToTagMap.get(syncTreeMakeQueryKey_(t));e.listenProvider_.stopListening(syncTreeQueryForListening_(t),n)})}!function syncTreeRemoveTags_(e,t){for(let n=0;n<t.length;++n){const r=t[n];if(!r._queryParams.loadsAllData()){const t=syncTreeMakeQueryKey_(r),n=e.queryToTagMap.get(t);e.queryToTagMap.delete(t),e.tagToQueryMap.delete(n)}}}(e,h)}return a}function syncTreeApplyTaggedQueryOverwrite(e,t,n,r){const i=syncTreeQueryKeyForTag_(e,r);if(null!=i){const r=syncTreeParseQueryKey_(i),o=r.path,s=r.queryId,a=newRelativePath(o,t);return syncTreeApplyTaggedOperation_(e,o,new Overwrite(newOperationSourceServerTaggedQuery(s),a,n))}return[]}function syncTreeAddEventRegistration(e,t,n,i=!1){const o=t._path;let s=null,a=!1;e.syncPointTree_.foreachOnPath(o,(e,t)=>{const n=newRelativePath(e,o);s=s||syncPointGetCompleteServerCache(t,n),a=a||syncPointHasCompleteView(t)});let l,h=e.syncPointTree_.get(o);if(h?(a=a||syncPointHasCompleteView(h),s=s||syncPointGetCompleteServerCache(h,newEmptyPath())):(h=new SyncPoint,e.syncPointTree_=e.syncPointTree_.set(o,h)),null!=s)l=!0;else{l=!1,s=ChildrenNode.EMPTY_NODE;e.syncPointTree_.subtree(o).foreachChild((e,t)=>{const n=syncPointGetCompleteServerCache(t,newEmptyPath());n&&(s=s.updateImmediateChild(e,n))})}const c=syncPointViewExistsForQuery(h,t);if(!c&&!t._queryParams.loadsAllData()){const n=syncTreeMakeQueryKey_(t);r(!e.queryToTagMap.has(n),"View does not exist, but we have a tag");const i=function syncTreeGetNextQueryTag_(){return Ne++}();e.queryToTagMap.set(n,i),e.tagToQueryMap.set(i,n)}let u=syncPointAddEventRegistration(h,t,n,writeTreeChildWrites(e.pendingWriteTree_,o),s,l);if(!c&&!a&&!i){const n=syncPointViewForQuery(h,t);u=u.concat(function syncTreeSetupListener_(e,t,n){const i=t._path,o=syncTreeTagForQuery(e,t),s=syncTreeCreateListenerForView_(e,n),a=e.listenProvider_.startListening(syncTreeQueryForListening_(t),o,s.hashFn,s.onComplete),l=e.syncPointTree_.subtree(i);if(o)r(!syncPointHasCompleteView(l.value),"If we're adding a query, it shouldn't be shadowed");else{const t=l.fold((e,t,n)=>{if(!pathIsEmpty(e)&&t&&syncPointHasCompleteView(t))return[syncPointGetCompleteView(t).query];{let e=[];return t&&(e=e.concat(syncPointGetQueryViews(t).map(e=>e.query))),each(n,(t,n)=>{e=e.concat(n)}),e}});for(let n=0;n<t.length;++n){const r=t[n];e.listenProvider_.stopListening(syncTreeQueryForListening_(r),syncTreeTagForQuery(e,r))}}return a}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t,n))}return u}function syncTreeCalcCompleteEventCache(e,t,n){const r=e.pendingWriteTree_,i=e.syncPointTree_.findOnPath(t,(e,n)=>{const r=syncPointGetCompleteServerCache(n,newRelativePath(e,t));if(r)return r});return writeTreeCalcCompleteEventCache(r,t,i,n,!0)}function syncTreeGetServerValue(e,t){const n=t._path;let r=null;e.syncPointTree_.foreachOnPath(n,(e,t)=>{const i=newRelativePath(e,n);r=r||syncPointGetCompleteServerCache(t,i)});let i=e.syncPointTree_.get(n);i?r=r||syncPointGetCompleteServerCache(i,newEmptyPath()):(i=new SyncPoint,e.syncPointTree_=e.syncPointTree_.set(n,i));const o=null!=r,s=o?new CacheNode(r,!0,!1):null;return function viewGetCompleteNode(e){return viewCacheGetCompleteEventSnap(e.viewCache_)}(syncPointGetView(i,t,writeTreeChildWrites(e.pendingWriteTree_,t._path),o?s.getNode():ChildrenNode.EMPTY_NODE,o))}function syncTreeApplyOperationToSyncPoints_(e,t){return syncTreeApplyOperationHelper_(t,e.syncPointTree_,null,writeTreeChildWrites(e.pendingWriteTree_,newEmptyPath()))}function syncTreeApplyOperationHelper_(e,t,n,r){if(pathIsEmpty(e.path))return syncTreeApplyOperationDescendantsHelper_(e,t,n,r);{const i=t.get(newEmptyPath());null==n&&null!=i&&(n=syncPointGetCompleteServerCache(i,newEmptyPath()));let o=[];const s=pathGetFront(e.path),a=e.operationForChild(s),l=t.children.get(s);if(l&&a){const e=n?n.getImmediateChild(s):null,t=writeTreeRefChild(r,s);o=o.concat(syncTreeApplyOperationHelper_(a,l,e,t))}return i&&(o=o.concat(syncPointApplyOperation(i,e,r,n))),o}}function syncTreeApplyOperationDescendantsHelper_(e,t,n,r){const i=t.get(newEmptyPath());null==n&&null!=i&&(n=syncPointGetCompleteServerCache(i,newEmptyPath()));let o=[];return t.children.inorderTraversal((t,i)=>{const s=n?n.getImmediateChild(t):null,a=writeTreeRefChild(r,t),l=e.operationForChild(t);l&&(o=o.concat(syncTreeApplyOperationDescendantsHelper_(l,i,s,a)))}),i&&(o=o.concat(syncPointApplyOperation(i,e,r,n))),o}function syncTreeCreateListenerForView_(e,t){const n=t.query,r=syncTreeTagForQuery(e,n);return{hashFn:()=>{const e=function viewGetServerCache(e){return e.viewCache_.serverCache.getNode()}(t)||ChildrenNode.EMPTY_NODE;return e.hash()},onComplete:t=>{if("ok"===t)return r?function syncTreeApplyTaggedListenComplete(e,t,n){const r=syncTreeQueryKeyForTag_(e,n);if(r){const n=syncTreeParseQueryKey_(r),i=n.path,o=n.queryId,s=newRelativePath(i,t);return syncTreeApplyTaggedOperation_(e,i,new ListenComplete(newOperationSourceServerTaggedQuery(o),s))}return[]}(e,n._path,r):function syncTreeApplyListenComplete(e,t){return syncTreeApplyOperationToSyncPoints_(e,new ListenComplete({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t))}(e,n._path);{const r=function errorForServerCode(e,t){let n="Unknown Error";"too_big"===e?n="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"===e?n="Client doesn't have permission to access the desired data.":"unavailable"===e&&(n="The service is unavailable");const r=new Error(e+" at "+t._path.toString()+": "+n);return r.code=e.toUpperCase(),r}(t,n);return syncTreeRemoveEventRegistration(e,n,null,r)}}}}function syncTreeTagForQuery(e,t){const n=syncTreeMakeQueryKey_(t);return e.queryToTagMap.get(n)}function syncTreeMakeQueryKey_(e){return e._path.toString()+"$"+e._queryIdentifier}function syncTreeQueryKeyForTag_(e,t){return e.tagToQueryMap.get(t)}function syncTreeParseQueryKey_(e){const t=e.indexOf("$");return r(-1!==t&&t<e.length-1,"Bad queryKey."),{queryId:e.substr(t+1),path:new Path(e.substr(0,t))}}function syncTreeApplyTaggedOperation_(e,t,n){const i=e.syncPointTree_.get(t);r(i,"Missing sync point for query tag that we're tracking");return syncPointApplyOperation(i,n,writeTreeChildWrites(e.pendingWriteTree_,t),null)}function syncTreeQueryForListening_(e){return e._queryParams.loadsAllData()&&!e._queryParams.isDefault()?new(function syncTreeGetReferenceConstructor(){return r(Ie,"Reference.ts has not been loaded"),Ie}())(e._repo,e._path):e}class ExistingValueProvider{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new ExistingValueProvider(t)}node(){return this.node_}}class DeferredValueProvider{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=pathChild(this.path_,e);return new DeferredValueProvider(this.syncTree_,t)}node(){return syncTreeCalcCompleteEventCache(this.syncTree_,this.path_)}}const resolveDeferredLeafValue=function(e,t,n){return e&&"object"==typeof e?(r(".sv"in e,"Unexpected leaf node or priority contents"),"string"==typeof e[".sv"]?resolveScalarDeferredValue(e[".sv"],t,n):"object"==typeof e[".sv"]?resolveComplexDeferredValue(e[".sv"],t):void r(!1,"Unexpected server value: "+JSON.stringify(e,null,2))):e},resolveScalarDeferredValue=function(e,t,n){if("timestamp"===e)return n.timestamp;r(!1,"Unexpected server value: "+e)},resolveComplexDeferredValue=function(e,t,n){e.hasOwnProperty("increment")||r(!1,"Unexpected server value: "+JSON.stringify(e,null,2));const i=e.increment;"number"!=typeof i&&r(!1,"Unexpected increment value: "+i);const o=t.node();if(r(null!=o,"Expected ChildrenNode.EMPTY_NODE for nulls"),!o.isLeafNode())return i;const s=o.getValue();return"number"!=typeof s?i:s+i},resolveDeferredValueTree=function(e,t,n,r){return resolveDeferredValue(t,new DeferredValueProvider(n,e),r)},resolveDeferredValueSnapshot=function(e,t,n){return resolveDeferredValue(e,new ExistingValueProvider(t),n)};function resolveDeferredValue(e,t,n){const r=e.getPriority().val(),i=resolveDeferredLeafValue(r,t.getImmediateChild(".priority"),n);let o;if(e.isLeafNode()){const r=e,o=resolveDeferredLeafValue(r.getValue(),t,n);return o!==r.getValue()||i!==r.getPriority().val()?new LeafNode(o,nodeFromJSON(i)):e}{const r=e;return o=r,i!==r.getPriority().val()&&(o=o.updatePriority(new LeafNode(i))),r.forEachChild(_e,(e,r)=>{const i=resolveDeferredValue(r,t.getImmediateChild(e),n);i!==r&&(o=o.updateImmediateChild(e,i))}),o}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tree{constructor(e="",t=null,n={children:{},childCount:0}){this.name=e,this.parent=t,this.node=n}}function treeSubTree(e,t){let n=t instanceof Path?t:new Path(t),r=e,i=pathGetFront(n);for(;null!==i;){const e=w(r.node.children,i)||{children:{},childCount:0};r=new Tree(i,r,e),n=pathPopFront(n),i=pathGetFront(n)}return r}function treeGetValue(e){return e.node.value}function treeSetValue(e,t){e.node.value=t,treeUpdateParents(e)}function treeHasChildren(e){return e.node.childCount>0}function treeForEachChild(e,t){each(e.node.children,(n,r)=>{t(new Tree(n,e,r))})}function treeForEachDescendant(e,t,n,r){n&&t(e),treeForEachChild(e,e=>{treeForEachDescendant(e,t,!0)})}function treeGetPath(e){return new Path(null===e.parent?e.name:treeGetPath(e.parent)+"/"+e.name)}function treeUpdateParents(e){null!==e.parent&&function treeUpdateChild(e,t,n){const r=function treeIsEmpty(e){return void 0===treeGetValue(e)&&!treeHasChildren(e)}(n),i=C(e.node.children,t);r&&i?(delete e.node.children[t],e.node.childCount--,treeUpdateParents(e)):r||i||(e.node.children[t]=n.node,e.node.childCount++,treeUpdateParents(e))}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e.parent,e.name,e)}const be=/[\[\].#$\/\u0000-\u001F\u007F]/,ke=/[\[\].#$\u0000-\u001F\u007F]/,Re=10485760,isValidKey=function(e){return"string"==typeof e&&0!==e.length&&!be.test(e)},isValidPathString=function(e){return"string"==typeof e&&0!==e.length&&!ke.test(e)},isValidPriority=function(e){return null===e||"string"==typeof e||"number"==typeof e&&!isInvalidJSONNumber(e)||e&&"object"==typeof e&&C(e,".sv")},validateFirebaseDataArg=function(e,t,n,r){r&&void 0===t||validateFirebaseData(s(e,"value"),t,n)},validateFirebaseData=function(e,t,n){const r=n instanceof Path?new ValidationPath(n,e):n;if(void 0===t)throw new Error(e+"contains undefined "+validationPathToErrorString(r));if("function"==typeof t)throw new Error(e+"contains a function "+validationPathToErrorString(r)+" with contents = "+t.toString());if(isInvalidJSONNumber(t))throw new Error(e+"contains "+t.toString()+" "+validationPathToErrorString(r));if("string"==typeof t&&t.length>Re/3&&k(t)>Re)throw new Error(e+"contains a string greater than "+Re+" utf8 bytes "+validationPathToErrorString(r)+" ('"+t.substring(0,50)+"...')");if(t&&"object"==typeof t){let n=!1,i=!1;if(each(t,(t,o)=>{if(".value"===t)n=!0;else if(".priority"!==t&&".sv"!==t&&(i=!0,!isValidKey(t)))throw new Error(e+" contains an invalid key ("+t+") "+validationPathToErrorString(r)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');!function validationPathPush(e,t){e.parts_.length>0&&(e.byteLength_+=1),e.parts_.push(t),e.byteLength_+=k(t),validationPathCheckValid(e)}(r,t),validateFirebaseData(e,o,r),function validationPathPop(e){const t=e.parts_.pop();e.byteLength_-=k(t),e.parts_.length>0&&(e.byteLength_-=1)}(r)}),n&&i)throw new Error(e+' contains ".value" child '+validationPathToErrorString(r)+" in addition to actual children.")}},validateFirebaseMergeDataArg=function(e,t,n,r){const i=s(e,"values");if(!t||"object"!=typeof t||Array.isArray(t))throw new Error(i+" must be an object containing the children to replace.");const o=[];each(t,(e,t)=>{const r=new Path(e);if(validateFirebaseData(i,t,pathChild(n,r)),".priority"===pathGetBack(r)&&!isValidPriority(t))throw new Error(i+"contains an invalid value for '"+r.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");o.push(r)}),function(e,t){let n,r;for(n=0;n<t.length;n++){r=t[n];const i=pathSlice(r);for(let t=0;t<i.length;t++)if(".priority"===i[t]&&t===i.length-1);else if(!isValidKey(i[t]))throw new Error(e+"contains an invalid key ("+i[t]+") in path "+r.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"')}t.sort(pathCompare);let i=null;for(n=0;n<t.length;n++){if(r=t[n],null!==i&&pathContains(i,r))throw new Error(e+"contains a path "+i.toString()+" that is ancestor of another path "+r.toString());i=r}}(i,o)},validatePriority=function(e,t,n){if(isInvalidJSONNumber(t))throw new Error(s(e,"priority")+"is "+t.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!isValidPriority(t))throw new Error(s(e,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},validateKey=function(e,t,n,r){if(void 0!==n&&!isValidKey(n))throw new Error(s(e,t)+'was an invalid key = "'+n+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").')},validatePathString=function(e,t,n,r){if(!(r&&void 0===n||isValidPathString(n)))throw new Error(s(e,t)+'was an invalid path = "'+n+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"')},validateWritablePath=function(e,t){if(".info"===pathGetFront(t))throw new Error(e+" failed = Can't modify data under /.info/")},validateUrl=function(e,t){const n=t.path.toString();if("string"!=typeof t.repoInfo.host||0===t.repoInfo.host.length||!isValidKey(t.repoInfo.namespace)&&"localhost"!==t.repoInfo.host.split(":")[0]||0!==n.length&&!function(e){return e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),isValidPathString(e)}(n))throw new Error(s(e,"url")+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".')};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class EventQueue{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function eventQueueQueueEvents(e,t){let n=null;for(let r=0;r<t.length;r++){const i=t[r],o=i.getPath();null===n||pathEquals(o,n.path)||(e.eventLists_.push(n),n=null),null===n&&(n={events:[],path:o}),n.events.push(i)}n&&e.eventLists_.push(n)}function eventQueueRaiseEventsAtPath(e,t,n){eventQueueQueueEvents(e,n),eventQueueRaiseQueuedEventsMatchingPredicate(e,e=>pathEquals(e,t))}function eventQueueRaiseEventsForChangedPath(e,t,n){eventQueueQueueEvents(e,n),eventQueueRaiseQueuedEventsMatchingPredicate(e,e=>pathContains(e,t)||pathContains(t,e))}function eventQueueRaiseQueuedEventsMatchingPredicate(e,t){e.recursionDepth_++;let n=!0;for(let r=0;r<e.eventLists_.length;r++){const i=e.eventLists_[r];if(i){t(i.path)?(eventListRaise(e.eventLists_[r]),e.eventLists_[r]=null):n=!1}}n&&(e.eventLists_=[]),e.recursionDepth_--}function eventListRaise(e){for(let t=0;t<e.events.length;t++){const n=e.events[t];if(null!==n){e.events[t]=null;const r=n.getEventRunner();z&&log("event: "+n.toString()),exceptionGuard(r)}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xe="repo_interrupt";class Repo{constructor(e,t,n,r){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=n,this.appCheckProvider_=r,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new EventQueue,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=newSparseSnapshotTree(),this.transactionQueueTree_=new Tree,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function repoStart(e,t,n){if(e.stats_=statsManagerGetCollection(e.repoInfo_),e.forceRestClient_||("object"==typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0)e.server_=new ReadonlyRestClient(e.repoInfo_,(t,n,r,i)=>{repoOnDataUpdate(e,t,n,r,i)},e.authTokenProvider_,e.appCheckProvider_),setTimeout(()=>repoOnConnectStatus(e,!0),0);else{if(null!=n){if("object"!=typeof n)throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{_(n)}catch(r){throw new Error("Invalid authOverride provided: "+r)}}e.persistentConnection_=new PersistentConnection(e.repoInfo_,t,(t,n,r,i)=>{repoOnDataUpdate(e,t,n,r,i)},t=>{repoOnConnectStatus(e,t)},t=>{!function repoOnServerInfoUpdate(e,t){each(t,(t,n)=>{repoUpdateInfo(e,t,n)})}(e,t)},e.authTokenProvider_,e.appCheckProvider_,n),e.server_=e.persistentConnection_}e.authTokenProvider_.addTokenChangeListener(t=>{e.server_.refreshAuthToken(t)}),e.appCheckProvider_.addTokenChangeListener(t=>{e.server_.refreshAppCheckToken(t.token)}),e.statsReporter_=function statsManagerGetOrCreateReporter(e,t){const n=e.toString();return ie[n]||(ie[n]=t()),ie[n]}(e.repoInfo_,()=>new StatsReporter(e.stats_,e.server_)),e.infoData_=new SnapshotHolder,e.infoSyncTree_=new SyncTree({startListening:(t,n,r,i)=>{let o=[];const s=e.infoData_.getNode(t._path);return s.isEmpty()||(o=syncTreeApplyServerOverwrite(e.infoSyncTree_,t._path,s),setTimeout(()=>{i("ok")},0)),o},stopListening:()=>{}}),repoUpdateInfo(e,"connected",!1),e.serverSyncTree_=new SyncTree({startListening:(t,n,r,i)=>(e.server_.listen(t,r,n,(n,r)=>{const o=i(n,r);eventQueueRaiseEventsForChangedPath(e.eventQueue_,t._path,o)}),[]),stopListening:(t,n)=>{e.server_.unlisten(t,n)}})}function repoServerTime(e){const t=e.infoData_.getNode(new Path(".info/serverTimeOffset")).val()||0;return(new Date).getTime()+t}function repoGenerateServerValues(e){return(t=(t={timestamp:repoServerTime(e)})||{}).timestamp=t.timestamp||(new Date).getTime(),t;var t}function repoOnDataUpdate(e,t,n,r,i){e.dataUpdateCount++;const o=new Path(t);n=e.interceptServerDataCallback_?e.interceptServerDataCallback_(t,n):n;let s=[];if(i)if(r){const t=S(n,e=>nodeFromJSON(e));s=function syncTreeApplyTaggedQueryMerge(e,t,n,r){const i=syncTreeQueryKeyForTag_(e,r);if(i){const r=syncTreeParseQueryKey_(i),o=r.path,s=r.queryId,a=newRelativePath(o,t),l=ImmutableTree.fromObject(n);return syncTreeApplyTaggedOperation_(e,o,new Merge(newOperationSourceServerTaggedQuery(s),a,l))}return[]}(e.serverSyncTree_,o,t,i)}else{const t=nodeFromJSON(n);s=syncTreeApplyTaggedQueryOverwrite(e.serverSyncTree_,o,t,i)}else if(r){const t=S(n,e=>nodeFromJSON(e));s=function syncTreeApplyServerMerge(e,t,n){const r=ImmutableTree.fromObject(n);return syncTreeApplyOperationToSyncPoints_(e,new Merge({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t,r))}(e.serverSyncTree_,o,t)}else{const t=nodeFromJSON(n);s=syncTreeApplyServerOverwrite(e.serverSyncTree_,o,t)}let a=o;s.length>0&&(a=repoRerunTransactions(e,o)),eventQueueRaiseEventsForChangedPath(e.eventQueue_,a,s)}function repoOnConnectStatus(e,t){repoUpdateInfo(e,"connected",t),!1===t&&function repoRunOnDisconnectEvents(e){repoLog(e,"onDisconnectEvents");const t=repoGenerateServerValues(e),n=newSparseSnapshotTree();sparseSnapshotTreeForEachTree(e.onDisconnect_,newEmptyPath(),(r,i)=>{const o=resolveDeferredValueTree(r,i,e.serverSyncTree_,t);sparseSnapshotTreeRemember(n,r,o)});let r=[];sparseSnapshotTreeForEachTree(n,newEmptyPath(),(t,n)=>{r=r.concat(syncTreeApplyServerOverwrite(e.serverSyncTree_,t,n));const i=repoAbortTransactions(e,t);repoRerunTransactions(e,i)}),e.onDisconnect_=newSparseSnapshotTree(),eventQueueRaiseEventsForChangedPath(e.eventQueue_,newEmptyPath(),r)}(e)}function repoUpdateInfo(e,t,n){const r=new Path("/.info/"+t),i=nodeFromJSON(n);e.infoData_.updateSnapshot(r,i);const o=syncTreeApplyServerOverwrite(e.infoSyncTree_,r,i);eventQueueRaiseEventsForChangedPath(e.eventQueue_,r,o)}function repoGetNextWriteId(e){return e.nextWriteId_++}function repoSetWithPriority(e,t,n,r,i){repoLog(e,"set",{path:t.toString(),value:n,priority:r});const o=repoGenerateServerValues(e),s=nodeFromJSON(n,r),a=syncTreeCalcCompleteEventCache(e.serverSyncTree_,t),l=resolveDeferredValueSnapshot(s,a,o),h=repoGetNextWriteId(e),c=syncTreeApplyUserOverwrite(e.serverSyncTree_,t,l,h,!0);eventQueueQueueEvents(e.eventQueue_,c),e.server_.put(t.toString(),s.val(!0),(n,r)=>{const o="ok"===n;o||warn("set at "+t+" failed: "+n);const s=syncTreeAckUserWrite(e.serverSyncTree_,h,!o);eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,s),repoCallOnCompleteCallback(e,i,n,r)});const u=repoAbortTransactions(e,t);repoRerunTransactions(e,u),eventQueueRaiseEventsForChangedPath(e.eventQueue_,u,[])}function repoOnDisconnectCancel(e,t,n){e.server_.onDisconnectCancel(t.toString(),(r,i)=>{"ok"===r&&sparseSnapshotTreeForget(e.onDisconnect_,t),repoCallOnCompleteCallback(e,n,r,i)})}function repoOnDisconnectSet(e,t,n,r){const i=nodeFromJSON(n);e.server_.onDisconnectPut(t.toString(),i.val(!0),(n,o)=>{"ok"===n&&sparseSnapshotTreeRemember(e.onDisconnect_,t,i),repoCallOnCompleteCallback(e,r,n,o)})}function repoRemoveEventCallbackForQuery(e,t,n){let r;r=".info"===pathGetFront(t._path)?syncTreeRemoveEventRegistration(e.infoSyncTree_,t,n):syncTreeRemoveEventRegistration(e.serverSyncTree_,t,n),eventQueueRaiseEventsAtPath(e.eventQueue_,t._path,r)}function repoInterrupt(e){e.persistentConnection_&&e.persistentConnection_.interrupt(xe)}function repoLog(e,...t){let n="";e.persistentConnection_&&(n=e.persistentConnection_.id+":"),log(n,...t)}function repoCallOnCompleteCallback(e,t,n,r){t&&exceptionGuard(()=>{if("ok"===n)t(null);else{const e=(n||"error").toUpperCase();let i=e;r&&(i+=": "+r);const o=new Error(i);o.code=e,t(o)}})}function repoGetLatestState(e,t,n){return syncTreeCalcCompleteEventCache(e.serverSyncTree_,t,n)||ChildrenNode.EMPTY_NODE}function repoSendReadyTransactions(e,t=e.transactionQueueTree_){if(t||repoPruneCompletedTransactionsBelowNode(e,t),treeGetValue(t)){const n=repoBuildTransactionQueue(e,t);r(n.length>0,"Sending zero length transaction queue");n.every(e=>0===e.status)&&function repoSendTransactionQueue(e,t,n){const i=n.map(e=>e.currentWriteId),o=repoGetLatestState(e,t,i);let s=o;const a=o.hash();for(let c=0;c<n.length;c++){const e=n[c];r(0===e.status,"tryToSendTransactionQueue_: items in queue should all be run."),e.status=1,e.retryCount++;const i=newRelativePath(t,e.path);s=s.updateChild(i,e.currentOutputSnapshotRaw)}const l=s.val(!0),h=t;e.server_.put(h.toString(),l,r=>{repoLog(e,"transaction put response",{path:h.toString(),status:r});let i=[];if("ok"===r){const r=[];for(let t=0;t<n.length;t++)n[t].status=2,i=i.concat(syncTreeAckUserWrite(e.serverSyncTree_,n[t].currentWriteId)),n[t].onComplete&&r.push(()=>n[t].onComplete(null,!0,n[t].currentOutputSnapshotResolved)),n[t].unwatcher();repoPruneCompletedTransactionsBelowNode(e,treeSubTree(e.transactionQueueTree_,t)),repoSendReadyTransactions(e,e.transactionQueueTree_),eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,i);for(let e=0;e<r.length;e++)exceptionGuard(r[e])}else{if("datastale"===r)for(let e=0;e<n.length;e++)3===n[e].status?n[e].status=4:n[e].status=0;else{warn("transaction at "+h.toString()+" failed: "+r);for(let e=0;e<n.length;e++)n[e].status=4,n[e].abortReason=r}repoRerunTransactions(e,t)}},a)}(e,treeGetPath(t),n)}else treeHasChildren(t)&&treeForEachChild(t,t=>{repoSendReadyTransactions(e,t)})}function repoRerunTransactions(e,t){const n=repoGetAncestorTransactionNode(e,t),i=treeGetPath(n);return function repoRerunTransactionQueue(e,t,n){if(0===t.length)return;const i=[];let o=[];const s=t.filter(e=>0===e.status),a=s.map(e=>e.currentWriteId);for(let l=0;l<t.length;l++){const s=t[l],h=newRelativePath(n,s.path);let c,u=!1;if(r(null!==h,"rerunTransactionsUnderNode_: relativePath should not be null."),4===s.status)u=!0,c=s.abortReason,o=o.concat(syncTreeAckUserWrite(e.serverSyncTree_,s.currentWriteId,!0));else if(0===s.status)if(s.retryCount>=25)u=!0,c="maxretry",o=o.concat(syncTreeAckUserWrite(e.serverSyncTree_,s.currentWriteId,!0));else{const n=repoGetLatestState(e,s.path,a);s.currentInputSnapshot=n;const r=t[l].update(n.val());if(void 0!==r){validateFirebaseData("transaction failed: Data returned ",r,s.path);let t=nodeFromJSON(r);"object"==typeof r&&null!=r&&C(r,".priority")||(t=t.updatePriority(n.getPriority()));const i=s.currentWriteId,l=repoGenerateServerValues(e),h=resolveDeferredValueSnapshot(t,n,l);s.currentOutputSnapshotRaw=t,s.currentOutputSnapshotResolved=h,s.currentWriteId=repoGetNextWriteId(e),a.splice(a.indexOf(i),1),o=o.concat(syncTreeApplyUserOverwrite(e.serverSyncTree_,s.path,h,s.currentWriteId,s.applyLocally)),o=o.concat(syncTreeAckUserWrite(e.serverSyncTree_,i,!0))}else u=!0,c="nodata",o=o.concat(syncTreeAckUserWrite(e.serverSyncTree_,s.currentWriteId,!0))}eventQueueRaiseEventsForChangedPath(e.eventQueue_,n,o),o=[],u&&(t[l].status=2,function(e){setTimeout(e,Math.floor(0))}(t[l].unwatcher),t[l].onComplete&&("nodata"===c?i.push(()=>t[l].onComplete(null,!1,t[l].currentInputSnapshot)):i.push(()=>t[l].onComplete(new Error(c),!1,null))))}repoPruneCompletedTransactionsBelowNode(e,e.transactionQueueTree_);for(let r=0;r<i.length;r++)exceptionGuard(i[r]);repoSendReadyTransactions(e,e.transactionQueueTree_)}(e,repoBuildTransactionQueue(e,n),i),i}function repoGetAncestorTransactionNode(e,t){let n,r=e.transactionQueueTree_;for(n=pathGetFront(t);null!==n&&void 0===treeGetValue(r);)r=treeSubTree(r,n),n=pathGetFront(t=pathPopFront(t));return r}function repoBuildTransactionQueue(e,t){const n=[];return repoAggregateTransactionQueuesForNode(e,t,n),n.sort((e,t)=>e.order-t.order),n}function repoAggregateTransactionQueuesForNode(e,t,n){const r=treeGetValue(t);if(r)for(let i=0;i<r.length;i++)n.push(r[i]);treeForEachChild(t,t=>{repoAggregateTransactionQueuesForNode(e,t,n)})}function repoPruneCompletedTransactionsBelowNode(e,t){const n=treeGetValue(t);if(n){let e=0;for(let t=0;t<n.length;t++)2!==n[t].status&&(n[e]=n[t],e++);n.length=e,treeSetValue(t,n.length>0?n:void 0)}treeForEachChild(t,t=>{repoPruneCompletedTransactionsBelowNode(e,t)})}function repoAbortTransactions(e,t){const n=treeGetPath(repoGetAncestorTransactionNode(e,t)),r=treeSubTree(e.transactionQueueTree_,t);return function treeForEachAncestor(e,t,n){let r=e.parent;for(;null!==r;){if(t(r))return!0;r=r.parent}return!1}(r,t=>{repoAbortTransactionsOnNode(e,t)}),repoAbortTransactionsOnNode(e,r),treeForEachDescendant(r,t=>{repoAbortTransactionsOnNode(e,t)}),n}function repoAbortTransactionsOnNode(e,t){const n=treeGetValue(t);if(n){const i=[];let o=[],s=-1;for(let t=0;t<n.length;t++)3===n[t].status||(1===n[t].status?(r(s===t-1,"All SENT items should be at beginning of queue."),s=t,n[t].status=3,n[t].abortReason="set"):(r(0===n[t].status,"Unexpected transaction status in abort"),n[t].unwatcher(),o=o.concat(syncTreeAckUserWrite(e.serverSyncTree_,n[t].currentWriteId,!0)),n[t].onComplete&&i.push(n[t].onComplete.bind(null,new Error("set"),!1,null))));-1===s?treeSetValue(t,void 0):n.length=s+1,eventQueueRaiseEventsForChangedPath(e.eventQueue_,treeGetPath(t),o);for(let e=0;e<i.length;e++)exceptionGuard(i[e])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const parseRepoInfo=function(e,t){const n=parseDatabaseURL(e),r=n.namespace;"firebase.com"===n.domain&&fatal(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),r&&"undefined"!==r||"localhost"===n.domain||fatal("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||"undefined"!=typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&warn("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");const i="ws"===n.scheme||"wss"===n.scheme;return{repoInfo:new RepoInfo(n.host,n.secure,r,i,t,"",r!==n.subdomain),path:new Path(n.pathString)}},parseDatabaseURL=function(e){let t="",n="",r="",i="",o="",s=!0,a="https",l=443;if("string"==typeof e){let h=e.indexOf("//");h>=0&&(a=e.substring(0,h-1),e=e.substring(h+2));let c=e.indexOf("/");-1===c&&(c=e.length);let u=e.indexOf("?");-1===u&&(u=e.length),t=e.substring(0,Math.min(c,u)),c<u&&(i=function decodePath(e){let t="";const n=e.split("/");for(let i=0;i<n.length;i++)if(n[i].length>0){let e=n[i];try{e=decodeURIComponent(e.replace(/\+/g," "))}catch(r){}t+="/"+e}return t}(e.substring(c,u)));const d=function decodeQuery(e){const t={};"?"===e.charAt(0)&&(e=e.substring(1));for(const n of e.split("&")){if(0===n.length)continue;const r=n.split("=");2===r.length?t[decodeURIComponent(r[0])]=decodeURIComponent(r[1]):warn(`Invalid query segment '${n}' in query '${e}'`)}return t}(e.substring(Math.min(e.length,u)));h=t.indexOf(":"),h>=0?(s="https"===a||"wss"===a,l=parseInt(t.substring(h+1),10)):h=t.length;const p=t.slice(0,h);if("localhost"===p.toLowerCase())n="localhost";else if(p.split(".").length<=2)n=p;else{const e=t.indexOf(".");r=t.substring(0,e).toLowerCase(),n=t.substring(e+1),o=r}"ns"in d&&(o=d.ns)}return{host:t,port:l,domain:n,subdomain:r,secure:s,scheme:a,pathString:i,namespace:o}},Ae="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",Fe=function(){let e=0;const t=[];return function(n){const i=n===e;let o;e=n;const s=new Array(8);for(o=7;o>=0;o--)s[o]=Ae.charAt(n%64),n=Math.floor(n/64);r(0===n,"Cannot push at time == 0");let a=s.join("");if(i){for(o=11;o>=0&&63===t[o];o--)t[o]=0;t[o]++}else for(o=0;o<12;o++)t[o]=Math.floor(64*Math.random());for(o=0;o<12;o++)a+=Ae.charAt(t[o]);return r(20===a.length,"nextPushId: Length should be 20."),a}}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class DataEvent{constructor(e,t,n,r){this.eventType=e,this.eventRegistration=t,this.snapshot=n,this.prevName=r}getPath(){const e=this.snapshot.ref;return"value"===this.eventType?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+_(this.snapshot.exportVal())}}class CancelEvent{constructor(e,t,n){this.eventRegistration=e,this.error=t,this.path=n}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CallbackContext{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return r(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||void 0!==this.snapshotCallback.userCallback&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OnDisconnect{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new t;return repoOnDisconnectCancel(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){validateWritablePath("OnDisconnect.remove",this._path);const e=new t;return repoOnDisconnectSet(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){validateWritablePath("OnDisconnect.set",this._path),validateFirebaseDataArg("OnDisconnect.set",e,this._path,!1);const n=new t;return repoOnDisconnectSet(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}setWithPriority(e,n){validateWritablePath("OnDisconnect.setWithPriority",this._path),validateFirebaseDataArg("OnDisconnect.setWithPriority",e,this._path,!1),validatePriority("OnDisconnect.setWithPriority",n);const r=new t;return function repoOnDisconnectSetWithPriority(e,t,n,r,i){const o=nodeFromJSON(n,r);e.server_.onDisconnectPut(t.toString(),o.val(!0),(n,r)=>{"ok"===n&&sparseSnapshotTreeRemember(e.onDisconnect_,t,o),repoCallOnCompleteCallback(0,i,n,r)})}(this._repo,this._path,e,n,r.wrapCallback(()=>{})),r.promise}update(e){validateWritablePath("OnDisconnect.update",this._path),validateFirebaseMergeDataArg("OnDisconnect.update",e,this._path);const n=new t;return function repoOnDisconnectUpdate(e,t,n,r){if(f(n))return log("onDisconnect().update() called with empty data.  Don't do anything."),void repoCallOnCompleteCallback(0,r,"ok",void 0);e.server_.onDisconnectMerge(t.toString(),n,(i,o)=>{"ok"===i&&each(n,(n,r)=>{const i=nodeFromJSON(r);sparseSnapshotTreeRemember(e.onDisconnect_,pathChild(t,n),i)}),repoCallOnCompleteCallback(0,r,i,o)})}(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QueryImpl{constructor(e,t,n,r){this._repo=e,this._path=t,this._queryParams=n,this._orderByCalled=r}get key(){return pathIsEmpty(this._path)?null:pathGetBack(this._path)}get ref(){return new ReferenceImpl(this._repo,this._path)}get _queryIdentifier(){const e=queryParamsGetQueryObject(this._queryParams),t=ObjectToUniqueKey(e);return"{}"===t?"default":t}get _queryObject(){return queryParamsGetQueryObject(this._queryParams)}isEqual(e){if(!((e=n(e))instanceof QueryImpl))return!1;const t=this._repo===e._repo,r=pathEquals(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&r&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+function pathToUrlEncodedString(e){let t="";for(let n=e.pieceNum_;n<e.pieces_.length;n++)""!==e.pieces_[n]&&(t+="/"+encodeURIComponent(String(e.pieces_[n])));return t||"/"}(this._path)}}function validateNoPreviousOrderByCall(e,t){if(!0===e._orderByCalled)throw new Error(t+": You can't combine multiple orderBy calls.")}function validateQueryEndpoints(e){let t=null,n=null;if(e.hasStart()&&(t=e.getIndexStartValue()),e.hasEnd()&&(n=e.getIndexEndValue()),e.getIndex()===he){const r="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(e.hasStart()){if(e.getIndexStartName()!==$)throw new Error(r);if("string"!=typeof t)throw new Error(i)}if(e.hasEnd()){if(e.getIndexEndName()!==J)throw new Error(r);if("string"!=typeof n)throw new Error(i)}}else if(e.getIndex()===_e){if(null!=t&&!isValidPriority(t)||null!=n&&!isValidPriority(n))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(r(e.getIndex()instanceof PathIndex||e.getIndex()===Ce,"unknown index type."),null!=t&&"object"==typeof t||null!=n&&"object"==typeof n)throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function validateLimit(e){if(e.hasStart()&&e.hasEnd()&&e.hasLimit()&&!e.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class ReferenceImpl extends QueryImpl{constructor(e,t){super(e,t,new QueryParams,!1)}get parent(){const e=pathParent(this._path);return null===e?null:new ReferenceImpl(this._repo,e)}get root(){let e=this;for(;null!==e.parent;)e=e.parent;return e}}class DataSnapshot{constructor(e,t,n){this._node=e,this.ref=t,this._index=n}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new Path(e),n=child(this.ref,e);return new DataSnapshot(this._node.getChild(t),n,_e)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){if(this._node.isLeafNode())return!1;return!!this._node.forEachChild(this._index,(t,n)=>e(new DataSnapshot(n,child(this.ref,t),_e)))}hasChild(e){const t=new Path(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return!this._node.isLeafNode()&&!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function ref(e,t){return(e=n(e))._checkNotDeleted("ref"),void 0!==t?child(e._root,t):e._root}function refFromURL(e,t){(e=n(e))._checkNotDeleted("refFromURL");const r=parseRepoInfo(t,e._repo.repoInfo_.nodeAdmin);validateUrl("refFromURL",r);const i=r.repoInfo;return e._repo.repoInfo_.isCustomHost()||i.host===e._repo.repoInfo_.host||fatal("refFromURL: Host name does not match the current database: (found "+i.host+" but expected "+e._repo.repoInfo_.host+")"),ref(e,r.path.toString())}function child(e,t){var r,i,o,s;return null===pathGetFront((e=n(e))._path)?(r="child",i="path",s=!1,(o=t)&&(o=o.replace(/^\/*\.info(\/|$)/,"/")),validatePathString(r,i,o,s)):validatePathString("child","path",t,!1),new ReferenceImpl(e._repo,pathChild(e._path,t))}function onDisconnect(e){return e=n(e),new OnDisconnect(e._repo,e._path)}function push(e,t){e=n(e),validateWritablePath("push",e._path),validateFirebaseDataArg("push",t,e._path,!0);const r=repoServerTime(e._repo),i=Fe(r),o=child(e,i),s=child(e,i);let a;return a=null!=t?set(s,t).then(()=>s):Promise.resolve(s),o.then=a.then.bind(a),o.catch=a.then.bind(a,void 0),o}function remove(e){return validateWritablePath("remove",e._path),set(e,null)}function set(e,r){e=n(e),validateWritablePath("set",e._path),validateFirebaseDataArg("set",r,e._path,!1);const i=new t;return repoSetWithPriority(e._repo,e._path,r,null,i.wrapCallback(()=>{})),i.promise}function setPriority(e,r){e=n(e),validateWritablePath("setPriority",e._path),validatePriority("setPriority",r);const i=new t;return repoSetWithPriority(e._repo,pathChild(e._path,".priority"),r,null,i.wrapCallback(()=>{})),i.promise}function setWithPriority(e,n,r){if(validateWritablePath("setWithPriority",e._path),validateFirebaseDataArg("setWithPriority",n,e._path,!1),validatePriority("setWithPriority",r),".length"===e.key||".keys"===e.key)throw"setWithPriority failed: "+e.key+" is a read-only object.";const i=new t;return repoSetWithPriority(e._repo,e._path,n,r,i.wrapCallback(()=>{})),i.promise}function update(e,n){validateFirebaseMergeDataArg("update",n,e._path);const r=new t;return function repoUpdate(e,t,n,r){repoLog(e,"update",{path:t.toString(),value:n});let i=!0;const o=repoGenerateServerValues(e),s={};if(each(n,(n,r)=>{i=!1,s[n]=resolveDeferredValueTree(pathChild(t,n),nodeFromJSON(r),e.serverSyncTree_,o)}),i)log("update() called with empty data.  Don't do anything."),repoCallOnCompleteCallback(0,r,"ok",void 0);else{const i=repoGetNextWriteId(e),o=syncTreeApplyUserMerge(e.serverSyncTree_,t,s,i);eventQueueQueueEvents(e.eventQueue_,o),e.server_.merge(t.toString(),n,(n,o)=>{const s="ok"===n;s||warn("update at "+t+" failed: "+n);const a=syncTreeAckUserWrite(e.serverSyncTree_,i,!s),l=a.length>0?repoRerunTransactions(e,t):t;eventQueueRaiseEventsForChangedPath(e.eventQueue_,l,a),repoCallOnCompleteCallback(0,r,n,o)}),each(n,n=>{const r=repoAbortTransactions(e,pathChild(t,n));repoRerunTransactions(e,r)}),eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,[])}}(e._repo,e._path,n,r.wrapCallback(()=>{})),r.promise}function get(e){e=n(e);const t=new CallbackContext(()=>{}),r=new ValueEventRegistration(t);return function repoGetValue(e,t,n){const r=syncTreeGetServerValue(e.serverSyncTree_,t);return null!=r?Promise.resolve(r):e.server_.get(t).then(r=>{const i=nodeFromJSON(r).withIndex(t._queryParams.getIndex());let o;if(syncTreeAddEventRegistration(e.serverSyncTree_,t,n,!0),t._queryParams.loadsAllData())o=syncTreeApplyServerOverwrite(e.serverSyncTree_,t._path,i);else{const n=syncTreeTagForQuery(e.serverSyncTree_,t);o=syncTreeApplyTaggedQueryOverwrite(e.serverSyncTree_,t._path,i,n)}return eventQueueRaiseEventsForChangedPath(e.eventQueue_,t._path,o),syncTreeRemoveEventRegistration(e.serverSyncTree_,t,n,null,!0),i},n=>(repoLog(e,"get for query "+_(t)+" failed: "+n),Promise.reject(new Error(n))))}(e._repo,e,r).then(t=>new DataSnapshot(t,new ReferenceImpl(e._repo,e._path),e._queryParams.getIndex()))}class ValueEventRegistration{constructor(e){this.callbackContext=e}respondsTo(e){return"value"===e}createEvent(e,t){const n=t._queryParams.getIndex();return new DataEvent("value",this,new DataSnapshot(e.snapshotNode,new ReferenceImpl(t._repo,t._path),n))}getEventRunner(e){return"cancel"===e.getEventType()?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new CancelEvent(this,e,t):null}matches(e){return e instanceof ValueEventRegistration&&(!e.callbackContext||!this.callbackContext||e.callbackContext.matches(this.callbackContext))}hasAnyCallback(){return null!==this.callbackContext}}class ChildEventRegistration{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t="children_added"===e?"child_added":e;return t="children_removed"===t?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new CancelEvent(this,e,t):null}createEvent(e,t){r(null!=e.childName,"Child events should have a childName.");const n=child(new ReferenceImpl(t._repo,t._path),e.childName),i=t._queryParams.getIndex();return new DataEvent(e.type,this,new DataSnapshot(e.snapshotNode,n,i),e.prevName)}getEventRunner(e){return"cancel"===e.getEventType()?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof ChildEventRegistration&&(this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)))}hasAnyCallback(){return!!this.callbackContext}}function addEventListener(e,t,n,r,i){let o;if("object"==typeof r&&(o=void 0,i=r),"function"==typeof r&&(o=r),i&&i.onlyOnce){const t=n,onceCallback=(n,r)=>{repoRemoveEventCallbackForQuery(e._repo,e,a),t(n,r)};onceCallback.userCallback=n.userCallback,onceCallback.context=n.context,n=onceCallback}const s=new CallbackContext(n,o||void 0),a="value"===t?new ValueEventRegistration(s):new ChildEventRegistration(t,s);return function repoAddEventCallbackForQuery(e,t,n){let r;r=".info"===pathGetFront(t._path)?syncTreeAddEventRegistration(e.infoSyncTree_,t,n):syncTreeAddEventRegistration(e.serverSyncTree_,t,n),eventQueueRaiseEventsAtPath(e.eventQueue_,t._path,r)}(e._repo,e,a),()=>repoRemoveEventCallbackForQuery(e._repo,e,a)}function onValue(e,t,n,r){return addEventListener(e,"value",t,n,r)}function onChildAdded(e,t,n,r){return addEventListener(e,"child_added",t,n,r)}function onChildChanged(e,t,n,r){return addEventListener(e,"child_changed",t,n,r)}function onChildMoved(e,t,n,r){return addEventListener(e,"child_moved",t,n,r)}function onChildRemoved(e,t,n,r){return addEventListener(e,"child_removed",t,n,r)}function off(e,t,n){let r=null;const i=n?new CallbackContext(n):null;"value"===t?r=new ValueEventRegistration(i):t&&(r=new ChildEventRegistration(t,i)),repoRemoveEventCallbackForQuery(e._repo,e,r)}class QueryConstraint{}class QueryEndAtConstraint extends QueryConstraint{constructor(e,t){super(),this._value=e,this._key=t,this.type="endAt"}_apply(e){validateFirebaseDataArg("endAt",this._value,e._path,!0);const t=queryParamsEndAt(e._queryParams,this._value,this._key);if(validateLimit(t),validateQueryEndpoints(t),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}function endAt(e,t){return validateKey("endAt","key",t),new QueryEndAtConstraint(e,t)}class QueryEndBeforeConstraint extends QueryConstraint{constructor(e,t){super(),this._value=e,this._key=t,this.type="endBefore"}_apply(e){validateFirebaseDataArg("endBefore",this._value,e._path,!1);const t=function queryParamsEndBefore(e,t,n){let r;return r=e.index_===he||n?queryParamsEndAt(e,t,n):queryParamsEndAt(e,t,$),r.endBeforeSet_=!0,r}(e._queryParams,this._value,this._key);if(validateLimit(t),validateQueryEndpoints(t),e._queryParams.hasEnd())throw new Error("endBefore: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}function endBefore(e,t){return validateKey("endBefore","key",t),new QueryEndBeforeConstraint(e,t)}class QueryStartAtConstraint extends QueryConstraint{constructor(e,t){super(),this._value=e,this._key=t,this.type="startAt"}_apply(e){validateFirebaseDataArg("startAt",this._value,e._path,!0);const t=queryParamsStartAt(e._queryParams,this._value,this._key);if(validateLimit(t),validateQueryEndpoints(t),e._queryParams.hasStart())throw new Error("startAt: Starting point was already set (by another call to startAt, startBefore or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}function startAt(e=null,t){return validateKey("startAt","key",t),new QueryStartAtConstraint(e,t)}class QueryStartAfterConstraint extends QueryConstraint{constructor(e,t){super(),this._value=e,this._key=t,this.type="startAfter"}_apply(e){validateFirebaseDataArg("startAfter",this._value,e._path,!1);const t=function queryParamsStartAfter(e,t,n){let r;return r=e.index_===he||n?queryParamsStartAt(e,t,n):queryParamsStartAt(e,t,J),r.startAfterSet_=!0,r}(e._queryParams,this._value,this._key);if(validateLimit(t),validateQueryEndpoints(t),e._queryParams.hasStart())throw new Error("startAfter: Starting point was already set (by another call to startAt, startAfter, or equalTo).");return new QueryImpl(e._repo,e._path,t,e._orderByCalled)}}function startAfter(e,t){return validateKey("startAfter","key",t),new QueryStartAfterConstraint(e,t)}class QueryLimitToFirstConstraint extends QueryConstraint{constructor(e){super(),this._limit=e,this.type="limitToFirst"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToFirst: Limit was already set (by another call to limitToFirst or limitToLast).");return new QueryImpl(e._repo,e._path,function queryParamsLimitToFirst(e,t){const n=e.copy();return n.limitSet_=!0,n.limit_=t,n.viewFrom_="l",n}(e._queryParams,this._limit),e._orderByCalled)}}function limitToFirst(e){if("number"!=typeof e||Math.floor(e)!==e||e<=0)throw new Error("limitToFirst: First argument must be a positive integer.");return new QueryLimitToFirstConstraint(e)}class QueryLimitToLastConstraint extends QueryConstraint{constructor(e){super(),this._limit=e,this.type="limitToLast"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");return new QueryImpl(e._repo,e._path,function queryParamsLimitToLast(e,t){const n=e.copy();return n.limitSet_=!0,n.limit_=t,n.viewFrom_="r",n}(e._queryParams,this._limit),e._orderByCalled)}}function limitToLast(e){if("number"!=typeof e||Math.floor(e)!==e||e<=0)throw new Error("limitToLast: First argument must be a positive integer.");return new QueryLimitToLastConstraint(e)}class QueryOrderByChildConstraint extends QueryConstraint{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){validateNoPreviousOrderByCall(e,"orderByChild");const t=new Path(this._path);if(pathIsEmpty(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const n=new PathIndex(t),r=queryParamsOrderBy(e._queryParams,n);return validateQueryEndpoints(r),new QueryImpl(e._repo,e._path,r,!0)}}function orderByChild(e){if("$key"===e)throw new Error('orderByChild: "$key" is invalid.  Use orderByKey() instead.');if("$priority"===e)throw new Error('orderByChild: "$priority" is invalid.  Use orderByPriority() instead.');if("$value"===e)throw new Error('orderByChild: "$value" is invalid.  Use orderByValue() instead.');return validatePathString("orderByChild","path",e,!1),new QueryOrderByChildConstraint(e)}class QueryOrderByKeyConstraint extends QueryConstraint{constructor(){super(...arguments),this.type="orderByKey"}_apply(e){validateNoPreviousOrderByCall(e,"orderByKey");const t=queryParamsOrderBy(e._queryParams,he);return validateQueryEndpoints(t),new QueryImpl(e._repo,e._path,t,!0)}}function orderByKey(){return new QueryOrderByKeyConstraint}class QueryOrderByPriorityConstraint extends QueryConstraint{constructor(){super(...arguments),this.type="orderByPriority"}_apply(e){validateNoPreviousOrderByCall(e,"orderByPriority");const t=queryParamsOrderBy(e._queryParams,_e);return validateQueryEndpoints(t),new QueryImpl(e._repo,e._path,t,!0)}}function orderByPriority(){return new QueryOrderByPriorityConstraint}class QueryOrderByValueConstraint extends QueryConstraint{constructor(){super(...arguments),this.type="orderByValue"}_apply(e){validateNoPreviousOrderByCall(e,"orderByValue");const t=queryParamsOrderBy(e._queryParams,Ce);return validateQueryEndpoints(t),new QueryImpl(e._repo,e._path,t,!0)}}function orderByValue(){return new QueryOrderByValueConstraint}class QueryEqualToValueConstraint extends QueryConstraint{constructor(e,t){super(),this._value=e,this._key=t,this.type="equalTo"}_apply(e){if(validateFirebaseDataArg("equalTo",this._value,e._path,!1),e._queryParams.hasStart())throw new Error("equalTo: Starting point was already set (by another call to startAt/startAfter or equalTo).");if(e._queryParams.hasEnd())throw new Error("equalTo: Ending point was already set (by another call to endAt/endBefore or equalTo).");return new QueryEndAtConstraint(this._value,this._key)._apply(new QueryStartAtConstraint(this._value,this._key)._apply(e))}}function equalTo(e,t){return validateKey("equalTo","key",t),new QueryEqualToValueConstraint(e,t)}function query(e,...t){let r=n(e);for(const n of t)r=n._apply(r);return r}!function syncPointSetReferenceConstructor(e){r(!Ee,"__referenceConstructor has already been defined"),Ee=e}(ReferenceImpl),function syncTreeSetReferenceConstructor(e){r(!Ie,"__referenceConstructor has already been defined"),Ie=e}(ReferenceImpl);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Oe={};let Le=!1;function repoManagerDatabaseFromApp(e,t,n,r,i){let o=r||e.options.databaseURL;void 0===o&&(e.options.projectId||fatal("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),log("Using default host for project ",e.options.projectId),o=`${e.options.projectId}-default-rtdb.firebaseio.com`);let s,a,l=parseRepoInfo(o,i),h=l.repoInfo;"undefined"!=typeof process&&Q&&(a=Q.FIREBASE_DATABASE_EMULATOR_HOST),a?(s=!0,o=`http://${a}?ns=${h.namespace}`,l=parseRepoInfo(o,i),h=l.repoInfo):s=!l.repoInfo.secure;const c=i&&s?new EmulatorTokenProvider(EmulatorTokenProvider.OWNER):new FirebaseAuthTokenProvider(e.name,e.options,t);validateUrl("Invalid Firebase Database URL",l),pathIsEmpty(l.path)||fatal("Database URL must point to the root of a Firebase Database (not including a child path).");const u=function repoManagerCreateRepo(e,t,n,r){let i=Oe[t.name];i||(i={},Oe[t.name]=i);let o=i[e.toURLString()];o&&fatal("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.");return o=new Repo(e,Le,n,r),i[e.toURLString()]=o,o}(h,e,c,new AppCheckTokenProvider(e,n));return new Database(u,e)}class Database{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(repoStart(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new ReferenceImpl(this._repo,newEmptyPath())),this._rootInternal}_delete(){return null!==this._rootInternal&&(!function repoManagerDeleteRepo(e,t){const n=Oe[t];n&&n[e.key]===e||fatal(`Database ${t}(${e.repoInfo_}) has already been deleted.`),repoInterrupt(e),delete n[e.key]}(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){null===this._rootInternal&&fatal("Cannot call "+e+" on a deleted database.")}}function checkTransportInit(){TransportManager.IS_TRANSPORT_INITIALIZED&&warn("Transport has already been initialized. Please call this function before calling ref or setting up a listener")}function forceWebSockets(){checkTransportInit(),BrowserPollConnection.forceDisallow()}function forceLongPolling(){checkTransportInit(),WebSocketConnection.forceDisallow(),BrowserPollConnection.forceAllow()}function getDatabase(t=e(),n){const r=d(t,"database").getImmediate({identifier:n});if(!r._instanceStarted){const e=p("database");e&&connectDatabaseEmulator(r,...e)}return r}function connectDatabaseEmulator(e,t,r,i={}){(e=n(e))._checkNotDeleted("useEmulator");const o=`${t}:${r}`,s=e._repoInternal;if(e._instanceStarted){if(o===e._repoInternal.repoInfo_.host&&a(i,s.repoInfo_.emulatorOptions))return;fatal("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let d;if(s.repoInfo_.nodeAdmin)i.mockUserToken&&fatal('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),d=new EmulatorTokenProvider(EmulatorTokenProvider.OWNER);else if(i.mockUserToken){const t="string"==typeof i.mockUserToken?i.mockUserToken:l(i.mockUserToken,e.app.options.projectId);d=new EmulatorTokenProvider(t)}h(t)&&(c(t),u("Database",!0)),function repoManagerApplyEmulatorSettings(e,t,n,r){const i=t.lastIndexOf(":"),o=t.substring(0,i),s=h(o);e.repoInfo_=new RepoInfo(t,s,e.repoInfo_.namespace,e.repoInfo_.webSocketOnly,e.repoInfo_.nodeAdmin,e.repoInfo_.persistenceKey,e.repoInfo_.includeNamespaceInQueryParams,!0,n),r&&(e.authTokenProvider_=r)}(s,o,i,d)}function goOffline(e){(e=n(e))._checkNotDeleted("goOffline"),repoInterrupt(e._repo)}function goOnline(e){(e=n(e))._checkNotDeleted("goOnline"),function repoResume(e){e.persistentConnection_&&e.persistentConnection_.resume(xe)}(e._repo)}function enableLogging(e,t){enableLogging$1(e,t)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const De={".sv":"timestamp"};function serverTimestamp(){return De}function increment(e){return{".sv":{increment:e}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TransactionResult{constructor(e,t){this.committed=e,this.snapshot=t}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function runTransaction(e,i,o){var s;if(e=n(e),validateWritablePath("Reference.transaction",e._path),".length"===e.key||".keys"===e.key)throw"Reference.transaction failed: "+e.key+" is a read-only object.";const a=null===(s=null==o?void 0:o.applyLocally)||void 0===s||s,l=new t,h=onValue(e,()=>{});return function repoStartTransaction(e,t,n,i,o,s){repoLog(e,"transaction on "+t);const a={path:t,update:n,onComplete:i,status:null,order:K(),applyLocally:s,retryCount:0,unwatcher:o,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},l=repoGetLatestState(e,t,void 0);a.currentInputSnapshot=l;const h=a.update(l.val());if(void 0===h)a.unwatcher(),a.currentOutputSnapshotRaw=null,a.currentOutputSnapshotResolved=null,a.onComplete&&a.onComplete(null,!1,a.currentInputSnapshot);else{validateFirebaseData("transaction failed: Data returned ",h,a.path),a.status=0;const n=treeSubTree(e.transactionQueueTree_,t),i=treeGetValue(n)||[];let o;i.push(a),treeSetValue(n,i),"object"==typeof h&&null!==h&&C(h,".priority")?(o=w(h,".priority"),r(isValidPriority(o),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):o=(syncTreeCalcCompleteEventCache(e.serverSyncTree_,t)||ChildrenNode.EMPTY_NODE).getPriority().val();const s=repoGenerateServerValues(e),c=nodeFromJSON(h,o),u=resolveDeferredValueSnapshot(c,l,s);a.currentOutputSnapshotRaw=c,a.currentOutputSnapshotResolved=u,a.currentWriteId=repoGetNextWriteId(e);const d=syncTreeApplyUserOverwrite(e.serverSyncTree_,t,u,a.currentWriteId,a.applyLocally);eventQueueRaiseEventsForChangedPath(e.eventQueue_,t,d),repoSendReadyTransactions(e,e.transactionQueueTree_)}}(e._repo,e._path,i,(t,n,r)=>{let i=null;t?l.reject(t):(i=new DataSnapshot(r,new ReferenceImpl(e._repo,e._path),_e),l.resolve(new TransactionResult(n,i)))},h,a),l.promise}PersistentConnection.prototype.simpleListen=function(e,t){this.sendRequest("q",{p:e},t)},PersistentConnection.prototype.echo=function(e,t){this.sendRequest("echo",{d:e},t)};const hijackHash=function(e){const t=PersistentConnection.prototype.put;return PersistentConnection.prototype.put=function(n,r,i,o){void 0!==o&&(o=e()),t.call(this,n,r,i,o)},function(){PersistentConnection.prototype.put=t}},forceRestClient=function(e){!function repoManagerForceRestClient(e){Le=e}(e)};
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _initStandalone({app:e,url:t,version:n,customAuthImpl:r,customAppCheckImpl:s,nodeAdmin:a=!1}){setSDKVersion(n);const l=new y("database-standalone"),h=new o("auth-internal",l);let c;return s&&(c=new o("app-check-internal",l),c.setComponent(new i("app-check-internal",()=>s,"PRIVATE"))),h.setComponent(new i("auth-internal",()=>r,"PRIVATE")),repoManagerDatabaseFromApp(e,h,c,t,a)}!function registerDatabase(e){setSDKVersion(M),W(new i("database",(e,{instanceIdentifier:t})=>repoManagerDatabaseFromApp(e.getProvider("app").getImmediate(),e.getProvider("auth-internal"),e.getProvider("app-check-internal"),t),"PUBLIC").setMultipleInstances(!0)),q(G,U,e),q(G,U,"esm2017")}();export{DataSnapshot,Database,OnDisconnect,QueryConstraint,TransactionResult,QueryImpl as _QueryImpl,QueryParams as _QueryParams,ReferenceImpl as _ReferenceImpl,forceRestClient as _TEST_ACCESS_forceRestClient,hijackHash as _TEST_ACCESS_hijackHash,_initStandalone,repoManagerDatabaseFromApp as _repoManagerDatabaseFromApp,setSDKVersion as _setSDKVersion,validatePathString as _validatePathString,validateWritablePath as _validateWritablePath,child,connectDatabaseEmulator,enableLogging,endAt,endBefore,equalTo,forceLongPolling,forceWebSockets,get,getDatabase,goOffline,goOnline,increment,limitToFirst,limitToLast,off,onChildAdded,onChildChanged,onChildMoved,onChildRemoved,onDisconnect,onValue,orderByChild,orderByKey,orderByPriority,orderByValue,push,query,ref,refFromURL,remove,runTransaction,serverTimestamp,set,setPriority,setWithPriority,startAfter,startAt,update};
