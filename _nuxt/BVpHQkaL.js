import{g as O,F as D,a as A,_,a1 as R,I as L,J as F,K as U,e as x,C as $,r as E,o as M}from"./DjZSq7nb.js";/**
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
 */const J="type.googleapis.com/google.protobuf.Int64Value",G="type.googleapis.com/google.protobuf.UInt64Value";function v(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function k(e){if(e==null)return null;if(e instanceof Number&&(e=e.valueOf()),typeof e=="number"&&isFinite(e)||e===!0||e===!1||Object.prototype.toString.call(e)==="[object String]")return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(t=>k(t));if(typeof e=="function"||typeof e=="object")return v(e,t=>k(t));throw new Error("Data cannot be encoded in JSON: "+e)}function m(e){if(e==null)return e;if(e["@type"])switch(e["@type"]){case J:case G:{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(t=>m(t)):typeof e=="function"||typeof e=="object"?v(e,t=>m(t)):e}/**
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
 */const w="functions";/**
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
 */const N={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class f extends D{constructor(t,n,r){super(`${w}/${t}`,n||""),this.details=r,Object.setPrototypeOf(this,f.prototype)}}function H(e){if(e>=200&&e<300)return"ok";switch(e){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function T(e,t){let n=H(e),r=n,s;try{const o=t&&t.error;if(o){const a=o.status;if(typeof a=="string"){if(!N[a])return new f("internal","internal");n=N[a],r=a}const i=o.message;typeof i=="string"&&(r=i),s=o.details,s!==void 0&&(s=m(s))}}catch{}return n==="ok"?null:new f(n,r,s)}/**
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
 */class j{constructor(t,n,r,s){this.app=t,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,M(t)&&t.settings.appCheckToken&&(this.serverAppAppCheckToken=t.settings.appCheckToken),this.auth=n.getImmediate({optional:!0}),this.messaging=r.getImmediate({optional:!0}),this.auth||n.get().then(o=>this.auth=o,()=>{}),this.messaging||r.get().then(o=>this.messaging=o,()=>{}),this.appCheck||s?.get().then(o=>this.appCheck=o,()=>{})}async getAuthToken(){if(this.auth)try{return(await this.auth.getToken())?.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const n=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return n.error?null:n.token}return null}async getContext(t){const n=await this.getAuthToken(),r=await this.getMessagingToken(),s=await this.getAppCheckToken(t);return{authToken:n,messagingToken:r,appCheckToken:s}}}/**
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
 */const y="us-central1",q=/^data: (.*?)(?:\n|$)/;function V(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new f("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}class B{constructor(t,n,r,s,o=y,a=(...i)=>fetch(...i)){this.app=t,this.fetchImpl=a,this.emulatorOrigin=null,this.contextProvider=new j(t,n,r,s),this.cancelAllRequests=new Promise(i=>{this.deleteService=()=>Promise.resolve(i())});try{const i=new URL(o);this.customDomain=i.origin+(i.pathname==="/"?"":i.pathname),this.region=y}catch{this.customDomain=null,this.region=o}}_delete(){return this.deleteService()}_url(t){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${n}.cloudfunctions.net/${t}`}}function K(e,t,n){const r=L(t);e.emulatorOrigin=`http${r?"s":""}://${t}:${n}`,r&&(F(e.emulatorOrigin),U("Functions",!0))}function X(e,t,n){const r=s=>z(e,t,s,n||{});return r.stream=(s,o)=>Q(e,t,s,o),r}function Y(e,t,n){const r=s=>P(e,t,s,n||{});return r.stream=(s,o)=>I(e,t,s,o||{}),r}async function W(e,t,n,r){n["Content-Type"]="application/json";let s;try{s=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch{return{status:0,json:null}}let o=null;try{o=await s.json()}catch{}return{status:s.status,json:o}}async function S(e,t){const n={},r=await e.contextProvider.getContext(t.limitedUseAppCheckTokens);return r.authToken&&(n.Authorization="Bearer "+r.authToken),r.messagingToken&&(n["Firebase-Instance-ID-Token"]=r.messagingToken),r.appCheckToken!==null&&(n["X-Firebase-AppCheck"]=r.appCheckToken),n}function z(e,t,n,r){const s=e._url(t);return P(e,s,n,r)}async function P(e,t,n,r){n=k(n);const s={data:n},o=await S(e,r),a=r.timeout||7e4,i=V(a),u=await Promise.race([W(t,s,o,e.fetchImpl),i.promise,e.cancelAllRequests]);if(i.cancel(),!u)throw new f("cancelled","Firebase Functions instance was deleted.");const d=T(u.status,u.json);if(d)throw d;if(!u.json)throw new f("internal","Response is not valid JSON object.");let c=u.json.data;if(typeof c>"u"&&(c=u.json.result),typeof c>"u")throw new f("internal","Response is missing data field.");return{data:m(c)}}function Q(e,t,n,r){const s=e._url(t);return I(e,s,n,r||{})}async function I(e,t,n,r){n=k(n);const s={data:n},o=await S(e,r);o["Content-Type"]="application/json",o.Accept="text/event-stream";let a;try{a=await e.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:o,signal:r?.signal})}catch(l){if(l instanceof Error&&l.name==="AbortError"){const g=new f("cancelled","Request was cancelled.");return{data:Promise.reject(g),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(g)}}}}}}const h=T(0,null);return{data:Promise.reject(h),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(h)}}}}}}let i,u;const d=new Promise((l,h)=>{i=l,u=h});r?.signal?.addEventListener("abort",()=>{const l=new f("cancelled","Request was cancelled.");u(l)});const c=a.body.getReader(),p=Z(c,i,u,r?.signal);return{stream:{[Symbol.asyncIterator](){const l=p.getReader();return{async next(){const{value:h,done:g}=await l.read();return{value:h,done:g}},async return(){return await l.cancel(),{done:!0,value:void 0}}}}},data:d}}function Z(e,t,n,r){const s=(a,i)=>{const u=a.match(q);if(!u)return;const d=u[1];try{const c=JSON.parse(d);if("result"in c){t(m(c.result));return}if("message"in c){i.enqueue(m(c.message));return}if("error"in c){const p=T(0,c);i.error(p),n(p);return}}catch(c){if(c instanceof f){i.error(c),n(c);return}}},o=new TextDecoder;return new ReadableStream({start(a){let i="";return u();async function u(){if(r?.aborted){const d=new f("cancelled","Request was cancelled");return a.error(d),n(d),Promise.resolve()}try{const{value:d,done:c}=await e.read();if(c){i.trim()&&s(i.trim(),a),a.close();return}if(r?.aborted){const l=new f("cancelled","Request was cancelled");a.error(l),n(l),await e.cancel();return}i+=o.decode(d,{stream:!0});const p=i.split(`
`);i=p.pop()||"";for(const l of p)l.trim()&&s(l.trim(),a);return u()}catch(d){const c=d instanceof f?d:T(0,null);a.error(c),n(c)}}},cancel(){return e.cancel()}})}const C="@firebase/functions",b="0.13.0";/**
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
 */const ee="auth-internal",te="app-check-internal",ne="messaging-internal";function re(e){const t=(n,{instanceIdentifier:r})=>{const s=n.getProvider("app").getImmediate(),o=n.getProvider(ee),a=n.getProvider(ne),i=n.getProvider(te);return new B(s,o,a,i,r)};x(new $(w,t,"PUBLIC").setMultipleInstances(!0)),E(C,b,e),E(C,b,"esm2020")}/**
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
 */function ie(e=O(),t=y){const r=_(A(e),w).getImmediate({identifier:t}),s=R("functions");return s&&se(r,...s),r}function se(e,t,n){K(A(e),t,n)}function ae(e,t,n){return X(A(e),t,n)}function ce(e,t,n){return Y(A(e),t,n)}re();export{f as FunctionsError,se as connectFunctionsEmulator,ie as getFunctions,ae as httpsCallable,ce as httpsCallableFromURL};
