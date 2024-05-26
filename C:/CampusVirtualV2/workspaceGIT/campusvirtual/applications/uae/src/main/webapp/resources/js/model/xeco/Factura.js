import solicitud from"./Solicitud.js";import i18n from"../../i18n/langs.js";function Linea(a){this.row=(t,i,s)=>{s.imp+=t.imp;s=a.isEditable()?'<a href="#remove" class="fas fa-times action text-red row-action" title="Desasociar partida"></a>':"";return`<tr class="tb-data">
            <td class="text-center">${i.count}</td>
            <td>${t.desc}</td><td class="text-right">${i18n.isoFloat(t.imp)} €</td>
            <td class="text-center">${s}</td>
        </tr>`},this.tfoot=t=>{var i=a.getIva(),s=a.isFactura()?"":"hide";return`<tr>
            <td colspan="2">Conceptos: ${t.size}</td>
            <td class="text-right">${i18n.isoFloat(t.imp)} €</td>
            <td></td>
        </tr>
        <tr class="${s}">
            <td colspan="2">
                <label class="ui-blocks">
                <div class="ui-block-main text-right">IVA:</div>
                <div class="ui-block">
                    <select id="iva" name="iva" class="ui-input ui-select ui-number ui-fiscal editable-uae" tabindex="32"></select>
                </div>
                </label>
            </td>
            <td id="imp-iva" class="text-right">${i18n.isoFloat(i)} €</td>
            <td></td>
        </tr>
        <tr class="${s}">
            <td class="text-right" colspan="2">Importe Total:</td>
            <td id="imp-total" class="text-right">${i18n.isoFloat(t.imp*(i/100))} €</td>
            <td></td>
        </tr>`},this.validate=function(t){var i=i18n.getValidators();return i.gt0("imp",t.imp),i.size("desc",t.desc),i.catch("El concepto indicado no es válido!")}}function Lineas(t){const i=this,s=new Linea(t);let a;this.getData=()=>a,this.setData=t=>(a=t,i),this.getLinea=()=>s,this.size=()=>JSON.size(a),this.isEmpty=()=>!i.size(),this.validate=()=>{var t=i18n.getValidation();return a.length?t:t.setInputError("desc","errRequired","Debe detallar los conceptos asociados a la solicitud.")}}function Factura(){const s=this,a=new Lineas(s);let i;this.setData=t=>(i=t,solicitud.setData(t),t.titulo=1==t.tipo?"Factura":"Carta de pago",s.setIva(t.iva)),this.getLineas=()=>a,this.setLineas=t=>(a.setData(t.getData()),s),this.getLinea=a.getLinea,this.isFactura=()=>1==solicitud.getTipo(),this.isCartaPago=()=>3==solicitud.getTipo(),this.isDisabled=solicitud.isDisabled,this.isEditable=solicitud.isEditable,this.isFirmable=solicitud.isFirmable,this.isRechazable=solicitud.isRechazable,this.isEditableUae=solicitud.isEditableUae,this.isEjecutable=solicitud.isEjecutable,this.isIntegrable=solicitud.isIntegrable,this.isFirmaGaca=()=>solicitud.isUae()&&s.isTtpp(),this.getSubtipo=solicitud.getSubtipo,this.setSubtipo=solicitud.setSubtipo,this.isTtpp=()=>3==solicitud.getSubtipo(),this.isTituloOficial=()=>4==solicitud.getSubtipo(),this.isExtension=()=>9==solicitud.getSubtipo(),this.isDeportes=()=>10==solicitud.getSubtipo(),this.isRecibo=()=>s.isTtpp()||s.isTituloOficial()||s.isExtension(),this.setSujeto=t=>(i.sujeto=t,s),this.isExento=()=>!i.sujeto,this.getIva=()=>i.iva,this.setIva=t=>(solicitud.set("iva",t??0),s),this.isFace=()=>1==i.face,this.isPlataforma=()=>2==i.face,this.setFace=t=>(i.face=t,s),this.row=t=>{s.setData(t);let i='<a href="#rcView" class="row-action"><i class="fas fa-search action text-blue"></i></a>';return s.isFirmable()&&(i+=`<a href="#rcFirmar" class="row-action firma-${t.id}" data-confirm="msgFirmar"><i class="fas fa-check action text-green"></i></a>
                         <a href="#tab-11" class="row-action firma-${t.id}"><i class="fas fa-times action text-red"></i></a>`),s.isIntegrable()&&(i+='<a href="#rcIntegrar" class="row-action" data-confirm="msgIntegrar"><i class="far fa-save action text-blue"></i></a>'),s.isEjecutable()&&(i+='<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action text-green"></i></a>'),solicitud.isAdmin()&&(i+='<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action text-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action text-red"></i></a>'),`<tr class="tb-data">
            <td class="text-center"><a href="#rcView" class="row-action">${t.codigo}</a></td>
            <td class="hide-sm">${t.titulo}</td>
            <td class="${solicitud.getStyleByEstado()} estado-${t.id}">${solicitud.getDescEstado()}</td>
            <td class="text-center">${solicitud.getFirma().myFlag(t.fmask,t.info)}</td>
            <td class="hide-sm">${t.sig||""}</td>
            <td class="text-right">${i18n.isoFloat(t.imp)} €</td>
            <td class="text-center hide-xs">${i18n.isoDate(t.fCreacion)}</td>
            <td>${t.nif}</td><td>${t.tercero}</td>
            <td>${t.org}</td><td class="hide-sm">${t.descOrg}</td>
            <td class="hide-sm">${t.name}</td>
            <td class="text-right">${i}</td>
        </tr>`},this.tfoot=t=>`<tr><td colspan="99">Solicitudes: ${t.size}</td></tr>`,this.validate=function(t){var i=i18n.getValidators();return i.isKey("acTercero",t.idTercero,"Debe seleccionar un tercero válido"),i.isKey("acOrganica",t.idOrganica,"No ha seleccionado correctamente la orgánica"),s.isRecibo()&&i.size("acRecibo",t.acRecibo,"Debe indicar un número de recibo válido"),i.size("memo",t.memo).catch("Debe indicar las observaciones asociadas a la solicitud."),s.isFace()&&i.size("og",t.og)&&i.size("oc",t.oc)&&i.size("ut",t.ut),s.isPlataforma()&&i.size("og",t.og),a.validate()}}export default new Factura;