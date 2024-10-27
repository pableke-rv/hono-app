
import coll from "../../components/Collection.js";
import i18n from "../../i18n/langs.js";
import Solicitud from "./Solicitud.js";

function Partida(presto) {
	const self = this; //self instance
    const ERR_ORGANICA = "No ha seleccionado correctamente la orgánica";

    let data; // Current presto data type
    this.getData = () => data;
    this.setData = partida => { data = partida; return self; }

    this.isAnticipada = partida => (partida.mask & 4);
    this.isExcedida = partida => ((presto.isAnt() || (partida.e == "642")) && Number.isNumber(partida.ih) && ((partida.ih + .01) < partida.imp));
    this.isAfectada = mask => (mask & 1); // Es afectada? Si/No

    this.thead = () => {
        const output = presto.isPartidaExt() ? '<th>Prev. Ingresos (A)</th><th>GG &#37; (B)</th><th>Max. Habilitar (C=A-B)</th><th>Crédito Habilitado (D)</th><th>Margen (E=C-D)</th>' : "";
        return `<tr>
            <th></th>
            <th>Ej.</th>
            <th>Orgánica</th>
            <th class="hide-sm">Descripción Orgánica</th>
            <th class="hide-sm">FA</th>
            <th>Eco.</th>
            <th class="hide-sm">Descripción Económica</th>
            ${output}
            <th>Importe</th>
            <th></th>
        </tr>`;
    }
    this.row = (data, status, resume) => {
        const NO_APLICA = "N/A"; // default table float
        const excedido = self.isExcedida(data) ? '<span class="text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>' : "";
        const anticipada = self.isAnticipada(data) ? '<span class="text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>' : "";
        const doc030 = presto.is030() ? '<a href="#doc030" class="fal fa-money-bill-alt action resize text-green row-action" title="Asociar los datos del documento 030"></a>' : "";
        const remove = (presto.isEditable() && !presto.isAfc()) ? '<a href="#remove" class="fas fa-times action resize text-red row-action" title="Desasociar partida"></a>' : "";
        resume.imp += data.imp; // sum

        let output = "";
        if (presto.isPartidaExt()) {
            output = `<td class="text-right">${i18n.isoFloat(data.ing) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.gg) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.mh) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.ch) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.ih) || NO_APLICA} €</td>`;
        }
        return `<tr class="tb-data">
            <td class="text-center">${excedido}${anticipada}</td>
            <td class="text-center">${data.ej}</td>
            <td>${data.o}</td>
            <td class="hide-sm">${data.dOrg}</td>
            <td class="text-center hide-sm">${i18n.boolval(self.isAfectada(data.omask))}</td>
            <td class="text-center">${data.e}</td>
            <td class="hide-sm">${data.dEco}</td>
            ${output}
            <td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center">${doc030}${remove}</td>
        </tr>`;
    }
    this.tfoot = resume => {
        const output = presto.isPartidaExt() ? '<td></td><td></td><td></td><td></td><td></td>' : "";
        return `<tr>
            <td colspan="3">Partidas: ${resume.size}</td>
            <td class="hide-sm"></td><td class="hide-sm"></td><td></td><td class="hide-sm"></td>
            ${output}
            <td class="text-right">${i18n.isoFloat(resume.imp)} €</td><td></td>
        </tr>`;
    }

    this.validate = data => {
        const valid = i18n.getValidators();
        valid.isKey("acOrgInc", data.idOrgInc, ERR_ORGANICA); // autocomplete required key
        valid.isKey("idEcoInc", data.idEcoInc, "Debe seleccionar una económica"); // select required number
        valid.gt0("impInc", data.impInc); // float number > 0
        return valid.close("No ha seleccionada correctamente la partida a incrementar.");
    }
    this.validate030 = data030 => {
        const valid = i18n.getValidators();
        if (!data) // Debo cargar previamente la partida seleccionada
            return !valid.setError("No se ha encontrado la partida asociada al documento 080.");
        valid.isKey("acOrg030", data030.idOrg030, ERR_ORGANICA); // autocomplete required key
        valid.isKey("idEco030", data030.idEco030, "Debe seleccionar una económica"); // select required number
        valid.gt0("imp030", data030.imp030); // float number > 0
        const label = data030.acOrg030?.split(" - ");
        if (!label) // Code separator
            return !valid.addError("acOrg030", ERR_ORGANICA, "No ha seleccionada correctamente la aplicación para el DC 030.");
        if (data.imp < data030.imp030)
            return !valid.addError("imp030", "errExceeded", "El importe del documento 030 excede al del 080.");
        // If ok => update partida a incrementar
        data.idOrg030 = +data030.idOrg030;
        [ data.o030, data.dOrg030 ] = label;
        data.idEco030 = data030.idEco030;
        data.imp030 = data030.imp030;
        return valid.isOk();
    }
}

function Partidas(presto) {
	const self = this; //self instance
    const partida = new Partida(presto);

    let data, resume; // Current data table
    this.getData = () => data;
    this.setPartidas = partidas => {
        data = partidas;
        return self;
    }
    this.setData = table => {
        resume = table.getResume();
        return self.setPartidas(table.getData());
    }

    this.size = () => coll.size(data);
    this.getImporte = () => resume.imp;
    this.getPartida = () => partida;

    this.setPrincipal = () => {
        data.sort((a, b) => (b.imp - a.imp)); //orden por importe desc.
        data[0].mask |= 1; //marco la primera como principal
        return self;
    }

    const MSG_ERR_INC = "Debe seleccionar al menos una partida a incrementar";
    this.validate = () => { // Todas las solicitudes tienen partidas a incrementar
        const valid = i18n.getValidation(); // Continue with validation without reset
        return data.length ? valid.isOk() : !valid.addRequired("acOrgInc", MSG_ERR_INC);
    }
    this.validatePartida = partida => { // compruebo si la partida existía previamente
        const valid = i18n.getValidation(); // Continue with validation without reset
        if (!partida)
            return !valid.addRequired("acOrgInc", MSG_ERR_INC);
        if (data.find(row => ((row.o == partida.o) && (row.e == partida.e))))
            return !valid.addError("acOrgInc", "notAllowed", "¡Partida ya asociada a la solicitud!");
        return true;
    }
}

class Presto extends Solicitud {
    #partidas = new Partidas(this);

    setData(data) {
        super.setData(data); // Update data instance
        data.titulo = i18n.getItem("descTipos", data.tipo - 1);
        return this;
    }

    get partidas() { return this.#partidas; }
    getPartidas() { return this.partidas; }
    getPartida = this.partidas.getPartida;

	isTcr() { return (super.tipo == 1); }
	isFce() { return (super.tipo == 6); }
	isL83() { return (super.tipo == 3); }
	isGcr() { return (super.tipo == 4); }
	isAnt() { return (super.tipo == 5); }
	isAfc() { return (super.tipo == 8); }
	is030() { return (super.isUae() && (this.isGcr() || this.isAnt())); }

	isEjecutable() { return ((super.isUae() && super.isPendiente()) || super.isEjecutable()); }
	isIntegrable() { return (!this.isAfc() && super.isIntegrable()); }
	isImpCd() { return (this.isEditable() && !this.isAnt()); }
	getAdjunto() { return super.get("file"); }

    isPartidaDec() { return (this.isTcr() || this.isL83() || this.isAnt() || this.isAfc()); }
	isMultipartida() { return (this.isTcr() || this.isFce() || this.isGcr()); }
	showPartidasInc() { return (this.isMultipartida() && this.isEditable() && (this.partidas.size() < 20)); }
	isPartidaExt() { return (this.isGcr() || this.isAnt()); }
	isDisableEjInc() { return (this.isDisabled() || this.isTcr() || this.isFce()); }
	isAutoLoadImp() { return (this.isL83() || this.isAnt() || this.isAfc()); }
	isAutoLoadInc() { return (this.isL83() || this.isAnt()); }
	hasMultipartida() { return (super.mask & 1); }
	isAnticipada() { return (super.mask & 4); }
	isExcedida() { return (super.mask & 8); }
	getMemo() { return super.get("memo"); }

	row(data) {
        const self = Presto.self(); // current instance
        const otras = self.setData(data).hasMultipartida() ? "<span> (y otras)</span>" : "";

        let info = '<td></td>';
        if (self.isUrgente())
            info = `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>`;
        if ((self.isUae() || self.isOtri()) && self.isAnticipada())
            info = '<td class="text-center text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</td>';
        if ((self.isUae() || self.isOtri()) && self.isExcedida())
            info = '<td class="text-center text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</td>';

        let acciones = '<a href="#rcView" class="row-action"><i class="fas fa-search action resize text-blue"></i></a>';
        if (self.isFirmable())
            acciones += `<a href="#rcFirmar" class="row-action resize firma-${data.id}" data-confirm="msgFirmar"><i class="fas fa-check action resize text-green"></i></a>
                         <a href="#tab-11" class="row-action resize firma-${data.id}"><i class="fas fa-times action resize text-red"></i></a>`;
        if (!self.isEditable())
            acciones += '<a href="#rcReport" class="row-action"><i class="fal fa-file-pdf action resize text-red"></i></a>';
        if (self.isIntegrable())
            acciones += '<a href="#rcIntegrar" class="row-action" data-confirm="msgIntegrar"><i class="far fa-save action resize text-blue"></i></a>';
        if (self.isEjecutable())
            acciones += '<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action resize text-green"></i></a>';
        if (self.isAdmin())
            acciones += '<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action resize text-red"></i></a>';

        return `<tr class="tb-data">
            ${info}
            <td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
            <td class="hide-sm">${data.titulo}</td>
            <td class="${self.getStyleByEstado(data)} estado-${data.id}">${self.getDescEstado()}</td>
            <td class="text-center">${self.getFirma().myFlag(data.fmask, data.info)}</td>
            <td class="hide-sm">${data.sig || ""}</td>
            <td title="${data.oIncDesc}">${data.orgInc}${otras}</td>
            <td class="text-center" title="${data.eIncDesc}">${data.ecoInc}</td>
            <td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
            <td class="hide-sm">${data.name}</td>
            <td class="hide-md">${data.memo}</td>
            <td class="text-right">${acciones}</td>
        </tr>`;
    }
	tfoot(resume) { return `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`; }

	validate(data) {
        const self = Presto.self();
        const valid = i18n.getValidators();
        valid.isKey("acOrgDec", data.idOrgDec, "Debe seleccionar la orgánica que disminuye"); // autocomplete required key
        valid.isKey("idEcoDec", data.idEcoDec, "Debe seleccionar la económica que disminuye"); // select required number

        const imp = data.impDec ?? 0; // los importes pueden ser nulos segun el tipo de presto
        const cd = self.isAnt() ? imp : (data.cd ?? 0); // los anticipos no validan el CD
        if (imp > cd)
            valid.addError("impDec", "errExceeded", "El importe de la partida que disminuye supera el crédito disponible");
        if (self.isPartidaDec() && (self.partidas.getImporte() != imp)) // Valido los importes a decrementar e incrementar
            valid.addError("impDec", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
        valid.size("memo", data.memo, "Debe asociar una memoria justificativa a la solicitud."); // Required string
        if (data.urgente == "2") { // Solicitud urgente
            valid.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta solicitud."); // Required string
            valid.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta solicitud."); // Required date
        }
        return valid.isOk() && self.partidas.validate();
    }
}

export default new Presto();
