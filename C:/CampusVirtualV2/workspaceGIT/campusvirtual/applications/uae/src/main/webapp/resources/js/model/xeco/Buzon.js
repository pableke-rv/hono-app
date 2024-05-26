import sb from"../../components/StringBox.js";import i18n from"../../i18n/langs.js";function Buzon(){const o=this;var a,i;this.isIsu=t=>sb.starts(t.oCod,"300518")&&8==(8&t.omask),this.setTipoPago=t=>(a=t,o),this.isPagoProveedor=()=>1==a,this.isPagoCesionario=()=>2==a,this.setJustPagoRequired=t=>(i=t,o),this.isJustPagoRequired=()=>i,this.lastRow=t=>`<tr class="tb-data">
            <td class="text-center">${t}</td>
            <td id="otras" colspan="5">OTRAS SITUACIONES (acciones provisionalmente sin orgánica u otras circunstancias)</td>
            <td class="text-right">
                <a href="#buzon-otros" class="action text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
            </td>
        </tr>`,this.row=(t,a)=>{var i=4&t.mask?"#modal":"#report",s=a.count==a.size?o.lastRow(a.count+1):"";return`<tr class="tb-data">
            <td class="text-center">${a.count}</td>
            <td>${t.oCod}</td><td>${t.oDesc}</td>
            <td class="text-center">${t.utCod}</td><td>${t.utDesc}</td>
            <td class="text-right">${i18n.isoFloat(t.cd)} €</td>
            <td class="text-right">
                ${2&t.mask?'<a href="#desanclar" class="action text-red row-action" title="Marca la orgánica como normal"><i class="fas fa-thumbtack action text-green"></i></a>':'<a href="#anclar" class="action text-red row-action" title="Marca la orgánica como favorita"><i class="fas fa-thumbtack action text-blue"></i></a>'}
                <a href="${i}" class="action text-blue row-action" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>
                <a href="#buzon" class="action text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
            </td>
        </tr>`+s},this.tfoot=t=>`<tr><td colspan="99">Filas: ${t.size+1}</td></tr>`,this.isValidOrganica=function(t){var a=i18n.getValidators();return a.isKey("organica",t.idOrg,"No ha seleccionado correctamente la orgánica"),a.isKey("tramit",t.tramit,"Unidad tramitadora no encontrada"),a.catch("Orgánica / Unidad Tramitadora no seleccionada correctamente.")},this.validate=function(t){return o.isValidOrganica(t)}}export default new Buzon;