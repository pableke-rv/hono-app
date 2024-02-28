
import solicitud from "./Solicitud.js";
import i18n from "../i18n/langs.js";

function Linea(factura) {
	const self = this; //self instance

    this.row = (data, status, resume) => {
        resume.imp += data.imp; // sum
        const remove = factura.isEditable() ? '<a href="#remove" class="fas fa-times action action-red row-action" title="Desasociar partida"></a>' : "";
        return `<tr class="tb-data">
            <td class="text-center">${status.count}</td>
            <td>${data.desc}</td><td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center">${remove}</td>
        </tr>`;
    }
    this.tfoot = resume => {
        const iva = factura.getIva();
        const show = factura.isFactura() ? "" : "hide";
        return `<tr>
            <td colspan="2">Conceptos: ${resume.size}</td>
            <td class="text-right">${i18n.isoFloat(resume.imp)} €</td>
            <td></td>
        </tr>
        <tr class="${show}">
            <td colspan="2">
                <label class="ui-blocks">
                <div class="ui-block-main text-right">IVA:</div>
                <div class="ui-block">
                    <select id="iva" name="iva" class="ui-input ui-select ui-number ui-fiscal editable-uae" tabindex="32"></select>
                </div>
                </label>
            </td>
            <td id="imp-iva" class="text-right">${i18n.isoFloat(iva)} €</td>
            <td></td>
        </tr>
        <tr class="${show}">
            <td class="text-right" colspan="2">Importe Total:</td>
            <td id="imp-total" class="text-right">${i18n.isoFloat(resume.imp * (iva / 100))} €</td>
            <td></td>
        </tr>`;
    }

    this.validate = function(data) {
        let ok = i18n.reset().gt0("imp", data.imp); // float required
        ok = i18n.size("desc", data.desc) && ok; // string required
        return ok || i18n.reject("El concepto indicado no es válido!"); // Main form message
    }
}

function Lineas(factura) {
	const self = this; //self instance
    const linea = new Linea(factura);

    let data; // Current presto data type
    this.getData = () => data;
    this.setData = lineas => {
        data = lineas;
        return self;
    }

    this.getLinea = () => linea;
    this.size = () => JSON.size(data);
    this.isEmpty = () => !self.size();

    this.validate = () => { // Todas las solicitudes tienen partidas a incrementar
        return data.length || !i18n.setInputError("desc", "errRequired", "Debe detallar los conceptos asociados a la solicitud.");
    }
}

function Factura() {
	const self = this; //self instance
    const lineas = new Lineas(self);

    let _data; // Current instance
    this.setData = data => {
        _data = data; // Update instance
        solicitud.setData(data);
        data.titulo = (data.tipo == 1) ? "Factura" : "Carta de pago";
        return self.setIva(data.iva);
    }

    this.getLineas = () => lineas;
    this.setLineas = table => { lineas.setData(table); return self; }
    this.getLinea = lineas.getLinea;

    this.isFactura = () => (solicitud.getTipo() == 1);
    this.isCartaPago = () => (solicitud.getTipo() == 3);

    this.isDisabled = () => solicitud.isDisabled();
    this.isEditable = () => solicitud.isEditable();
    this.isFirmable = () => solicitud.isFirmable();
    this.isRechazable = () => solicitud.isRechazable();
	this.isEditableUae = () => solicitud.isEditableUae();
	this.isEjecutable = () => solicitud.isEjecutable();
	this.isIntegrable = () => solicitud.isIntegrable();
    this.isFirmaGaca = () => solicitud.isUae() && self.isTtpp();

    this.getSubtipo = () => solicitud.getSubtipo();
    this.setSubtipo = val => { solicitud.set("subtipo", val); return self; }
    this.isTtpp = () => (solicitud.getSubtipo() == 3);
    this.isTituloOficial = () => (solicitud.getSubtipo() == 4);
    this.isExtension = () => (solicitud.getSubtipo() == 9);
    this.isDeportes = () => (solicitud.getSubtipo() == 10);
    this.isRecibo = () => (self.isTtpp() || self.isTituloOficial() || self.isExtension());
    this.setSujeto = val => { _data.sujeto = val; return self; }
    this.isExento = () => !_data.sujeto;

    this.getIva = () => _data.iva;
    this.setIva = imp => {
        solicitud.set("iva", imp ?? 0);
        return self;
    }

    this.isFace = () => (_data.face == 1); //factura electronica FACe
    this.isPlataforma = () => (_data.face == 2); //factura electronica Otras
    this.setFace = val => { _data.face = val; return self; }

    this.row = data => {
        self.setData(data); // initialize 
        let acciones = '<a href="#rcView" class="row-action"><i class="fas fa-search action action-blue"></i></a>';
        if (self.isFirmable())
            acciones += `<a href="#rcFirmar" class="row-action firma-${data.id}" data-confirm="msgFirmar"><i class="fas fa-check action action-green"></i></a>
                         <a href="#tab-11" class="row-action firma-${data.id}"><i class="fas fa-times action action-red"></i></a>`;
        if (self.isIntegrable())
            acciones += '<a href="#rcIntegrar" class="row-action" data-confirm="msgIntegrar"><i class="far fa-save action action-blue"></i></a>';
        if (self.isEjecutable())
            acciones += '<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action action-green"></i></a>';
        if (solicitud.isAdmin())
            acciones += '<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action action-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action action-red"></i></a>';

        return `<tr class="tb-data">
            <td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
            <td class="hide-sm">${data.titulo}</td>
            <td class="${solicitud.getStyleByEstado()} estado-${data.id}">${i18n.getItem("descEstados", data.estado)}</td>
            <td class="text-center">${solicitud.getFirma().myFlag(data.fmask, data.info)}</td>
            <td class="hide-sm">${data.sig || ""}</td>
            <td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
            <td>${data.nif}</td><td>${data.tercero}</td>
            <td>${data.org}</td><td class="hide-sm">${data.descOrg}</td>
            <td class="hide-sm">${data.name}</td>
            <td class="text-right">${acciones}</td>
        </tr>`;
    }
    this.tfoot = resume => `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`;

    this.validate = function(data) {
        let ok = i18n.reset().isKey("acTercero", data.idTercero, "Debe seleccionar un tercero válido"); // autocomplete required key
        ok = i18n.isKey("acOrganica", data.idOrganica, "No ha seleccionado correctamente la orgánica") && ok; // autocomplete required key
		ok = (self.isRecibo()) ? i18n.size("acRecibo", data.acRecibo, "Debe indicar un número de recibo válido") : ok; //subtipo = ttpp o extension
		/*if (self.isDeportes()) {
            ok = i18n.size("extra", data.extra, "errRequired") ? ok : i18n.reject("Debe indicar un número de recibo válido"); // Required string
            ok = i18n.leToday("fMax", data.fMax) ? ok : i18n.reject("Debe indicar la fecha del recibo asociado"); // Required date
        }*/
        ok = i18n.size("memo", data.memo) ? ok : i18n.reject("Debe indicar las observaciones asociadas a la solicitud."); // Required string
        ok = self.isFace() ? (i18n.size("og", data.og) && i18n.size("oc", data.oc) && i18n.size("ut", data.ut)) : ok;
        ok = self.isPlataforma() ? i18n.size("og", data.og) : ok;
        return lineas.validate() && ok;
    }
}

export default new Factura();
