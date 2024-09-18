
import i18n from "../../i18n/langs.js";
import Solicitud from "./Solicitud.js";

function Linea(factura) {
	//const self = this; //self instance

    this.row = (data, status, resume) => {
        resume.imp += data.imp; // sum
        const remove = factura.isEditable() ? '<a href="#remove" class="fas fa-times action resize text-red row-action" title="Desasociar partida"></a>' : "";
        return `<tr class="tb-data">
            <td class="text-center">${status.count}</td>
            <td>${data.desc}</td><td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center">${remove}</td>
        </tr>`;
    }
    this.tfoot = resume => {
        const iva = factura.getIva();
        const show = factura.isFacturable() ? "" : "hide";
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
        const valid = i18n.getValidators();
        valid.gt0("imp", data.imp); // float required
        valid.size("desc", data.desc); // string required
        return valid.catch("El concepto indicado no es válido!"); // Main form message
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
        const valid = i18n.getValidation(); // Continue with validation without reset
        const msg = "Debe detallar los conceptos asociados a la solicitud.";
        return data.length ? valid : valid.setInputError("desc", "errRequired", msg);
    }
}

const titulos = [ "-", "Factura", "Abono", "Carta de Pago", "Recibo de Alumno" ];

class Factura extends Solicitud {
    #lineas = new Lineas(this);

	setData(data) {
        super.setData(data);
        data.titulo = titulos[data.tipo] || titulos[1]; // default factura
        return this.setIva(data.iva);
    }

	getLineas() { return this.#lineas; }
	setLineas(table) { this.#lineas.setData(table.getData()); return this; }
	getLinea() { return this.#lineas.getLinea(); }

	isFactura() { return (super.getTipo() == 1); }
    //isAbono() { return (super.getTipo() == 2); }
	isCartaPago() { return (super.getTipo() == 3); }
	isReciboCV() { return (super.getTipo() == 4); }
	isFacturable() { return (this.isFactura() || this.isReciboCV()); }
	isFirmaGaca() { return this.isReciboCV() && this.isTtpp() && (super.get("mask") & 2); }

	isTtpp() { return (super.getSubtipo() == 3); }
	isTituloOficial() { return (super.getSubtipo() == 4); }
	isExtension() { return (super.getSubtipo() == 9); }
	isDeportes() { return (super.getSubtipo() == 10); }
	isRecibo() { return (this.isTtpp() || this.isTituloOficial() || this.isExtension()); }
	setSujeto(val) { return this.set("sujeto", val); }
	isExento() { return !super.get("sujeto"); }

	getIva() { return super.get("iva"); }
	setIva(imp) { return this.set("iva", imp ?? 0); }

	isFace() { return (this.get("face") == 1); } //factura electronica FACe
	isPlataforma() { return (this.get("face") == 2); } //factura electronica Otras
	setFace(val) { return this.set("face", val); } // update plataforma

	row(data) {
        this.setData(data); // initialize 
        let acciones = '<a href="#rcView" class="row-action"><i class="fas fa-search action resize text-blue"></i></a>';
        if (this.isFirmable())
            acciones += `<a href="#rcFirmar" class="row-action resize firma-${data.id}" data-confirm="msgFirmar"><i class="fas fa-check action resize text-green"></i></a>
                         <a href="#tab-11" class="row-action resize firma-${data.id}"><i class="fas fa-times action resize text-red"></i></a>`;
        if (this.isIntegrable())
            acciones += '<a href="#rcIntegrar" class="row-action" data-confirm="msgIntegrar"><i class="far fa-save action resize text-blue"></i></a>';
        if (this.isEjecutable())
            acciones += '<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action resize text-green"></i></a>';
        if (super.isAdmin())
            acciones += '<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action resize text-red"></i></a>';

        return `<tr class="tb-data">
            <td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
            <td class="hide-sm">${data.titulo}</td>
            <td class="${super.getStyleByEstado()} estado-${data.id}">${super.getDescEstado()}</td>
            <td class="text-center">${super.getFirma().myFlag(data.fmask, data.info)}</td>
            <td class="hide-sm">${data.sig || ""}</td>
            <td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
            <td>${data.nif}</td><td class="hide-xs">${data.tercero}</td>
            <td>${data.org}</td><td class="hide-sm">${data.descOrg}</td>
            <td class="hide-sm">${data.name}</td>
            <td class="text-right">${acciones}</td>
        </tr>`;
    }
	tfoot(resume) { return `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`; }

	validate(data) {
        const valid = i18n.getValidators();
        valid.isKey("acTercero", data.idTercero, "Debe seleccionar un tercero válido"); // autocomplete required key
        valid.isKey("acOrganica", data.idOrganica, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
		if (this.isRecibo()) //subtipo = ttpp o extension
            valid.size("acRecibo", data.acRecibo, "Debe indicar un número de recibo válido");
		/*if (this.isDeportes()) {
            valid.size("extra", data.extra, "errRequired").catch("Debe indicar un número de recibo válido"); // Required string
            valid.leToday("fMax", data.fMax).catch("Debe indicar la fecha del recibo asociado"); // Required date
        }*/
        valid.size("memo", data.memo).catch("Debe indicar las observaciones asociadas a la solicitud."); // Required string
        if (this.isFace())
            valid.size("og", data.og) && valid.size("oc", data.oc) && valid.size("ut", data.ut);
        if (this.isPlataforma())
            valid.size("og", data.og);
        return this.#lineas.validate();
    }
}

export default new Factura();
