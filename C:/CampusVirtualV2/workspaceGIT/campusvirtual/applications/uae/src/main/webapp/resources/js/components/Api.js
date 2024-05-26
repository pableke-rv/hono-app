import alerts from"./Alerts.js";function Api(){const a=this,s={};function t(e){alerts.showError(e)}this.init=()=>(Object.clear(s),s.headers=new Headers({"x-requested-with":"XMLHttpRequest"}),a.set("cache","default")),this.get=e=>s[e],this.set=(e,t)=>(s[e]=t,a),this.getHeaders=()=>s.headers,this.getHeader=e=>s.headers.get(e),this.setHeader=(e,t)=>(s.headers.set(e,t),a),this.getToken=()=>a.getHeader("x-access-token"),this.setToken=e=>a.setHeader("x-access-token",e),this.setMethod=e=>a.set("method",e),this.setBody=e=>a.set("body",e),this.setText=e=>a.setHeader("content-type","plain/text").setBody(e),this.setJSON=e=>a.setHeader("content-type","application/json").setBody(JSON.stringify(e)),this.text=async e=>{alerts.loading();e=await globalThis.fetch(e,s);return(e.ok?e.text():Promise.reject(e.statusText)).catch(t).finally(alerts.working)},this.json=async e=>{alerts.loading();e=await globalThis.fetch(e,s);return(e.ok?e.json():Promise.reject(e.statusText)).catch(t).finally(alerts.working)},this.send=async e=>{alerts.loading();var e=await globalThis.fetch(e,s),t=await((e.headers.get("content-type")||"").includes("application/json")?e.json():e.text());return(e.ok?Promise.resolve(t):Promise.reject(t||e.statusText)).finally(alerts.working)},this.sendText=(e,t,s)=>a.init().setMethod(t).setText(s).send(e),this.sendJSON=(e,t,s)=>a.init().setMethod(t).setJSON(s).send(e)}export default new Api;