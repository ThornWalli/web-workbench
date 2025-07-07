import{g as e,a as t,_ as r,E as n,b as o,D as i,L as a,i as s,c,d as u,e as l,C as d,r as h}from"./BShb_aPv.js";
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
 */const p=new Map,g={activated:!1,tokenObservers:[]},f={initialized:!1,enabled:!1};function getStateReference(e){return p.get(e)||Object.assign({},g)}function getDebugState(){return f}
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
 */const k="https://content-firebaseappcheck.googleapis.com/v1",m=3e4,w=96e4,T=864e5;
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
class Refresher{constructor(e,t,r,n,o){if(this.operation=e,this.retryPolicy=t,this.getWaitDuration=r,this.lowerBound=n,this.upperBound=o,this.pending=null,this.nextErrorWaitInterval=n,n>o)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new i,this.pending.promise.catch(e=>{}),await function sleep(e){return new Promise(t=>{setTimeout(t,e)})}
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
 */(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new i,this.pending.promise.catch(e=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(t){this.retryPolicy(t)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const e=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),e}}}const v=new n("appCheck","AppCheck",{"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"});
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
function getRecaptcha(e=!1){var t;return e?null===(t=self.grecaptcha)||void 0===t?void 0:t.enterprise:self.grecaptcha}function ensureActivated(e){if(!getStateReference(e).activated)throw v.create("use-before-activation",{appName:e.name})}function getDurationString(e){const t=Math.round(e/1e3),r=Math.floor(t/86400),n=Math.floor((t-3600*r*24)/3600),o=Math.floor((t-3600*r*24-3600*n)/60),i=t-3600*r*24-3600*n-60*o;let a="";return r&&(a+=pad(r)+"d:"),n&&(a+=pad(n)+"h:"),a+=pad(o)+"m:"+pad(i)+"s",a}function pad(e){return 0===e?"00":e>=10?e.toString():"0"+e}
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
 */async function exchangeToken({url:e,body:t},r){const n={"Content-Type":"application/json"},o=r.getImmediate({optional:!0});if(o){const e=await o.getHeartbeatsHeader();e&&(n["X-Firebase-Client"]=e)}const i={method:"POST",body:JSON.stringify(t),headers:n};let a,s;try{a=await fetch(e,i)}catch(d){throw v.create("fetch-network-error",{originalErrorMessage:null==d?void 0:d.message})}if(200!==a.status)throw v.create("fetch-status-error",{httpStatus:a.status});try{s=await a.json()}catch(d){throw v.create("fetch-parse-error",{originalErrorMessage:null==d?void 0:d.message})}const c=s.ttl.match(/^([\d.]+)(s)$/);if(!c||!c[2]||isNaN(Number(c[1])))throw v.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${s.ttl}`});const u=1e3*Number(c[1]),l=Date.now();return{token:s.token,expireTimeMillis:l+u,issuedAtTimeMillis:l}}function getExchangeDebugTokenRequest(e,t){const{projectId:r,appId:n,apiKey:o}=e.options;return{url:`${k}/projects/${r}/apps/${n}:exchangeDebugToken?key=${o}`,body:{debug_token:t}}}
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
 */const b="firebase-app-check-store",R="debug-token";let y=null;function getDBPromise(){return y||(y=new Promise((e,t)=>{try{const r=indexedDB.open("firebase-app-check-database",1);r.onsuccess=t=>{e(t.target.result)},r.onerror=e=>{var r;t(v.create("storage-open",{originalErrorMessage:null===(r=e.target.error)||void 0===r?void 0:r.message}))},r.onupgradeneeded=e=>{const t=e.target.result;if(0===e.oldVersion)t.createObjectStore(b,{keyPath:"compositeKey"})}}catch(r){t(v.create("storage-open",{originalErrorMessage:null==r?void 0:r.message}))}}),y)}async function write(e,t){const r=(await getDBPromise()).transaction(b,"readwrite"),n=r.objectStore(b).put({compositeKey:e,value:t});return new Promise((e,t)=>{n.onsuccess=t=>{e()},r.onerror=e=>{var r;t(v.create("storage-set",{originalErrorMessage:null===(r=e.target.error)||void 0===r?void 0:r.message}))}})}async function read(e){const t=(await getDBPromise()).transaction(b,"readonly"),r=t.objectStore(b).get(e);return new Promise((e,n)=>{r.onsuccess=t=>{const r=t.target.result;e(r?r.value:void 0)},t.onerror=e=>{var t;n(v.create("storage-get",{originalErrorMessage:null===(t=e.target.error)||void 0===t?void 0:t.message}))}})}function computeKey(e){return`${e.options.appId}-${e.name}`}
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
 */const E=new a("@firebase/app-check");
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
 */async function readTokenFromStorage(e){if(s()){let r;try{r=await function readTokenFromIndexedDB(e){return read(computeKey(e))}(e)}catch(t){E.warn(`Failed to read token from IndexedDB. Error: ${t}`)}return r}}function writeTokenToStorage(e,t){return s()?function writeTokenToIndexedDB(e,t){return write(computeKey(e),t)}(e,t).catch(e=>{E.warn(`Failed to write token to IndexedDB. Error: ${e}`)}):Promise.resolve()}async function readOrCreateDebugTokenFromStorage(){let e;try{e=await function readDebugTokenFromIndexedDB(){return read(R)}()}catch(t){}if(e)return e;{const e=crypto.randomUUID();return function writeDebugTokenToIndexedDB(e){return write(R,e)}(e).catch(e=>E.warn(`Failed to persist debug token to IndexedDB. Error: ${e}`)),e}}
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
 */function isDebugMode(){return getDebugState().enabled}async function getDebugToken(){const e=getDebugState();if(e.enabled&&e.token)return e.token.promise;throw Error("\n            Can't get debug token in production mode.\n        ")}
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
const S={error:"UNKNOWN_ERROR"};async function getToken$2(e,t=!1,r=!1){const n=e.app;ensureActivated(n);const o=getStateReference(n);let i,a=o.token;if(a&&!isValid(a)&&(o.token=void 0,a=void 0),!a){const e=await o.cachedTokenPromise;e&&(isValid(e)?a=e:await writeTokenToStorage(n,void 0))}if(!t&&a&&isValid(a))return{token:a.token};let s,c=!1;if(isDebugMode())try{o.exchangeTokenPromise||(o.exchangeTokenPromise=exchangeToken(getExchangeDebugTokenRequest(n,await getDebugToken()),e.heartbeatServiceProvider).finally(()=>{o.exchangeTokenPromise=void 0}),c=!0);const t=await o.exchangeTokenPromise;return await writeTokenToStorage(n,t),o.token=t,{token:t.token}}catch(u){return"appCheck/throttled"===u.code||"appCheck/initial-throttle"===u.code?E.warn(u.message):r&&E.error(u),makeDummyTokenResult(u)}try{o.exchangeTokenPromise||(o.exchangeTokenPromise=o.provider.getToken().finally(()=>{o.exchangeTokenPromise=void 0}),c=!0),a=await getStateReference(n).exchangeTokenPromise}catch(u){"appCheck/throttled"===u.code||"appCheck/initial-throttle"===u.code?E.warn(u.message):r&&E.error(u),i=u}return a?i?s=isValid(a)?{token:a.token,internalError:i}:makeDummyTokenResult(i):(s={token:a.token},o.token=a,await writeTokenToStorage(n,a)):s=makeDummyTokenResult(i),c&&notifyTokenListeners(n,s),s}function addTokenListener(e,t,r,n){const{app:o}=e,i=getStateReference(o),a={next:r,error:n,type:t};if(i.tokenObservers=[...i.tokenObservers,a],i.token&&isValid(i.token)){const t=i.token;Promise.resolve().then(()=>{r({token:t.token}),initTokenRefresher(e)}).catch(()=>{})}i.cachedTokenPromise.then(()=>initTokenRefresher(e))}function removeTokenListener(e,t){const r=getStateReference(e),n=r.tokenObservers.filter(e=>e.next!==t);0===n.length&&r.tokenRefresher&&r.tokenRefresher.isRunning()&&r.tokenRefresher.stop(),r.tokenObservers=n}function initTokenRefresher(e){const{app:t}=e,r=getStateReference(t);let n=r.tokenRefresher;n||(n=function createTokenRefresher(e){const{app:t}=e;return new Refresher(async()=>{let r;if(r=getStateReference(t).token?await getToken$2(e,!0):await getToken$2(e),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{const e=getStateReference(t);if(e.token){let t=e.token.issuedAtTimeMillis+.5*(e.token.expireTimeMillis-e.token.issuedAtTimeMillis)+3e5;const r=e.token.expireTimeMillis-3e5;return t=Math.min(t,r),Math.max(0,t-Date.now())}return 0},m,w)}(e),r.tokenRefresher=n),!n.isRunning()&&r.isTokenAutoRefreshEnabled&&n.start()}function notifyTokenListeners(e,t){const r=getStateReference(e).tokenObservers;for(const o of r)try{"EXTERNAL"===o.type&&null!=t.error?o.error(t.error):o.next(t)}catch(n){}}function isValid(e){return e.expireTimeMillis-Date.now()>0}function makeDummyTokenResult(e){return{token:(t=S,u.encodeString(JSON.stringify(t),!1)),error:e};var t}
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
 */class AppCheckService{constructor(e,t){this.app=e,this.heartbeatServiceProvider=t}_delete(){const{tokenObservers:e}=getStateReference(this.app);for(const t of e)removeTokenListener(this.app,t.next);return Promise.resolve()}}function internalFactory(e){return{getToken:t=>getToken$2(e,t),getLimitedUseToken:()=>async function getLimitedUseToken$1(e){const t=e.app;ensureActivated(t);const{provider:r}=getStateReference(t);if(isDebugMode()){const r=await getDebugToken(),{token:n}=await exchangeToken(getExchangeDebugTokenRequest(t,r),e.heartbeatServiceProvider);return{token:n}}{const{token:e}=await r.getToken();return{token:e}}}(e),addTokenListener:t=>addTokenListener(e,"INTERNAL",t),removeTokenListener:t=>removeTokenListener(e.app,t)}}const C="https://www.google.com/recaptcha/api.js";function initializeV3(e,t){const r=new i;getStateReference(e).reCAPTCHAState={initialized:r};const n=function makeDiv(e){const t=`fire_app_check_${e.name}`,r=document.createElement("div");return r.id=t,r.style.display="none",document.body.appendChild(r),t}(e),o=getRecaptcha(!1);return o?queueWidgetRender(e,t,o,n,r):function loadReCAPTCHAV3Script(e){const t=document.createElement("script");t.src=C,t.onload=e,document.head.appendChild(t)}
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
 */(()=>{const o=getRecaptcha(!1);if(!o)throw new Error("no recaptcha");queueWidgetRender(e,t,o,n,r)}),r.promise}function queueWidgetRender(e,t,r,n,o){r.ready(()=>{!function renderInvisibleWidget(e,t,r,n){const o=r.render(n,{sitekey:t,size:"invisible",callback:()=>{getStateReference(e).reCAPTCHAState.succeeded=!0},"error-callback":()=>{getStateReference(e).reCAPTCHAState.succeeded=!1}}),i=getStateReference(e);i.reCAPTCHAState=Object.assign(Object.assign({},i.reCAPTCHAState),{widgetId:o})}(e,t,r,n),o.resolve(r)})}class ReCaptchaV3Provider{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(){var e,t,r;!function throwIfThrottled(e){if(e&&Date.now()-e.allowRequestsAfter<=0)throw v.create("throttled",{time:getDurationString(e.allowRequestsAfter-Date.now()),httpStatus:e.httpStatus})}
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
 */(this._throttleData);const n=await async function getToken$1(e){ensureActivated(e);const t=getStateReference(e).reCAPTCHAState,r=await t.initialized.promise;return new Promise((t,n)=>{const o=getStateReference(e).reCAPTCHAState;r.ready(()=>{t(r.execute(o.widgetId,{action:"fire_app_check"}))})})}(this._app).catch(e=>{throw v.create("recaptcha-error")});if(!(null===(e=getStateReference(this._app).reCAPTCHAState)||void 0===e?void 0:e.succeeded))throw v.create("recaptcha-error");let o;try{o=await exchangeToken(function getExchangeRecaptchaV3TokenRequest(e,t){const{projectId:r,appId:n,apiKey:o}=e.options;return{url:`${k}/projects/${r}/apps/${n}:exchangeRecaptchaV3Token?key=${o}`,body:{recaptcha_v3_token:t}}}(this._app,n),this._heartbeatServiceProvider)}catch(i){throw(null===(t=i.code)||void 0===t?void 0:t.includes("fetch-status-error"))?(this._throttleData=function setBackoff(e,t){if(404===e||403===e)return{backoffCount:1,allowRequestsAfter:Date.now()+T,httpStatus:e};{const r=t?t.backoffCount:0,n=c(r,1e3,2);return{backoffCount:r+1,allowRequestsAfter:Date.now()+n,httpStatus:e}}}(Number(null===(r=i.customData)||void 0===r?void 0:r.httpStatus),this._throttleData),v.create("initial-throttle",{time:getDurationString(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):i}return this._throttleData=null,o}initialize(e){this._app=e,this._heartbeatServiceProvider=r(e,"heartbeat"),initializeV3(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof ReCaptchaV3Provider&&this._siteKey===e._siteKey}}function initializeAppCheck(n=e(),a){n=t(n);const s=r(n,"app-check");if(getDebugState().initialized||function initializeDebugMode(){const e=o(),t=getDebugState();if(t.initialized=!0,"string"!=typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN&&!0!==e.FIREBASE_APPCHECK_DEBUG_TOKEN)return;t.enabled=!0;const r=new i;t.token=r,"string"==typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN?r.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN):r.resolve(readOrCreateDebugTokenFromStorage())}(),isDebugMode()&&getDebugToken().then(e=>console.log(`App Check debug token: ${e}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`)),s.isInitialized()){const e=s.getImmediate(),t=s.getOptions();if(t.isTokenAutoRefreshEnabled===a.isTokenAutoRefreshEnabled&&t.provider.isEqual(a.provider))return e;throw v.create("already-initialized",{appName:n.name})}const c=s.initialize({options:a});return function _activate(e,t,r=!1){const n=function setInitialState(e,t){return p.set(e,t),p.get(e)}(e,Object.assign({},g));n.activated=!0,n.provider=t,n.cachedTokenPromise=readTokenFromStorage(e).then(t=>(t&&isValid(t)&&(n.token=t,notifyTokenListeners(e,{token:t.token})),t)),n.isTokenAutoRefreshEnabled=r&&e.automaticDataCollectionEnabled,!e.automaticDataCollectionEnabled&&r&&E.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh.");n.provider.initialize(e)}(n,a.provider,a.isTokenAutoRefreshEnabled),getStateReference(n).isTokenAutoRefreshEnabled&&addTokenListener(c,"INTERNAL",()=>{}),c}const D="app-check-internal";!function registerAppCheck(){l(new d("app-check",e=>function factory(e,t){return new AppCheckService(e,t)}(e.getProvider("app").getImmediate(),e.getProvider("heartbeat")),"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider(D).initialize()})),l(new d(D,e=>internalFactory(e.getProvider("app-check").getImmediate()),"PUBLIC").setInstantiationMode("EXPLICIT")),h("@firebase/app-check","0.10.1")}();export{ReCaptchaV3Provider,initializeAppCheck};
