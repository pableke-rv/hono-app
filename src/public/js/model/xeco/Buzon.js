
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";

function Buzon() {
	const self = this; //self instance
    var tipoPago, justPagoRequired;

	this.isIsu = data => sb.starts(data.oCod, "300518") && ((data.omask & 8) == 8);
    this.setTipoPago = tipo => { tipoPago = tipo; return self; }
    this.isPagoProveedor = () => (tipoPago == 1);
    this.isPagoCesionario = () => (tipoPago == 2);
    this.setJustPagoRequired = required => { justPagoRequired = required; return self; }
    this.isJustPagoRequired = () => justPagoRequired;

	this.lastRow = count => {
        return `<tr class="tb-data">
            <td class="text-center">${count}</td>
            <td id="otras" colspan="5">OTRAS SITUACIONES (acciones provisionalmente sin orgánica u otras circunstancias)</td>
            <td class="text-right">
                <a href="#buzon-otros" class="action action-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
            </td>
        </tr>`;
    }
	this.row = (data, status) => {
        const anclar = '<a href="#anclar" class="action action-red row-action" title="Marca la orgánica como favorita"><i class="fas fa-thumbtack action action-blue"></i></a>';
        const desanclar = '<a href="#desanclar" class="action action-red row-action" title="Marca la orgánica como normal"><i class="fas fa-thumbtack action action-green"></i></a>';
        const remove = (data.mask & 1) ? '<a href="#remove" class="action action-red row-action" title="Desvincular orgánica"><i class="fas fa-times"></i></a>' : "";
        const last = (status.count == status.size) ? self.lastRow(status.count + 1) : "";
        return `<tr class="tb-data">
            <td class="text-center">${status.count}</td>
            <td>${data.oCod}</td><td>${data.oDesc}</td>
            <td class="text-center">${data.utCod}</td><td>${data.utDesc}</td>
            <td class="text-right">${i18n.isoFloat(data.cd)} €</td>
            <td class="text-right">
                ${(data.mask & 2) ? desanclar : anclar}
                <a href="#report" class="action action-blue row-action" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>
                <a href="#buzon" class="action action-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
                ${remove}
            </td>
        </tr>` + last;
    }
    this.tfoot = resume => `<tr><td colspan="99">Filas: ${resume.size + 1}</td></tr>`;

    this.isValidOrganica = function(data) {
        const valid = i18n.getValidators();
        valid.isKey("organica", data.idOrg, "No ha seleccionado correctamente la orgánica"); // autocomplete required number
        valid.isKey("tramit", data.tramit, "Unidad tramitadora no encontrada"); // select required number
        return valid.catch("Orgánica / Unidad Tramitadora no seleccionada correctamente.");
    }
    this.validate = function(data) {
    	return self.isValidOrganica(data);
    	// extra validations......
    }
}

export default new Buzon();
