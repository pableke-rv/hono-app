import Form from"../../components/Form.js";import tabs from"../../components/Tabs.js";import pf from"../../components/Primefaces.js";import solicitud from"../../model/xeco/Solicitud.js";import uxxiec from"../../model/xeco/Uxxiec.js";import i18n from"../../i18n/langs.js";export default(e,o)=>{var r=tabs.getTab(15);solicitud.setUser(r.dataset);const i=new Form("#xeco-uxxi"),t=i.setTable("#docs-uxxi",{msgEmptyTable:"No se han encontrado documentos de UXXI-EC asociadas a la solicitud",onRender:uxxiec.row,onFooter:uxxiec.tfoot}),a=i.setAutocomplete("#uxxi",{minLength:4,source:e=>window.rcFindUxxi(pf.param("term",e)),render:uxxiec.autocomplete,select:e=>e.id}),s=(i.setClick("a#add-uxxi",()=>{var e=a.getCurrentItem();e&&t.add(e),a.reload()}),window.loadUxxiec=(e,o,r)=>{window.showTab(e,o,r,15)&&t.render(JSON.read(r.operaciones))},window.saveUxxiec=(e,o,r)=>{i.saveTable("#docs-json",t).loading()},new Form("#xeco-reject")),d=new Form("#xeco-filter"),c=d.setTable("#solicitudes",{msgEmptyTable:"No se han encontrado solicitudes para a la búsqueda seleccionada",onRender:e.row,onFooter:e.tfoot}),n=(c.setActions(document),(e,o)=>pf.sendId(e,o.id));c.set("#rcView",e=>{o.isCached(e.id)?tabs.showTab(1):n("rcView",e),s.setCache(e.id)}),c.set("#rcFirmar",e=>n("rcFirmar",e)),c.set("#tab-11",e=>{if(s.isCached(e.id))return tabs.showTab(11);s.restart("#rechazo").setCache(e.id),tabs.render(".load-data",e),n("rcFirmas",e)}),c.set("#rcReport",e=>n("rcReport",e)),c.set("#rcUxxiec",e=>{if(i.isCached(e.id))return tabs.showTab(15);i.restart("#uxxi").setCache(e.id).setVisible(".show-ejecutable",solicitud.isEjecutable(e)),tabs.render(".load-data",e),n("rcUxxiec",e)}),c.set("#rcEmails",e=>n("rcEmails",e)),c.set("#rcRemove",e=>n("rcRemove",e)),c.set("#rcIntegrar",(e,o)=>{n("rcIntegrar",e),o.hide().closest("tr").querySelectorAll(".estado").text("Procesando...")});r=d.querySelector("#solicitudes-json");c.render(JSON.read(r?.innerHTML)),o.resetCache(),window.onList=()=>d.setData({fMiFirma:"5"}).loading(),window.fnFirmar=()=>i18n.confirm("msgFirmar")&&window.loading(),window.fnRechazar=()=>s.isValid(solicitud.validateReject)&&i18n.confirm("msgRechazar")&&window.loading(),window.handleReport=(e,o,r)=>window.showAlerts(e,o,r).redir(r?.url),window.loadFiltro=(e,o,r)=>{window.showTab(e,o,r,2)&&c.render(JSON.read(r.data))},window.updateList=(e,o,r)=>{window.showTab(e,o,r,2)&&(c.querySelectorAll(".firma-"+r.id).hide(),c.querySelectorAll(".estado-"+r.id).text("Procesando..."))}};