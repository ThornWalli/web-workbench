import{g as D,F as _,a as k,_ as R,a0 as L,H as F,I as U,J as x,e as $,C as M,r as v,o as H}from"./DXdLLGcu.js";/**
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
 */const J="type.googleapis.com/google.protobuf.Int64Value",G="type.googleapis.com/google.protobuf.UInt64Value";function S(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function A(e){if(e==null)return null;if(e instanceof Number&&(e=e.valueOf()),typeof e=="number"&&isFinite(e)||e===!0||e===!1||Object.prototype.toString.call(e)==="[object String]")return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(t=>A(t));if(typeof e=="function"||typeof e=="object")return S(e,t=>A(t));throw new Error("Data cannot be encoded in JSON: "+e)}function g(e){if(e==null)return e;if(e["@type"])switch(e["@type"]){case J:case G:{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(t=>g(t)):typeof e=="function"||typeof e=="object"?S(e,t=>g(t)):e}/**
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
 */const E="functions";/**
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
 */const N={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class d extends _{constructor(t,n,r){super(`${E}/${t}`,n||""),this.details=r,Object.setPrototypeOf(this,d.prototype)}}function j(e){if(e>=200&&e<300)return"ok";switch(e){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function y(e,t){let n=j(e),r=n,i;try{const o=t&&t.error;if(o){const a=o.status;if(typeof a=="string"){if(!N[a])return new d("internal","internal");n=N[a],r=a}const s=o.message;typeof s=="string"&&(r=s),i=o.details,i!==void 0&&(i=g(i))}}catch{}return n==="ok"?null:new d(n,r,i)}/**
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
 */class q{constructor(t,n,r,i){this.app=t,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,H(t)&&t.settings.appCheckToken&&(this.serverAppAppCheckToken=t.settings.appCheckToken),this.auth=n.getImmediate({optional:!0}),this.messaging=r.getImmediate({optional:!0}),this.auth||n.get().then(o=>this.auth=o,()=>{}),this.messaging||r.get().then(o=>this.messaging=o,()=>{}),this.appCheck||i==null||i.get().then(o=>this.appCheck=o,()=>{})}async getAuthToken(){if(this.auth)try{const t=await this.auth.getToken();return t==null?void 0:t.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const n=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(t){const n=await this.getAuthToken(),r=await this.getMessagingToken(),i=await this.getAppCheckToken(t);return{authToken:n,messagingToken:r,appCheckToken:i}}}/**
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
 */const w="us-central1",V=/^data: (.*?)(?:\n|$)/;function B(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new d("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}class X{constructor(t,n,r,i,o=w,a=(...s)=>fetch(...s)){this.app=t,this.fetchImpl=a,this.emulatorOrigin=null,this.contextProvider=new q(t,n,r,i),this.cancelAllRequests=new Promise(s=>{this.deleteService=()=>Promise.resolve(s())});try{const s=new URL(o);this.customDomain=s.origin+(s.pathname==="/"?"":s.pathname),this.region=w}catch{this.customDomain=null,this.region=o}}_delete(){return this.deleteService()}_url(t){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${n}.cloudfunctions.net/${t}`}}function Y(e,t,n){const r=F(t);e.emulatorOrigin=`http${r?"s":""}://${t}:${n}`,r&&(U(e.emulatorOrigin),x("Functions",!0))}function K(e,t,n){const r=i=>Q(e,t,i,n||{});return r.stream=(i,o)=>Z(e,t,i,o),r}function W(e,t,n){const r=i=>O(e,t,i,n||{});return r.stream=(i,o)=>P(e,t,i,o||{}),r}async function z(e,t,n,r){n["Content-Type"]="application/json";let i;try{i=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch{return{status:0,json:null}}let o=null;try{o=await i.json()}catch{}return{status:i.status,json:o}}async function I(e,t){const n={},r=await e.contextProvider.getContext(t.limitedUseAppCheckTokens);return r.authToken&&(n.Authorization="Bearer "+r.authToken),r.messagingToken&&(n["Firebase-Instance-ID-Token"]=r.messagingToken),r.appCheckToken!==null&&(n["X-Firebase-AppCheck"]=r.appCheckToken),n}function Q(e,t,n,r){const i=e._url(t);return O(e,i,n,r)}async function O(e,t,n,r){n=A(n);const i={data:n},o=await I(e,r),a=r.timeout||7e4,s=B(a),l=await Promise.race([z(t,i,o,e.fetchImpl),s.promise,e.cancelAllRequests]);if(s.cancel(),!l)throw new d("cancelled","Firebase Functions instance was deleted.");const u=y(l.status,l.json);if(u)throw u;if(!l.json)throw new d("internal","Response is not valid JSON object.");let c=l.json.data;if(typeof c>"u"&&(c=l.json.result),typeof c>"u")throw new d("internal","Response is missing data field.");return{data:g(c)}}function Z(e,t,n,r){const i=e._url(t);return P(e,i,n,r||{})}async function P(e,t,n,r){var i;n=A(n);const o={data:n},a=await I(e,r);a["Content-Type"]="application/json",a.Accept="text/event-stream";let s;try{s=await e.fetchImpl(t,{method:"POST",body:JSON.stringify(o),headers:a,signal:r==null?void 0:r.signal})}catch(f){if(f instanceof Error&&f.name==="AbortError"){const T=new d("cancelled","Request was cancelled.");return{data:Promise.reject(T),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(T)}}}}}}const m=y(0,null);return{data:Promise.reject(m),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(m)}}}}}}let l,u;const c=new Promise((f,m)=>{l=f,u=m});(i=r==null?void 0:r.signal)===null||i===void 0||i.addEventListener("abort",()=>{const f=new d("cancelled","Request was cancelled.");u(f)});const p=s.body.getReader(),h=ee(p,l,u,r==null?void 0:r.signal);return{stream:{[Symbol.asyncIterator](){const f=h.getReader();return{async next(){const{value:m,done:T}=await f.read();return{value:m,done:T}},async return(){return await f.cancel(),{done:!0,value:void 0}}}}},data:c}}function ee(e,t,n,r){const i=(a,s)=>{const l=a.match(V);if(!l)return;const u=l[1];try{const c=JSON.parse(u);if("result"in c){t(g(c.result));return}if("message"in c){s.enqueue(g(c.message));return}if("error"in c){const p=y(0,c);s.error(p),n(p);return}}catch(c){if(c instanceof d){s.error(c),n(c);return}}},o=new TextDecoder;return new ReadableStream({start(a){let s="";return l();async function l(){if(r!=null&&r.aborted){const u=new d("cancelled","Request was cancelled");return a.error(u),n(u),Promise.resolve()}try{const{value:u,done:c}=await e.read();if(c){s.trim()&&i(s.trim(),a),a.close();return}if(r!=null&&r.aborted){const h=new d("cancelled","Request was cancelled");a.error(h),n(h),await e.cancel();return}s+=o.decode(u,{stream:!0});const p=s.split(`
`);s=p.pop()||"";for(const h of p)h.trim()&&i(h.trim(),a);return l()}catch(u){const c=u instanceof d?u:y(0,null);a.error(c),n(c)}}},cancel(){return e.cancel()}})}const b="@firebase/functions",C="0.12.8";/**
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
 */const te="auth-internal",ne="app-check-internal",re="messaging-internal";function ie(e){const t=(n,{instanceIdentifier:r})=>{const i=n.getProvider("app").getImmediate(),o=n.getProvider(te),a=n.getProvider(re),s=n.getProvider(ne);return new X(i,o,a,s,r)};$(new M(E,t,"PUBLIC").setMultipleInstances(!0)),v(b,C,e),v(b,C,"esm2017")}/**
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
 */function ae(e=D(),t=w){const r=R(k(e),E).getImmediate({identifier:t}),i=L("functions");return i&&oe(r,...i),r}function oe(e,t,n){Y(k(e),t,n)}function ce(e,t,n){return K(k(e),t,n)}function ue(e,t,n){return W(k(e),t,n)}ie();export{d as FunctionsError,oe as connectFunctionsEmulator,ae as getFunctions,ce as httpsCallable,ue as httpsCallableFromURL};
