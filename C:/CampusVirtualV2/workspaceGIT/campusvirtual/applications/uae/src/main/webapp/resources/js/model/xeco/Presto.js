import coll from"../../components/Collection.js";import solicitud from"./Solicitud.js";import i18n from"../../i18n/langs.js";function Partida(l){const n=this,e="No ha seleccionado correctamente la orgánica";let s;this.getData=()=>s,this.setData=t=>(s=t,n),this.isAnticipada=t=>4&t.mask,this.isExcedida=t=>(l.isAnt()||"642"==t.e)&&Number.isNumber(t.ih)&&t.ih+.01<t.imp,this.isAfectada=t=>1&t,this.thead=()=>{return`<tr>
            <th></th>
            <th>Ej.</th>
            <th>Orgánica</th>
            <th class="hide-sm">Descripción Orgánica</th>
            <th class="hide-sm">FA</th>
            <th>Eco.</th>
            <th class="hide-sm">Descripción Económica</th>
            ${l.isPartidaExt()?"<th>Prev. Ingresos (A)</th><th>GG &#37; (B)</th><th>Max. Habilitar (C=A-B)</th><th>Crédito Habilitado (D)</th><th>Margen (E=C-D)</th>":""}
            <th>Importe</th>
            <th></th>
        </tr>`},this.row=(t,i,a)=>{var e="N/A",s=n.isExcedida(t)?'<span class="text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>':"",c=n.isAnticipada(t)?'<span class="text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>':"",d=l.is030()?'<a href="#doc030" class="fal fa-money-bill-alt action text-green row-action" title="Asociar los datos del documento 030"></a>':"",r=l.isEditable()&&!l.isAfc()?'<a href="#remove" class="fas fa-times action text-red row-action" title="Desasociar partida"></a>':"";a.imp+=t.imp;let o="";return l.isPartidaExt()&&(o=`<td class="text-right">${i18n.isoFloat(t.ing)||e} €</td>
                        <td class="text-right">${i18n.isoFloat(t.gg)||e} €</td>
                        <td class="text-right">${i18n.isoFloat(t.mh)||e} €</td>
                        <td class="text-right">${i18n.isoFloat(t.ch)||e} €</td>
                        <td class="text-right">${i18n.isoFloat(t.ih)||e} €</td>`),`<tr class="tb-data">
            <td class="text-center">${s}${c}</td>
            <td class="text-center">${t.ej}</td>
            <td>${t.o}</td>
            <td class="hide-sm">${t.dOrg}</td>
            <td class="text-center hide-sm">${i18n.boolval(n.isAfectada(t.omask))}</td>
            <td class="text-center">${t.e}</td>
            <td class="hide-sm">${t.dEco}</td>
            ${o}
            <td class="text-right">${i18n.isoFloat(t.imp)} €</td>
            <td class="text-center">${d}${r}</td>
        </tr>`},this.tfoot=t=>{var i=l.isPartidaExt()?"<td></td><td></td><td></td><td></td><td></td>":"";return`<tr>
            <td colspan="3">Partidas: ${t.size}</td>
            <td class="hide-sm"></td><td class="hide-sm"></td><td></td><td class="hide-sm"></td>
            ${i}
            <td class="text-right">${i18n.isoFloat(t.imp)} €</td><td></td>
        </tr>`},this.validate=t=>{var i=i18n.getValidators();return i.isKey("acOrgInc",t.idOrgInc,e),i.isKey("idEcoInc",t.idEcoInc,"Debe seleccionar una económica"),i.gt0("impInc",t.impInc),i.catch("No ha seleccionada correctamente la partida a incrementar.")},this.validate030=t=>{var i=i18n.getValidators();if(!s)return i.reject("No se ha encontrado la partida asociada al documento 080.");i.isKey("acOrg030",t.idOrg030,e),i.isKey("idEco030",t.idEco030,"Debe seleccionar una económica"),i.gt0("imp030",t.imp030);var a=t.acOrg030?.split(" - ");return a?s.imp<t.imp030?i.setInputError("imp030","errExceeded","El importe del documento 030 excede al del 080."):(s.idOrg030=+t.idOrg030,[s.o030,s.dOrg030]=a,s.idEco030=t.idEco030,s.imp030=t.imp030,i):i.setError("No ha seleccionada correctamente la aplicación para el DC 030.","acOrg030",e)}}function Partidas(t){const i=this,a=new Partida(t);let e,s;this.getData=()=>e,this.setPartidas=t=>(e=t,i),this.setData=t=>(s=t.getResume(),i.setPartidas(t.getData())),this.size=()=>coll.size(e),this.getImporte=()=>s.imp,this.getPartida=()=>a,this.setPrincipal=()=>(e.sort((t,i)=>i.imp-t.imp),e[0].mask|=1,i),this.validate=()=>{var t=i18n.getValidation();return e.length?t:t.setInputError("acOrgInc","errRequired","Debe seleccionar al menos una partida a incrementar")},this.validatePartida=i=>!e.find(t=>t.o==i.o&&t.e==i.e)}function Presto(){const s=this,c=new Partidas(s);let i;this.setData=t=>(i=t,solicitud.setData(t),t.titulo=i18n.getItem("descTipos",t.tipo-1),s),this.getPartidas=()=>c,this.getPartida=c.getPartida,this.isTcr=()=>1==solicitud.getTipo(),this.isFce=()=>6==solicitud.getTipo(),this.isL83=()=>3==solicitud.getTipo(),this.isGcr=()=>4==solicitud.getTipo(),this.isAnt=()=>5==solicitud.getTipo(),this.isAfc=()=>8==solicitud.getTipo(),this.is030=()=>solicitud.isUae()&&(s.isGcr()||s.isAnt()),this.isDisabled=solicitud.isDisabled,this.isEditable=solicitud.isEditable,this.isFirmable=solicitud.isFirmable,this.isRechazable=solicitud.isRechazable,this.isEditableUae=solicitud.isEditableUae,this.isEjecutable=()=>solicitud.isUae()&&solicitud.isPendiente()||solicitud.isEjecutable(),this.isIntegrable=()=>!s.isAfc()&&solicitud.isIntegrable(),this.isUrgente=solicitud.isUrgente,this.isImpCd=()=>s.isEditable()&&!s.isAnt(),this.getAdjunto=()=>i.file,this.isPartidaDec=()=>s.isTcr()||s.isL83()||s.isAnt()||s.isAfc(),this.isMultipartida=()=>s.isTcr()||s.isFce()||s.isGcr(),this.showPartidasInc=()=>s.isMultipartida()&&s.isEditable()&&c.size()<20,this.isPartidaExt=()=>s.isGcr()||s.isAnt(),this.isDisableEjInc=()=>s.isDisabled()||s.isTcr()||s.isFce(),this.isAutoLoadImp=()=>s.isL83()||s.isAnt()||s.isAfc(),this.isAutoLoadInc=()=>s.isL83()||s.isAnt(),this.isAnticipada=()=>4&i.mask,this.isExcedida=()=>8&i.mask,this.getSubtipo=solicitud.getSubtipo,this.setSubtipo=solicitud.setSubtipo,this.getMemo=()=>i.memo,this.row=t=>{s.setData(t);var i=1&t.mask?"<span> (y otras)</span>":"";let a="<td></td>",e=(s.isUrgente()&&(a=`<td class="text-center text-red text-xl" title="${t.name}: ${t.extra}">&#33;</td>`),(solicitud.isUae()||solicitud.isOtri())&&s.isAnticipada()&&(a='<td class="text-center text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</td>'),(solicitud.isUae()||solicitud.isOtri())&&s.isExcedida()&&(a='<td class="text-center text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</td>'),'<a href="#rcView" class="row-action"><i class="fas fa-search action text-blue"></i></a>');return s.isFirmable()&&(e+=`<a href="#rcFirmar" class="row-action firma-${t.id}" data-confirm="msgFirmar"><i class="fas fa-check action text-green"></i></a>
                         <a href="#tab-11" class="row-action firma-${t.id}"><i class="fas fa-times action text-red"></i></a>`),s.isEditable()||(e+='<a href="#rcReport" class="row-action"><i class="fal fa-file-pdf action text-red"></i></a>'),s.isIntegrable()&&(e+='<a href="#rcIntegrar" class="row-action" data-confirm="msgIntegrar"><i class="far fa-save action text-blue"></i></a>'),s.isEjecutable()&&(e+='<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action text-green"></i></a>'),solicitud.isAdmin()&&(e+='<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action text-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action text-red"></i></a>'),`<tr class="tb-data">
            ${a}
            <td class="text-center"><a href="#rcView" class="row-action">${t.codigo}</a></td>
            <td class="hide-sm">${t.titulo}</td>
            <td class="${solicitud.getStyleByEstado(t)} estado-${t.id}">${solicitud.getDescEstado()}</td>
            <td class="text-center">${solicitud.getFirma().myFlag(t.fmask,t.info)}</td>
            <td class="hide-sm">${t.sig||""}</td>
            <td title="${t.oIncDesc}">${t.orgInc}${i}</td>
            <td class="text-center" title="${t.eIncDesc}">${t.ecoInc}</td>
            <td class="text-right">${i18n.isoFloat(t.imp)} €</td>
            <td class="text-center hide-xs">${i18n.isoDate(t.fCreacion)}</td>
            <td class="hide-sm">${t.name}</td>
            <td class="hide-md">${t.memo}</td>
            <td class="text-right">${e}</td>
        </tr>`},this.tfoot=t=>`<tr><td colspan="99">Solicitudes: ${t.size}</td></tr>`,this.validate=t=>{var i=i18n.getValidators(),a=(i.isKey("acOrgDec",t.idOrgDec,"Debe seleccionar la orgánica que disminuye"),i.isKey("idEcoDec",t.idEcoDec,"Debe seleccionar la económica que disminuye"),i.catch("No ha seleccionada correctamente la partida que disminuye."),t.impDec??0),e=(s.isPartidaDec()&&c.getImporte()!=a&&i.setInputError("impDec","notValid","¡Los importes a decrementar e incrementar no coinciden!"),s.isAnt()?a:t.cd??0);return e<a&&i.setInputError("impDec","errExceeded","El importe de la partida que disminuye supera el crédito disponible"),i.size("memo",t.memo).catch("Debe asociar una memoria justificativa a la solicitud."),"2"==t.urgente&&(i.size("extra",t.extra).catch("Debe indicar un motivo para la urgencia de esta solicitud."),i.geToday("fMax",t.fMax).catch("Debe indicar una fecha maxima de resolución para esta solicitud.")),c.validate()}}export default new Presto;