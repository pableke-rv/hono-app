
import coll from "../../components/Collection.js";
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";

import list from "./irse/list.js";
import uxxiec from "./irse/uxxiec.js";
import perfil from "./irse/perfil.js";
import rutas from "./irse/rutas.js";
import maps from "./irse/maps.js";
import otri from "./irse/otri.js";
import organicas from "./irse/organicas.js";
import { viewTab5, viewTab6, initTab9 } from "./irse/tabs.js";

const formIrse = new Form("#xeco-irse");
pf.ready(list.init);

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setInitEvent(3, tab3 => perfil.isColaboracion() ? otri.colaboracion() : otri.congreso(formIrse, tab3));

/*********** Google Maps API ***********/
tabs.setShowEvent(2, maps);

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setViewEvent(5, tab5 => viewTab5(tab5, formIrse));

/*********** Tablas de resumen ***********/
tabs.setViewEvent(6, viewTab6);

/*********** Fin + IBAN ***********/
tabs.setInitEvent(9, tab9 => initTab9(tab9, formIrse)); // init. all validations and inputs events only once
tabs.setViewEvent(9, organicas.build); // always auto build table organicas/gastos (transporte, pernoctas, dietas)

/*********** Expediente UXXI-EC ***********/
tabs.setShowEvent("uxxiec", uxxiec.load);

//PF needs confirmation in onclick attribute
window.fnUnlink = () => i18n.confirm("msgUnlink") && loading();
window.fnClone = () => i18n.confirm("msgReactivar") && loading();
window.saveTab = () => dom.showOk(i18n.get("saveOk")).working();

// Handle errors or parse server messages
window.showNextTab = window.showTab;
window.viewTab = tabs.showTab;
window.viewIrse = (xhr, status, args, tab) => {
	if (!pf.isLoaded(xhr, status, args))
		return; // return server error

	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info

	// Init IRSE form
	dom.update().tr(".i18n-tr-h1"); // Update tables, inputs and i18n
	formIrse.update().readonly(true, ".ui-state-disabled");
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
