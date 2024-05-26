import sb from"./StringBox.js";const EMPTY=[],fnParam=t=>t;export default function(s,e){(e=e||{}).onChange=e.onChange||fnParam,e.onReset=e.onReset||fnParam;const i=this;let r=EMPTY;const a=(t,e)=>{s.innerHTML=e?`<option>${e}</option>`:"",r=t},u=t=>(e.onChange(t,i),i);this.getItems=()=>r,this.getItem=t=>r[t],this.getIndex=()=>s.selectedIndex,this.isOptional=()=>!s.options[0]?.value,this.getCurrentItem=()=>r[s.selectedIndex],this.getSelect=()=>s,this.getOption=()=>s.options[i.getIndex()],this.getText=()=>i.getOption()?.innerHTML,this.getCode=t=>sb.getCode(i.getText(),t),this.getValue=()=>s.value,this.setValue=t=>(s.value=t,u(t)),this.reset=()=>(a(EMPTY,e.emptyOption),e.onReset(i),i),this.setItems=function(t){if(!JSON.size(t))return i.reset();a(t);return s.innerHTML+=r.map(t=>`<option value="${t.value}">${t.label}</option>`).join(""),u(r[0])},this.setOptions=function(t,e){if(!JSON.size(t))return i.reset();a([]);const n=e?t=>e[t]:t=>t;return t.forEach((t,e)=>{s.innerHTML+=`<option value="${n(e)}">${t}</option>`,r.push(n(e))}),u(r[0])},this.setData=function(t){if(!t)return i.reset();a([]);for(const e in t)s.innerHTML+=`<option value="${e}">${t[e]}</option>`,r.push(e);return u(r[0])},this.setLabels=function(t){return JSON.size(t)?(a([]),t.forEach(t=>{s.innerHTML+=`<option value="${t}">${t}</option>`}),r=t,u(r[0])):i.reset()},this.setRange=function(e,n,i,o){i=i||1,o=o||fnParam,a([]);for(let t=e;t<=n;t+=i)s.innerHTML+=`<option value="${t}">${o(t)}</option>`,r.push(t);return u(r[0])},this.toggleOptions=function(t){var e=i.getOption();return s.options.mask(t),e&&e.isHidden()&&(s.selectedIndex=s.options.findIndex(t=>!t.isHidden())),i},s.addEventListener("change",t=>{u(i.getCurrentItem())})}