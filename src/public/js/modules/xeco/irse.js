
import coll from "../../components/Collection.js";
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import sb from "../../components/StringBox.js";
import pf from "../../components/Primefaces.js";

import list from "./irse/list.js";
import uxxiec from "./irse/uxxiec.js";
import perfil from "./irse/perfil.js";
import rutas from "./irse/rutas.js";
import maps from "./irse/maps.js";
import dietas from "./irse/dietas.js";
import organicas from "./irse/organicas.js";
import otri from "./irse/otri.js";

var formIrse;
pf.ready(() => {
	list.init();
	uxxiec.init();
});

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setShowEvent(3, tab3 => {
	if (tab3.dataset.loaded)
		return true; // tab preloaded
	tab3.dataset.loaded = "1";
	if (perfil.isColaboracion())
		return otri.colaboracion(formIrse, tab3);
	return otri.congreso(formIrse, tab3);
});

/*********** Google Maps API ***********/
tabs.setShowEvent(2, maps);

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setShowEvent(5, tab5 => {
	const eTipoGasto = formIrse.getInput("#tipo-gasto"); //select tipo
	if (!eTipoGasto)
		return true; // modo solo consulta

	const grupos = tab5.querySelectorAll(".grupo-gasto");
	const isDoc = () => ["201", "202", "204", "205", "206"].includes(eTipoGasto.value);
	const isExtra = () => ["301", "302", "303", "304"].includes(eTipoGasto.value);
	const isPernocta = () => (eTipoGasto.value == "9");
	const fnChange = () => {
		formIrse.setval("#tipoGasto", eTipoGasto.value)
				.text("[for=txtGasto]", i18n.get("lblDescObserv"));
		if (isPernocta())
			grupos.mask(0b11011);
		else if (isDoc())
			grupos.mask(0b10101);
		else if (isExtra())
			grupos.mask(0b10111);
		else if ("4" == eTipoGasto.value) { //ISU y taxi
			formIrse.text("[for=txtGasto]", i18n.get("lblDescTaxi"));
			grupos.mask(0b10111);
		}
		else if (0 < +eTipoGasto.value)
			grupos.mask(0b10011);
		else
			grupos.mask(0b00001);			
	}

	rutas.update(); // Actualizo los tipos de rutas
	// trayectos de ida y vuelta => al menos 2
	tab5.querySelectorAll(".rutas-gt-1").forEach(el => el.classList.toggle("hide", rutas.size() < 2));
	dom.table("#rutas-read", rutas.getAll(), rutas.getResume(), rutas.getStyles());

	const start = sb.isoDate(rutas.first().dt1);
	const end = sb.isoDate(rutas.last().dt2);

	grupos.mask(0);
	eTipoGasto.value = ""; // clear selection
	eTipoGasto.onchange = fnChange; // Change event
	formIrse.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setval("#fAloMin", start).setAttr("#fAloMin", "min", start).setAttr("#fAloMin", "max", end)
			.setval("#fAloMax", end).setAttr("#fAloMax", "min", start).setAttr("#fAloMax", "max", end);

	tab5.querySelector("[href='#open-file-gasto']").onclick = () => {
		tab5.querySelector(".ui-fileupload-choose").click();
		fnChange();
	}

	document.querySelector("a#gasto-rutas").onclick = () => { // button in tab12
		const etapas = document.querySelectorAll(".link-ruta:checked").map(el => el.value).join(",");
		if (etapas) {
			formIrse.setval("#trayectos", etapas);
			tab5.querySelector("#uploadGasto").click();
		}
		else
			formIrse.showError(i18n.get("errLinkRuta"));
	}

	window.fnPaso5 = function() {
		formIrse.closeAlerts();
		if (isDoc())
			return dom.required("#txtGasto", "errDoc").isOk();
		dom.gt0("#impGasto", "errGt0", "errRequired")
			.required(eTipoGasto, "errTipoGasto", "errRequired")
		if (dom.isError())
			return false;
		if (isExtra())
			return dom.required("#txtExtra", "errJustifiExtra", "errRequired").isOk();
		if ((eTipoGasto.value == "8") && !formIrse.valueOf("#trayectos")) //factura sin trayectos asociados => tab-12
			return !tabs.showTab(12);
		if (isPernocta()) {
			if (!formIrse.valueOf("#fAloMin") || !formIrse.valueOf("#fAloMax"))
				return !dom.addError("fAloMin", "errFechasAloja");
		}
		return true;
	}
	return true;
});

/*********** Tablas de resumen ***********/
tabs.setViewEvent(6, tab6 => {
	dietas.render(); // Init dietas
	tab6.querySelector("#imp-gasolina-km").innerHTML = i18n.isoFloat(IRSE.gasolina);
	tab6.querySelector("#imp-km").innerHTML = i18n.isoFloat(rutas.getImpKm()) + " €";
	tab6.querySelector("#imp-bruto").innerHTML = i18n.isoFloat(organicas.getImpTotal()) + " €";
	tab6.querySelectorAll(".rutas-vp").forEach(el => el.classList.toggle("hide", rutas.getNumRutasVp() < 1));
});

/*********** Fin + IBAN ***********/
tabs.setShowEvent(9, tab9 => {
	if (tab9.dataset.loaded)
		return organicas.build(); // always auto build table organicas/gastos

	function fnPais(pais) {
		let es = (pais == "ES");
		formIrse.setVisible("#entidades", !es).setVisible(".swift-block,#banco", es);
	}

	//dietas.render(); // Force dietas recalc
	organicas.init().build(); // always auto build table organicas/gastos;
	const cuentas = formIrse.getInput("#cuentas");
	formIrse.setVisible("#grupo-iban", cuentas.options.length <= 1) // existen cuentas?
			.onChangeInput("#urgente", ev => formIrse.setVisible(".grp-urgente", ev.target.value == "2"))
			.onChangeInput("#entidades", () => formIrse.setval("#banco", formIrse.getOptionText("#entidades")));
	formIrse.onChange(cuentas, () => {
		formIrse.setval("#iban", cuentas.value).setval("#entidades", sb.substr(cuentas.value, 4, 4))
				.setval("#swift").setVisible("#grupo-iban", !cuentas.value);
	});

	dom.onChangeInput("#paises", el => { fnPais(el.value); formIrse.setval("#banco"); })
		.onChangeInput("#iban", el => { el.value = sb.toWord(el.value); })
		.onChangeInput("#swift", el => { el.value = sb.toWord(el.value); })
		.each(cuentas.options, opt => {
			let entidad = valid.getEntidad(opt.innerText);
			if (entidad)
				opt.innerText += " - " + entidad;
		});

	if (!cuentas.value) {
		fnPais(formIrse.valueOf("#paises"));
		tab9.querySelector("#grupo-iban").show();
	}

	window.fnPaso9 = function() {
		dom.closeAlerts().required("#iban", "errIban", "errRequired");
		if (!cuentas.value) {
			if (formIrse.valueOf("#paises") != "ES")
				dom.required("#swift", "errSwift", "errRequired").required("#banco", null, "errRequired");
			else
				dom.required("#entidades", null, "errRequired");
		}
		if (formIrse.valueOf("#urgente") == "2")
			dom.required("#extra", "errExtra", "errRequired").geToday("#fMax", "errFechaMax", "errRequired");
		return dom.isOk() && organicas.build();
	}
	window.fnSend = () => i18n.confirm("msgFirmarEnviar");
	tab9.dataset.loaded = "1";
	return true;
});

/*********** Expediente UXXI-EC ***********/
tabs.setShowEvent("uxxiec", uxxiec.load);

//PF needs confirmation in onclick attribute
window.fnUnlink = () => i18n.confirm("msgUnlink") && loading();
window.fnClone = () => i18n.confirm("msgReactivar") && loading();
window.saveTab = () => dom.showOk(i18n.get("saveOk")).working();

// Handle errors or parse server messages
window.showAlerts = pf.showAlerts;
window.showNextTab = window.showTab;
window.viewTab = tabs.showTab;
window.viewIrse = (xhr, status, args, tab) => {
	if (!pf.isLoaded(xhr, status, args))
		return; // return server error
	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info

	// Init IRSE form
	formIrse = new Form("#xeco-irse");
	formIrse.disabled(true, ".ui-state-disabled");
	perfil.init(formIrse);
	rutas.init(formIrse);

	dom.tr(".i18n-tr-h1"); //local traductor
	tab = tab ?? IRSE.tab; //Tab ID to show
	if (globalThis.isset(tab))
		tabs.showTab(tab);
	else
		tabs.nextTab(); // Nex tab by default
	pf.showAlerts(xhr, status, args); // always show messages
}

//Global IRSE components
window.ip = perfil;
window.ir = rutas;
window.io = organicas;
