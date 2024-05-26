import coll from"./CollectionHTML.js";HTMLElement.prototype.eachPrev=function(t){var n=this.previousElementSibling;for(let e=0;n;n=n.previousElementSibling)t(n,e++);return this},HTMLElement.prototype.prev=function(e){for(var t=this.previousElementSibling;t;){if(t.matches(e))return t;t=t.previousElementSibling}return null},HTMLElement.prototype.eachNext=function(t){var n=this.nextElementSibling;for(let e=0;n;n=n.nextElementSibling)t(n,e++);return this},HTMLElement.prototype.next=function(e){for(var t=this.nextElementSibling;t;){if(t.matches(e))return t;t=t.nextElementSibling}return null},HTMLElement.prototype.eachSibling=function(e){return this.eachPrev(e).eachNext(e)},HTMLElement.prototype.sibling=function(e){return this.prev(e)||this.next(e)};const ALERTS_CLASS="alerts",TYPE_OK="alert-success",TYPE_INFO="alert-info",TYPE_WARN="alert-warn",TYPE_ERROR="alert-error",ALERT_TEXT="alert-text",ALERT_CLOSE="alert-close";function Alerts(){const r=this;var e=document.querySelector("."+ALERTS_CLASS);const n=e.getElementsByClassName(ALERT_TEXT);var t=e.getElementsByClassName(ALERT_CLOSE);const o=e.nextElementSibling,i=(this.loading=()=>(o.fadeIn(),r.closeAlerts()),this.working=()=>(o.fadeOut(),r),o.nextElementSibling),s=(this.top=()=>(document.body.scrollIntoView({behavior:"smooth"}),r),this.redir=(e,t)=>(e&&window.open(e,t||"_blank"),r),i.addEventListener("click",e=>{r.top(),e.preventDefault()}),window.onscroll=function(){i.setVisible(80<this.scrollY)},(e,t)=>(e.parentNode.fadeIn(),e.setMsg(t),r)),l=e=>e.fadeOut(),a=e=>l(e.parentNode),E=(e,t)=>t?(e.parentNode.eachSibling(l),s(e,t)):r,c=t=>n.find(e=>e.parentNode.classList.contains(t)),h=(this.showOk=e=>E(c(TYPE_OK),e),this.showInfo=e=>E(c(TYPE_INFO),e),this.showWarn=e=>E(c(TYPE_WARN),e),this.showError=e=>E(c(TYPE_ERROR),e),this.showAlerts=function(e){return e&&(e.msgOk&&s(c(TYPE_OK),e.msgOk),e.msgInfo&&s(c(TYPE_INFO),e.msgInfo),e.msgWarn&&s(c(TYPE_WARN),e.msgWarn),e.msgError)&&s(c(TYPE_ERROR),e.msgError),r.working()},this.closeAlerts=function(){return n.forEach(a),r},t.forEach(t=>t.addEventListener("click",e=>a(t))),()=>n.forEach(e=>{e.innerHTML&&s(e,e.innerHTML)}));coll.ready(()=>setTimeout(h,1)),window.loading=r.loading,window.working=r.working,window.showAlerts=(e,t,n)=>r.showAlerts(coll.parse(n?.msgs))}export default new Alerts;