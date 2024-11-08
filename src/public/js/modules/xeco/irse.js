
import coll from "../../components/Collection.js";
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import list from "./irse/list.js";
import uxxiec from "./irse/uxxiec.js";
import perfil from "./irse/perfil.js";
import rutas from "./irse/rutas.js";
import dietas from "./irse/dietas.js";
import maps from "./irse/maps.js";
import otri from "./irse/otri.js";
import organicas from "./irse/organicas.js";
import { viewTab5, initTab9 } from "./irse/tabs.js";

const formIrse = new Form("#xeco-irse");
pf.ready(list.init);

/*********** Google Maps API ***********/
tabs.setViewEvent(2, maps);

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setInitEvent(3, () => perfil.isColaboracion() ? otri.colaboracion() : otri.congreso(formIrse));

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setViewEvent(5, tab5 => viewTab5(tab5, formIrse));

/*********** Tablas de resumen ***********/
tabs.setViewEvent(6, dietas.render);

/*********** Fin + IBAN ***********/
tabs.setInitEvent(9, tab9 => initTab9(tab9, formIrse)); // init. all validations and inputs events only once
tabs.setViewEvent(9, organicas.build); // always auto build table organicas/gastos (transporte, pernoctas, dietas)

/*********** Expediente UXXI-EC ***********/
tabs.setShowEvent("uxxiec", uxxiec.load);

//PF needs confirmation in onclick attribute
window.fnFirmar = () => i18n.confirm("msgFirmar") && loading();
window.fnRechazar = () => formIrse.closeAlerts().required("#rechazo", "Debe indicar un motivo para el rechazo de la solicitud.").isOk() && i18n.confirm("msgRechazar");
window.fnIntegrar = link => i18n.confirm("msgIntegrar") && loading() && link.hide().closest("tr").querySelectorAll(".estado").text("Procesando...");
window.fnRemove = () => i18n.confirm("removeCom") && loading();
window.fnUnlink = () => i18n.confirm("unlink") && loading();
window.fnClone = () => i18n.confirm("reactivar") && loading();
window.saveTab = () => formIrse.showOk(i18n.get("saveOk")).working();

// Handle errors or parse server messages
window.showNextTab = window.showTab;
window.viewTab = tabs.showTab;
window.viewIrse = (xhr, status, args, tab) => {
	if (!pf.isLoaded(xhr, status, args))
		return; // return server error

	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info

	// Init IRSE form
	dom.setTables(formIrse.getForm()).setInputs(formIrse.getElements()); // Update tables and inputs
	formIrse.update().render(".i18n-tr-h1").readonly(true, ".ui-state-disabled");
	perfil.init(formIrse);
	rutas.init(formIrse);
	organicas.init(formIrse);
	uxxiec.init(formIrse);

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

// Hack old DomBox Module
dom.confirm = i18n.confirm; // for remove action
dom.getData = selector => formIrse.getData(selector); // parse form data
dom.isOk = () => (i18n.getValidation().isOk() || !formIrse.setErrors()); // update fields
dom.isError = () => (i18n.getValidation().isError() && formIrse.setErrors()); // update fields
dom.closeAlerts = () => { i18n.getValidators(); formIrse.closeAlerts(); return dom; } // reset msgs and alerts
dom.showError = msg => { formIrse.showError(msg); return dom; } // show message error
dom.addError = dom.setError = (el, msg, msgtip) => {
	el = formIrse.getInput(el); // check if input exists
	el && i18n.getValidation().addError(el.name, msgtip, msg); // set error message
	return dom;
}
dom.required = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().size250(el.name, el.value, msg);
	return dom;
}
/*dom.login = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().isLogin(el.name, el.value, msg);
	return dom;
}
dom.email = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().isEmail(el.name, el.value, msg);
	return dom;
}*/
dom.intval = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().le10(el.name, +el.value, msg);
	return dom;
}
dom.gt0 = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().gt0(el.name, i18n.toFloat(el.value), msg);
	return dom;
}
dom.fk = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().isKey(el.name, el.value, msg);
	return dom;
}
dom.past = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().past(el.name, el.value, msg);
	return dom;
}
dom.leToday = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().leToday(el.name, el.value, msg);
	return dom;
}
dom.geToday = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().geToday(el.name, el.value, msg);
	return dom;
}
