
import sb from "../../../components/StringBox.js";
import pf from "../../../components/Primefaces.js";

import rutas from "./rutas.js";
import dietas from "./dietas.js";
import organicas from "./organicas.js";

export const viewTab5 = (tab, form) => {
	const eTipoGasto = form.getInput("#tipo-gasto"); //select tipo
	if (!eTipoGasto)
		return; // modo solo consulta

	const isTaxi = () => (eTipoGasto.value == "4"); //ISU y taxi
	const isPernocta = () => (eTipoGasto.value == "9"); //Tipo pernocta
	const isDoc = () => ["201", "202", "204", "205", "206"].includes(eTipoGasto.value);
	const isExtra = () => ["301", "302", "303", "304"].includes(eTipoGasto.value);
	const grupos = tab.querySelectorAll(".grupo-gasto");
	const fnChange = () => {
		form.setval("#tipoGasto", eTipoGasto.value)
				.text(".label-text-gasto", i18n.get("lblDescObserv"));
		if (isPernocta())
			grupos.mask(0b11011);
		else if (isDoc())
			grupos.mask(0b10101);
		else if (isExtra())
			grupos.mask(0b10111);
		else if (isTaxi()) { //ISU y taxi
			form.text(".label-text-gasto", i18n.get("lblDescTaxi"));
			grupos.mask(0b10111);
		}
		else if (0 < +eTipoGasto.value)
			grupos.mask(0b10011);
		else
			grupos.mask(0b00001);			
	}

	// trayectos de ida y vuelta => al menos 2
	tab.querySelectorAll(".rutas-gt-1").forEach(el => el.classList.toggle("hide", rutas.size() < 2));
	dom.table("#rutas-read", rutas.getAll(), rutas.getResume(), rutas.getStyles());

	const start = sb.isoDate(rutas.first().dt1);
	const end = sb.isoDate(rutas.last().dt2);

	grupos.mask(0);
	eTipoGasto.value = ""; // clear selection
	eTipoGasto.onchange = fnChange; // Change event
	form.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setval("#fAloMin", start).setAttr("#fAloMin", "min", start).setAttr("#fAloMin", "max", end)
			.setval("#fAloMax", end).setAttr("#fAloMax", "min", start).setAttr("#fAloMax", "max", end).text(".filename", "");
	pf.uploads(tab.querySelectorAll(".pf-upload"), fnChange);

	document.querySelector("a#gasto-rutas").onclick = () => { // button in tab12
		const etapas = document.querySelectorAll(".link-ruta:checked").map(el => el.value).join(",");
		if (etapas) {
			form.setval("#trayectos", etapas);
			tab.querySelector("#uploadGasto").click();
		}
		else
			form.showError(i18n.get("errLinkRuta"));
	}

	window.fnPaso5 = function() {
		dom.closeAlerts();
		if (isDoc())
			return dom.required("#txtGasto", "errDoc").isOk();
		dom.gt0("#impGasto", "errGt0", "errRequired")
			.required(eTipoGasto, "errTipoGasto", "errRequired")
		if (dom.isError())
			return false;
		if (isTaxi()) //ISU y taxi
			return dom.required("#txtGasto", "errRequired").isOk();
		if (isExtra())
			return dom.required("#txtExtra", "errJustifiExtra", "errRequired").isOk();
		if ((eTipoGasto.value == "8") && !form.valueOf("#trayectos")) //factura sin trayectos asociados => tab-12
			return !tabs.showTab(12);
		if (isPernocta()) {
			if (!form.valueOf("#fAloMin") || !form.valueOf("#fAloMax"))
				return !dom.addError("fAloMin", "errFechasAloja");
		}
		return dom.loading();
	}
}

export const viewTab6 = tab => {
	dietas.render(tab); // Init. table dietas
	tab.querySelectorAll(".rutas-vp")
        .forEach(el => el.classList.toggle("hide", rutas.getNumRutasVp() < 1));
}

export const initTab9 = (tab, form) => {
	function fnPais(pais) {
		const es = (pais == "ES");
		form.setVisible("#entidades", es).setVisible(".swift-block,#banco", !es);
	}

	const cuentas = form.getInput("#cuentas");
	form.setVisible("#grupo-iban", cuentas.options.length <= 1) // existen cuentas?
		.onChangeInput("#urgente", ev => form.setVisible(".grp-urgente", ev.target.value == "2"))
		.onChangeInput("#entidades", () => form.setval("#banco", form.getOptionText("#entidades")));
	form.onChange(cuentas, () => {
		form.setval("#iban", cuentas.value).setval("#entidades", sb.substr(cuentas.value, 4, 4))
				.setval("#swift").setVisible("#grupo-iban", !cuentas.value);
	});

	dom.onChangeInput("#paises", el => { fnPais(el.value); form.setval("#banco"); })
		.onChangeInput("#iban", el => { el.value = sb.toWord(el.value); })
		.onChangeInput("#swift", el => { el.value = sb.toWord(el.value); });
	cuentas.options.forEach(opt => {
		let entidad = valid.getEntidad(opt.innerText);
		if (entidad)
			opt.innerText += " - " + entidad;
	});

	if (!cuentas.value) {
		fnPais(form.valueOf("#paises"));
		tab.querySelector("#grupo-iban").show();
	}

	window.fnPaso9 = function() {
		dom.closeAlerts().required("#iban", "errIban", "errRequired");
		if (!cuentas.value) {
			if (form.valueOf("#paises") != "ES")
				dom.required("#swift", "errSwift", "errRequired").required("#banco", null, "errRequired");
			else
				dom.required("#entidades", null, "errRequired");
		}
		if (form.valueOf("#urgente") == "2")
			dom.required("#extra", "errExtra", "errRequired").geToday("#fMax", "errFechaMax", "errRequired");
		return dom.isOk() && organicas.build() && loading();
	}
	window.fnSend = () => i18n.confirm("msgFirmarEnviar");
}
