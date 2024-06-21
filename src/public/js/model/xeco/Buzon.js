
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";

function Buzon() {
	const self = this; //self instance
    var _data, tipoPago, justPagoRequired;

    this.getData = () => _data;
    this.setData = data => { _data = data; return self; }

    this.isIsu = () => sb.starts(_data.oCod, "300518") && ((_data.omask & 8) == 8);
    this.setTipoPago = tipo => { tipoPago = tipo; return self; }
    this.isPagoProveedor = () => (tipoPago == 1);
    this.isPagoCesionario = () => (tipoPago == 2);
    this.setJustPagoRequired = required => { justPagoRequired = required; return self; }
    this.isJustPagoRequired = () => justPagoRequired;

    this.isMonogrupo = () => !(_data.mask & 4);
    this.isMultigrupo = () => (_data.mask & 4);
    this.isResponsable = () => (_data.rol == 1);
    this.isUxxiec = () => (_data.rol == 2);
    this.isComprador = () => (_data.rol == 3);
    this.getRol = () => [ "Responsable", "UXXIEC", "Comprador", "Habilidato" ][_data.rol - 1];
    this.isRemovable = () => (_data.acc & 1);
    this.isUsuarios = () => (_data.acc & 2);

    this.lastRow = () => {
        return `<tr class="tb-data">
            <td id="otras" colspan="4">OTRAS SITUACIONES (acciones provisionalmente sin orgánica u otras circunstancias)</td>
            <td class="text-right">
                <a href="#buzon-otros" class="action resize text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
            </td>
        </tr>`;
    }
	this.row = data => {
        const report = self.setData(data).isMultigrupo() ? "#modal" : "#report"; // organica multigrupo / monogrupo
        const anclar = '<a href="#anclar" class="action resize text-red row-action" title="Marca la orgánica como favorita"><i class="fas fa-thumbtack action resize text-blue"></i></a>';
        const desanclar = '<a href="#desanclar" class="action resize text-red row-action" title="Marca la orgánica como normal"><i class="fas fa-thumbtack action resize text-green"></i></a>';
        const remove = self.isRemovable() ? '<a href="#remove" class="action resize text-red row-action" title="Desvincular orgánica"><i class="fas fa-times"></i></a>' : "";
        return `<tr class="tb-data">
            <td>${data.oCod}</td><td>${data.oDesc}</td>
            <td class="text-right">${i18n.isoFloat(data.cd)} €</td>
            <td class="text-center">${self.getRol()}</td>
            <td class="text-right">
                ${(data.mask & 2) ? desanclar : anclar}
                <a href="#users" class="action resize text-gray row-action" title="Gestión de permisos"><i class="fas fa-user"></i></a>
                <a href="#buzon" class="action resize text-warn row-action" title="Avance de Gastos"><i class="fab fa-google"></i></a>
                <a href="#buzon" class="action resize text-green row-action" title="Avance de Ingresos"><i class="fas fa-info"></i></a>
                <a href="${report}" class="action resize text-blue row-action" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>
                <a href="#buzon" class="action resize text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
                ${remove}
            </td>
        </tr>`;
    }
    this.tfoot = resume => `<tr><td colspan="99">Filas: ${resume.size}</td></tr>`;

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
