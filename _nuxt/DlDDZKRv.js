import{g as e,F as t,a as n,_ as r,a0 as o,H as s,I as a,J as i,e as c,C as u,r as l,o as d}from"./BShb_aPv.js";
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
 */function mapValues(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function encode(e){if(null==e)return null;if(e instanceof Number&&(e=e.valueOf()),"number"==typeof e&&isFinite(e))return e;if(!0===e||!1===e)return e;if("[object String]"===Object.prototype.toString.call(e))return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(e=>encode(e));if("function"==typeof e||"object"==typeof e)return mapValues(e,e=>encode(e));throw new Error("Data cannot be encoded in JSON: "+e)}function decode(e){if(null==e)return e;if(e["@type"])switch(e["@type"]){case"type.googleapis.com/google.protobuf.Int64Value":case"type.googleapis.com/google.protobuf.UInt64Value":{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(e=>decode(e)):"function"==typeof e||"object"==typeof e?mapValues(e,e=>decode(e)):e}
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
 */const p="functions",h={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};
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
 */class FunctionsError extends t{constructor(e,t,n){super(`${p}/${e}`,t||""),this.details=n,Object.setPrototypeOf(this,FunctionsError.prototype)}}function _errorForResponse(e,t){let n,r=function codeForHTTPStatus(e){if(e>=200&&e<300)return"ok";switch(e){case 0:case 500:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}(e),o=r;try{const e=t&&t.error;if(e){const t=e.status;if("string"==typeof t){if(!h[t])return new FunctionsError("internal","internal");r=h[t],o=t}const s=e.message;"string"==typeof s&&(o=s),n=e.details,void 0!==n&&(n=decode(n))}}catch(s){}return"ok"===r?null:new FunctionsError(r,o,n)}
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
 */class ContextProvider{constructor(e,t,n,r){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,d(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(e=>this.auth=e,()=>{}),this.messaging||n.get().then(e=>this.messaging=e,()=>{}),this.appCheck||null==r||r.get().then(e=>this.appCheck=e,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return null==e?void 0:e.accessToken}catch(e){return}}async getMessagingToken(){if(this.messaging&&"Notification"in self&&"granted"===Notification.permission)try{return await this.messaging.getToken()}catch(e){return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){return{authToken:await this.getAuthToken(),messagingToken:await this.getMessagingToken(),appCheckToken:await this.getAppCheckToken(e)}}}
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
 */const m="us-central1",f=/^data: (.*?)(?:\n|$)/;class FunctionsService{constructor(e,t,n,r,o=m,s=(...e)=>fetch(...e)){this.app=e,this.fetchImpl=s,this.emulatorOrigin=null,this.contextProvider=new ContextProvider(e,t,n,r),this.cancelAllRequests=new Promise(e=>{this.deleteService=()=>Promise.resolve(e())});try{const e=new URL(o);this.customDomain=e.origin+("/"===e.pathname?"":e.pathname),this.region=m}catch(a){this.customDomain=null,this.region=o}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;if(null!==this.emulatorOrigin){return`${this.emulatorOrigin}/${t}/${this.region}/${e}`}return null!==this.customDomain?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function httpsCallable$1(e,t,n){const callable=r=>function call(e,t,n,r){const o=e._url(t);return callAtURL(e,o,n,r)}(e,t,r,n||{});return callable.stream=(n,r)=>function stream(e,t,n,r){const o=e._url(t);return streamAtURL(e,o,n,r||{})}(e,t,n,r),callable}async function postJSON(e,t,n,r){let o;n["Content-Type"]="application/json";try{o=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch(a){return{status:0,json:null}}let s=null;try{s=await o.json()}catch(a){}return{status:o.status,json:s}}async function makeAuthHeaders(e,t){const n={},r=await e.contextProvider.getContext(t.limitedUseAppCheckTokens);return r.authToken&&(n.Authorization="Bearer "+r.authToken),r.messagingToken&&(n["Firebase-Instance-ID-Token"]=r.messagingToken),null!==r.appCheckToken&&(n["X-Firebase-AppCheck"]=r.appCheckToken),n}async function callAtURL(e,t,n,r){const o={data:n=encode(n)},s=await makeAuthHeaders(e,r),a=function failAfter(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new FunctionsError("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}(r.timeout||7e4),i=await Promise.race([postJSON(t,o,s,e.fetchImpl),a.promise,e.cancelAllRequests]);if(a.cancel(),!i)throw new FunctionsError("cancelled","Firebase Functions instance was deleted.");const c=_errorForResponse(i.status,i.json);if(c)throw c;if(!i.json)throw new FunctionsError("internal","Response is not valid JSON object.");let u=i.json.data;if(void 0===u&&(u=i.json.result),void 0===u)throw new FunctionsError("internal","Response is missing data field.");return{data:decode(u)}}async function streamAtURL(e,t,n,r){var o;const s={data:n=encode(n)},a=await makeAuthHeaders(e,r);let i,c,u;a["Content-Type"]="application/json",a.Accept="text/event-stream";try{i=await e.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:a,signal:null==r?void 0:r.signal})}catch(p){if(p instanceof Error&&"AbortError"===p.name){const e=new FunctionsError("cancelled","Request was cancelled.");return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const e=_errorForResponse(0,null);return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const l=new Promise((e,t)=>{c=e,u=t});null===(o=null==r?void 0:r.signal)||void 0===o||o.addEventListener("abort",()=>{const e=new FunctionsError("cancelled","Request was cancelled.");u(e)});const d=function createResponseStream(e,t,n,r){const processLine=(e,r)=>{const o=e.match(f);if(!o)return;const s=o[1];try{const e=JSON.parse(s);if("result"in e)return void t(decode(e.result));if("message"in e)return void r.enqueue(decode(e.message));if("error"in e){const t=_errorForResponse(0,e);return r.error(t),void n(t)}}catch(a){if(a instanceof FunctionsError)return r.error(a),void n(a)}},o=new TextDecoder;return new ReadableStream({start(t){let s="";return pump();async function pump(){if(null==r?void 0:r.aborted){const e=new FunctionsError("cancelled","Request was cancelled");return t.error(e),n(e),Promise.resolve()}try{const{value:a,done:i}=await e.read();if(i)return s.trim()&&processLine(s.trim(),t),void t.close();if(null==r?void 0:r.aborted){const r=new FunctionsError("cancelled","Request was cancelled");return t.error(r),n(r),void(await e.cancel())}s+=o.decode(a,{stream:!0});const c=s.split("\n");s=c.pop()||"";for(const e of c)e.trim()&&processLine(e.trim(),t);return pump()}catch(a){const e=a instanceof FunctionsError?a:_errorForResponse(0,null);t.error(e),n(e)}}},cancel:()=>e.cancel()})}(i.body.getReader(),c,u,null==r?void 0:r.signal);return{stream:{[Symbol.asyncIterator](){const e=d.getReader();return{async next(){const{value:t,done:n}=await e.read();return{value:t,done:n}},return:async()=>(await e.cancel(),{done:!0,value:void 0})}}},data:l}}const g="@firebase/functions",k="0.12.9";
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
function getFunctions(t=e(),s=m){const a=r(n(t),p).getImmediate({identifier:s}),i=o("functions");return i&&connectFunctionsEmulator(a,...i),a}function connectFunctionsEmulator(e,t,r){!function connectFunctionsEmulator$1(e,t,n){const r=s(t);e.emulatorOrigin=`http${r?"s":""}://${t}:${n}`,r&&(a(e.emulatorOrigin),i("Functions",!0))}(n(e),t,r)}function httpsCallable(e,t,r){return httpsCallable$1(n(e),t,r)}function httpsCallableFromURL(e,t,r){return function httpsCallableFromURL$1(e,t,n){const callable=r=>callAtURL(e,t,r,n||{});return callable.stream=(n,r)=>streamAtURL(e,t,n,r||{}),callable}(n(e),t,r)}!function registerFunctions(e){c(new u(p,(e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),o=e.getProvider("messaging-internal"),s=e.getProvider("app-check-internal");return new FunctionsService(n,r,o,s,t)},"PUBLIC").setMultipleInstances(!0)),l(g,k,e),l(g,k,"esm2017")}();export{FunctionsError,connectFunctionsEmulator,getFunctions,httpsCallable,httpsCallableFromURL};
