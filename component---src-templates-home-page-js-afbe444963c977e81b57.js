(self.webpackChunkthiago_colen=self.webpackChunkthiago_colen||[]).push([[614],{7757:function(t,e,r){t.exports=r(5666)},6633:function(t,e,r){t.exports=r(2465)},3344:function(t,e,r){"use strict";var n=r(1599),o=r(7202),i=r(116),a=r(8710),s=r(3656),c=r(2306),u=r(778),f=r(1191);t.exports=function(t){return new Promise((function(e,r){var l=t.data,p=t.headers,h=t.responseType;n.isFormData(l)&&delete p["Content-Type"];var d=new XMLHttpRequest;if(t.auth){var m=t.auth.username||"",v=t.auth.password?unescape(encodeURIComponent(t.auth.password)):"";p.Authorization="Basic "+btoa(m+":"+v)}var g=s(t.baseURL,t.url);function y(){if(d){var n="getAllResponseHeaders"in d?c(d.getAllResponseHeaders()):null,i={data:h&&"text"!==h&&"json"!==h?d.response:d.responseText,status:d.status,statusText:d.statusText,headers:n,config:t,request:d};o(e,r,i),d=null}}if(d.open(t.method.toUpperCase(),a(g,t.params,t.paramsSerializer),!0),d.timeout=t.timeout,"onloadend"in d?d.onloadend=y:d.onreadystatechange=function(){d&&4===d.readyState&&(0!==d.status||d.responseURL&&0===d.responseURL.indexOf("file:"))&&setTimeout(y)},d.onabort=function(){d&&(r(f("Request aborted",t,"ECONNABORTED",d)),d=null)},d.onerror=function(){r(f("Network Error",t,null,d)),d=null},d.ontimeout=function(){var e="timeout of "+t.timeout+"ms exceeded";t.timeoutErrorMessage&&(e=t.timeoutErrorMessage),r(f(e,t,t.transitional&&t.transitional.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",d)),d=null},n.isStandardBrowserEnv()){var x=(t.withCredentials||u(g))&&t.xsrfCookieName?i.read(t.xsrfCookieName):void 0;x&&(p[t.xsrfHeaderName]=x)}"setRequestHeader"in d&&n.forEach(p,(function(t,e){void 0===l&&"content-type"===e.toLowerCase()?delete p[e]:d.setRequestHeader(e,t)})),n.isUndefined(t.withCredentials)||(d.withCredentials=!!t.withCredentials),h&&"json"!==h&&(d.responseType=t.responseType),"function"==typeof t.onDownloadProgress&&d.addEventListener("progress",t.onDownloadProgress),"function"==typeof t.onUploadProgress&&d.upload&&d.upload.addEventListener("progress",t.onUploadProgress),t.cancelToken&&t.cancelToken.promise.then((function(t){d&&(d.abort(),r(t),d=null)})),l||(l=null),d.send(l)}))}},2465:function(t,e,r){"use strict";var n=r(1599),o=r(6013),i=r(2234),a=r(5469);function s(t){var e=new i(t),r=o(i.prototype.request,e);return n.extend(r,i.prototype,e),n.extend(r,e),r}var c=s(r(8943));c.Axios=i,c.create=function(t){return s(a(c.defaults,t))},c.Cancel=r(6114),c.CancelToken=r(4396),c.isCancel=r(7458),c.all=function(t){return Promise.all(t)},c.spread=r(2744),c.isAxiosError=r(6683),t.exports=c,t.exports.default=c},6114:function(t){"use strict";function e(t){this.message=t}e.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},e.prototype.__CANCEL__=!0,t.exports=e},4396:function(t,e,r){"use strict";var n=r(6114);function o(t){if("function"!=typeof t)throw new TypeError("executor must be a function.");var e;this.promise=new Promise((function(t){e=t}));var r=this;t((function(t){r.reason||(r.reason=new n(t),e(r.reason))}))}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var t;return{token:new o((function(e){t=e})),cancel:t}},t.exports=o},7458:function(t){"use strict";t.exports=function(t){return!(!t||!t.__CANCEL__)}},2234:function(t,e,r){"use strict";var n=r(1599),o=r(8710),i=r(5950),a=r(4126),s=r(5469),c=r(8260),u=c.validators;function f(t){this.defaults=t,this.interceptors={request:new i,response:new i}}f.prototype.request=function(t){"string"==typeof t?(t=arguments[1]||{}).url=arguments[0]:t=t||{},(t=s(this.defaults,t)).method?t.method=t.method.toLowerCase():this.defaults.method?t.method=this.defaults.method.toLowerCase():t.method="get";var e=t.transitional;void 0!==e&&c.assertOptions(e,{silentJSONParsing:u.transitional(u.boolean,"1.0.0"),forcedJSONParsing:u.transitional(u.boolean,"1.0.0"),clarifyTimeoutError:u.transitional(u.boolean,"1.0.0")},!1);var r=[],n=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(n=n&&e.synchronous,r.unshift(e.fulfilled,e.rejected))}));var o,i=[];if(this.interceptors.response.forEach((function(t){i.push(t.fulfilled,t.rejected)})),!n){var f=[a,void 0];for(Array.prototype.unshift.apply(f,r),f=f.concat(i),o=Promise.resolve(t);f.length;)o=o.then(f.shift(),f.shift());return o}for(var l=t;r.length;){var p=r.shift(),h=r.shift();try{l=p(l)}catch(d){h(d);break}}try{o=a(l)}catch(d){return Promise.reject(d)}for(;i.length;)o=o.then(i.shift(),i.shift());return o},f.prototype.getUri=function(t){return t=s(this.defaults,t),o(t.url,t.params,t.paramsSerializer).replace(/^\?/,"")},n.forEach(["delete","get","head","options"],(function(t){f.prototype[t]=function(e,r){return this.request(s(r||{},{method:t,url:e,data:(r||{}).data}))}})),n.forEach(["post","put","patch"],(function(t){f.prototype[t]=function(e,r,n){return this.request(s(n||{},{method:t,url:e,data:r}))}})),t.exports=f},5950:function(t,e,r){"use strict";var n=r(1599);function o(){this.handlers=[]}o.prototype.use=function(t,e,r){return this.handlers.push({fulfilled:t,rejected:e,synchronous:!!r&&r.synchronous,runWhen:r?r.runWhen:null}),this.handlers.length-1},o.prototype.eject=function(t){this.handlers[t]&&(this.handlers[t]=null)},o.prototype.forEach=function(t){n.forEach(this.handlers,(function(e){null!==e&&t(e)}))},t.exports=o},3656:function(t,e,r){"use strict";var n=r(789),o=r(7020);t.exports=function(t,e){return t&&!n(e)?o(t,e):e}},1191:function(t,e,r){"use strict";var n=r(7822);t.exports=function(t,e,r,o,i){var a=new Error(t);return n(a,e,r,o,i)}},4126:function(t,e,r){"use strict";var n=r(1599),o=r(7989),i=r(7458),a=r(8943);function s(t){t.cancelToken&&t.cancelToken.throwIfRequested()}t.exports=function(t){return s(t),t.headers=t.headers||{},t.data=o.call(t,t.data,t.headers,t.transformRequest),t.headers=n.merge(t.headers.common||{},t.headers[t.method]||{},t.headers),n.forEach(["delete","get","head","post","put","patch","common"],(function(e){delete t.headers[e]})),(t.adapter||a.adapter)(t).then((function(e){return s(t),e.data=o.call(t,e.data,e.headers,t.transformResponse),e}),(function(e){return i(e)||(s(t),e&&e.response&&(e.response.data=o.call(t,e.response.data,e.response.headers,t.transformResponse))),Promise.reject(e)}))}},7822:function(t){"use strict";t.exports=function(t,e,r,n,o){return t.config=e,r&&(t.code=r),t.request=n,t.response=o,t.isAxiosError=!0,t.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},t}},5469:function(t,e,r){"use strict";var n=r(1599);t.exports=function(t,e){e=e||{};var r={},o=["url","method","data"],i=["headers","auth","proxy","params"],a=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],s=["validateStatus"];function c(t,e){return n.isPlainObject(t)&&n.isPlainObject(e)?n.merge(t,e):n.isPlainObject(e)?n.merge({},e):n.isArray(e)?e.slice():e}function u(o){n.isUndefined(e[o])?n.isUndefined(t[o])||(r[o]=c(void 0,t[o])):r[o]=c(t[o],e[o])}n.forEach(o,(function(t){n.isUndefined(e[t])||(r[t]=c(void 0,e[t]))})),n.forEach(i,u),n.forEach(a,(function(o){n.isUndefined(e[o])?n.isUndefined(t[o])||(r[o]=c(void 0,t[o])):r[o]=c(void 0,e[o])})),n.forEach(s,(function(n){n in e?r[n]=c(t[n],e[n]):n in t&&(r[n]=c(void 0,t[n]))}));var f=o.concat(i).concat(a).concat(s),l=Object.keys(t).concat(Object.keys(e)).filter((function(t){return-1===f.indexOf(t)}));return n.forEach(l,u),r}},7202:function(t,e,r){"use strict";var n=r(1191);t.exports=function(t,e,r){var o=r.config.validateStatus;r.status&&o&&!o(r.status)?e(n("Request failed with status code "+r.status,r.config,null,r.request,r)):t(r)}},7989:function(t,e,r){"use strict";var n=r(1599),o=r(8943);t.exports=function(t,e,r){var i=this||o;return n.forEach(r,(function(r){t=r.call(i,t,e)})),t}},8943:function(t,e,r){"use strict";var n=r(1599),o=r(4188),i=r(7822),a={"Content-Type":"application/x-www-form-urlencoded"};function s(t,e){!n.isUndefined(t)&&n.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e)}var c,u={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(c=r(3344)),c),transformRequest:[function(t,e){return o(e,"Accept"),o(e,"Content-Type"),n.isFormData(t)||n.isArrayBuffer(t)||n.isBuffer(t)||n.isStream(t)||n.isFile(t)||n.isBlob(t)?t:n.isArrayBufferView(t)?t.buffer:n.isURLSearchParams(t)?(s(e,"application/x-www-form-urlencoded;charset=utf-8"),t.toString()):n.isObject(t)||e&&"application/json"===e["Content-Type"]?(s(e,"application/json"),function(t,e,r){if(n.isString(t))try{return(e||JSON.parse)(t),n.trim(t)}catch(o){if("SyntaxError"!==o.name)throw o}return(r||JSON.stringify)(t)}(t)):t}],transformResponse:[function(t){var e=this.transitional,r=e&&e.silentJSONParsing,o=e&&e.forcedJSONParsing,a=!r&&"json"===this.responseType;if(a||o&&n.isString(t)&&t.length)try{return JSON.parse(t)}catch(s){if(a){if("SyntaxError"===s.name)throw i(s,this,"E_JSON_PARSE");throw s}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(t){return t>=200&&t<300}};u.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],(function(t){u.headers[t]={}})),n.forEach(["post","put","patch"],(function(t){u.headers[t]=n.merge(a)})),t.exports=u},6013:function(t){"use strict";t.exports=function(t,e){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n];return t.apply(e,r)}}},8710:function(t,e,r){"use strict";var n=r(1599);function o(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}t.exports=function(t,e,r){if(!e)return t;var i;if(r)i=r(e);else if(n.isURLSearchParams(e))i=e.toString();else{var a=[];n.forEach(e,(function(t,e){null!=t&&(n.isArray(t)?e+="[]":t=[t],n.forEach(t,(function(t){n.isDate(t)?t=t.toISOString():n.isObject(t)&&(t=JSON.stringify(t)),a.push(o(e)+"="+o(t))})))})),i=a.join("&")}if(i){var s=t.indexOf("#");-1!==s&&(t=t.slice(0,s)),t+=(-1===t.indexOf("?")?"?":"&")+i}return t}},7020:function(t){"use strict";t.exports=function(t,e){return e?t.replace(/\/+$/,"")+"/"+e.replace(/^\/+/,""):t}},116:function(t,e,r){"use strict";var n=r(1599);t.exports=n.isStandardBrowserEnv()?{write:function(t,e,r,o,i,a){var s=[];s.push(t+"="+encodeURIComponent(e)),n.isNumber(r)&&s.push("expires="+new Date(r).toGMTString()),n.isString(o)&&s.push("path="+o),n.isString(i)&&s.push("domain="+i),!0===a&&s.push("secure"),document.cookie=s.join("; ")},read:function(t){var e=document.cookie.match(new RegExp("(^|;\\s*)("+t+")=([^;]*)"));return e?decodeURIComponent(e[3]):null},remove:function(t){this.write(t,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},789:function(t){"use strict";t.exports=function(t){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(t)}},6683:function(t){"use strict";t.exports=function(t){return"object"==typeof t&&!0===t.isAxiosError}},778:function(t,e,r){"use strict";var n=r(1599);t.exports=n.isStandardBrowserEnv()?function(){var t,e=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a");function o(t){var n=t;return e&&(r.setAttribute("href",n),n=r.href),r.setAttribute("href",n),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}return t=o(window.location.href),function(e){var r=n.isString(e)?o(e):e;return r.protocol===t.protocol&&r.host===t.host}}():function(){return!0}},4188:function(t,e,r){"use strict";var n=r(1599);t.exports=function(t,e){n.forEach(t,(function(r,n){n!==e&&n.toUpperCase()===e.toUpperCase()&&(t[e]=r,delete t[n])}))}},2306:function(t,e,r){"use strict";var n=r(1599),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];t.exports=function(t){var e,r,i,a={};return t?(n.forEach(t.split("\n"),(function(t){if(i=t.indexOf(":"),e=n.trim(t.substr(0,i)).toLowerCase(),r=n.trim(t.substr(i+1)),e){if(a[e]&&o.indexOf(e)>=0)return;a[e]="set-cookie"===e?(a[e]?a[e]:[]).concat([r]):a[e]?a[e]+", "+r:r}})),a):a}},2744:function(t){"use strict";t.exports=function(t){return function(e){return t.apply(null,e)}}},8260:function(t,e,r){"use strict";var n=r(8593),o={};["object","boolean","number","function","string","symbol"].forEach((function(t,e){o[t]=function(r){return typeof r===t||"a"+(e<1?"n ":" ")+t}}));var i={},a=n.version.split(".");function s(t,e){for(var r=e?e.split("."):a,n=t.split("."),o=0;o<3;o++){if(r[o]>n[o])return!0;if(r[o]<n[o])return!1}return!1}o.transitional=function(t,e,r){var o=e&&s(e);function a(t,e){return"[Axios v"+n.version+"] Transitional option '"+t+"'"+e+(r?". "+r:"")}return function(r,n,s){if(!1===t)throw new Error(a(n," has been removed in "+e));return o&&!i[n]&&(i[n]=!0,console.warn(a(n," has been deprecated since v"+e+" and will be removed in the near future"))),!t||t(r,n,s)}},t.exports={isOlderVersion:s,assertOptions:function(t,e,r){if("object"!=typeof t)throw new TypeError("options must be an object");for(var n=Object.keys(t),o=n.length;o-- >0;){var i=n[o],a=e[i];if(a){var s=t[i],c=void 0===s||a(s,i,t);if(!0!==c)throw new TypeError("option "+i+" must be "+c)}else if(!0!==r)throw Error("Unknown option "+i)}},validators:o}},1599:function(t,e,r){"use strict";var n=r(6013),o=Object.prototype.toString;function i(t){return"[object Array]"===o.call(t)}function a(t){return void 0===t}function s(t){return null!==t&&"object"==typeof t}function c(t){if("[object Object]"!==o.call(t))return!1;var e=Object.getPrototypeOf(t);return null===e||e===Object.prototype}function u(t){return"[object Function]"===o.call(t)}function f(t,e){if(null!=t)if("object"!=typeof t&&(t=[t]),i(t))for(var r=0,n=t.length;r<n;r++)e.call(null,t[r],r,t);else for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.call(null,t[o],o,t)}t.exports={isArray:i,isArrayBuffer:function(t){return"[object ArrayBuffer]"===o.call(t)},isBuffer:function(t){return null!==t&&!a(t)&&null!==t.constructor&&!a(t.constructor)&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)},isFormData:function(t){return"undefined"!=typeof FormData&&t instanceof FormData},isArrayBufferView:function(t){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(t):t&&t.buffer&&t.buffer instanceof ArrayBuffer},isString:function(t){return"string"==typeof t},isNumber:function(t){return"number"==typeof t},isObject:s,isPlainObject:c,isUndefined:a,isDate:function(t){return"[object Date]"===o.call(t)},isFile:function(t){return"[object File]"===o.call(t)},isBlob:function(t){return"[object Blob]"===o.call(t)},isFunction:u,isStream:function(t){return s(t)&&u(t.pipe)},isURLSearchParams:function(t){return"undefined"!=typeof URLSearchParams&&t instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:f,merge:function t(){var e={};function r(r,n){c(e[n])&&c(r)?e[n]=t(e[n],r):c(r)?e[n]=t({},r):i(r)?e[n]=r.slice():e[n]=r}for(var n=0,o=arguments.length;n<o;n++)f(arguments[n],r);return e},extend:function(t,e,r){return f(e,(function(e,o){t[o]=r&&"function"==typeof e?n(e,r):e})),t},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},stripBOM:function(t){return 65279===t.charCodeAt(0)&&(t=t.slice(1)),t}}},5635:function(t,e,r){"use strict";function n(t,e,r,n,o,i,a){try{var s=t[i](a),c=s.value}catch(u){return void r(u)}s.done?e(c):Promise.resolve(c).then(n,o)}r.r(e),r.d(e,{default:function(){return f}});var o=r(7757),i=r.n(o),a=r(6633),s=r.n(a),c=r(7294),u=(r(5444),r.p+"static/thiagocolen-1-e991033c10a1adc7121ea06b353106bd.webm"),f=function(t){var e=t.pageContext;console.log("### HomePage pageContext:",e);var r=(0,c.useState)("loading..."),o=r[0],a=r[1];(0,c.useEffect)((function(){var t=function(){var t,e=(t=i().mark((function t(){var e,r;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,s().get("https://api.github.com/zen");case 3:e=t.sent,r=e.data,a(r),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),a("Always push your limits.");case 11:case"end":return t.stop()}}),t,null,[[0,8]])})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function s(t){n(a,o,i,s,c,"next",t)}function c(t){n(a,o,i,s,c,"throw",t)}s(void 0)}))});return function(){return e.apply(this,arguments)}}();t()}),[o]);return c.createElement(c.Fragment,null,c.createElement("div",{className:"w-full font-sans",style:{position:"fixed",top:0,right:0,bottom:0,left:0,overflow:"hidden",zIndex:-100}},c.createElement("div",{className:"container mx-auto text-center"},c.createElement("h1",{className:"text-6xl my-72 text-white font-black"},o)),c.createElement("video",{style:{width:"100%",position:"absolute",top:0,zIndex:-1},autoPlay:!0,loop:!0,muted:!0},c.createElement("source",{src:u,type:"video/webm"}))))}},5666:function(t){var e=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function c(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(T){c=function(t,e,r){return t[e]=r}}function u(t,e,r,n){var o=e&&e.prototype instanceof v?e:v,i=Object.create(o.prototype),a=new L(n||[]);return i._invoke=function(t,e,r){var n=l;return function(o,i){if(n===h)throw new Error("Generator is already running");if(n===d){if("throw"===o)throw i;return A()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var s=O(a,r);if(s){if(s===m)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===l)throw n=d,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=h;var c=f(t,e,r);if("normal"===c.type){if(n=r.done?d:p,c.arg===m)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n=d,r.method="throw",r.arg=c.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(T){return{type:"throw",arg:T}}}t.wrap=u;var l="suspendedStart",p="suspendedYield",h="executing",d="completed",m={};function v(){}function g(){}function y(){}var x={};c(x,i,(function(){return this}));var w=Object.getPrototypeOf,b=w&&w(w(C([])));b&&b!==r&&n.call(b,i)&&(x=b);var E=y.prototype=v.prototype=Object.create(x);function j(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,i,a,s){var c=f(t[o],t,i);if("throw"!==c.type){var u=c.arg,l=u.value;return l&&"object"==typeof l&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,s)}),(function(t){r("throw",t,a,s)})):e.resolve(l).then((function(t){u.value=t,a(u)}),(function(t){return r("throw",t,a,s)}))}s(c.arg)}var o;this._invoke=function(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}}function O(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,O(t,r),"throw"===r.method))return m;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}var o=f(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,m;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function N(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function L(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function C(t){if(t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}return{next:A}}function A(){return{value:e,done:!0}}return g.prototype=y,c(E,"constructor",y),c(y,"constructor",g),g.displayName=c(y,s,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,c(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},t.awrap=function(t){return{__await:t}},j(S.prototype),c(S.prototype,a,(function(){return this})),t.AsyncIterator=S,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new S(u(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(E),c(E,s,"Generator"),c(E,i,(function(){return this})),c(E,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=C,L.prototype={constructor:L,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(N),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return s.type="throw",s.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],s=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),N(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;N(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:C(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),m}},t}(t.exports);try{regeneratorRuntime=e}catch(r){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}},8593:function(t){"use strict";t.exports=JSON.parse('{"_from":"axios@^0.21.1","_id":"axios@0.21.4","_inBundle":false,"_integrity":"sha512-ut5vewkiu8jjGBdqpM44XxjuCjq9LAKeHVmoVfHVzy8eHgxxq8SbAVQNovDA8mVi05kP0Ea/n/UzcSHcTJQfNg==","_location":"/axios","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"axios@^0.21.1","name":"axios","escapedName":"axios","rawSpec":"^0.21.1","saveSpec":null,"fetchSpec":"^0.21.1"},"_requiredBy":["/contentful-management","/gatsby"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.21.4.tgz","_shasum":"c67b90dc0568e5c1cf2b0b858c43ba28e2eda575","_spec":"axios@^0.21.1","_where":"C:\\\\github-projects\\\\thiagocolen.github.io\\\\node_modules\\\\gatsby","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.14.0"},"deprecated":false,"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"homepage":"https://axios-http.com","jsdelivr":"dist/axios.min.js","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","unpkg":"dist/axios.min.js","version":"0.21.4"}')}}]);
//# sourceMappingURL=component---src-templates-home-page-js-afbe444963c977e81b57.js.map