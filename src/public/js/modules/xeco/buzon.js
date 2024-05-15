
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import buzon from "../../model/xeco/Buzon.js";

document.addEventListener("DOMContentLoaded", () => { // on load view
	const formBuzon = new Form("#xeco-buzon");
	const elTipo = formBuzon.getInput("#tipo");

	function updateBuzonOrganica() {
		const isIsu = buzon.setTipoPago(+elTipo.value).isIsu(table.getCurrentItem());
		buzon.setJustPagoRequired(buzon.isPagoCesionario() && isIsu);
		formBuzon.setVisible("#file-jp", buzon.isJustPagoRequired()).setVisible("#check-jp", buzon.isPagoCesionario() && !isIsu);
	}
	function updateBuzonOtros() {
		buzon.setTipoPago(+elTipo.value);
		buzon.setJustPagoRequired(buzon.isPagoCesionario());
		formBuzon.setVisible("#file-jp", buzon.isJustPagoRequired()).hide("#check-jp");
	}
	function fnSend(action, data) {
		pf.fetch(action, { org: data.org, cod: data.oCod, ut: data.grp, m: data.mask });
		return formOrganicas.reset(); // autofocus
	}

	const formOrganicas = new Form("#xeco-organicas");
	const table = formOrganicas.setTable("#organcias", {
		rowEmptyTable: buzon.lastRow(1),
		onRender: buzon.row,
		onFooter: buzon.tfoot,
		onRemove: data => fnSend("remove", data)
	});

	table.set("#anclar", data => fnSend("anclar", data));
	table.set("#desanclar", data => fnSend("desanclar", data));
	table.set("#report", data => fnSend("report", data));
	table.set("#buzon", data => {
		formBuzon.setval("#buzon-id-org", data.org).setval("#buzon-cod-org", data.oCod)
				.setval("#tramit-all", data.grp).readonly(true, "#tramit-all")
				.text("#org-desc", data.oCod + " / " + data.oDesc);
		elTipo.onchange = updateBuzonOrganica;
		updateBuzonOrganica();
		tabs.showTab(1);
	});
	table.set("#buzon-otros", () => {
		formBuzon.setval("#buzon-id-org").setval("#buzon-cod-org").readonly(false, "#tramit-all")
				.text("#org-desc", table.html("#otras"));
		elTipo.onchange = updateBuzonOtros;
		updateBuzonOtros();
		tabs.showTab(1);
	});
	table.render(JSON.read(formOrganicas.html("#organcias-json")));

	formOrganicas.setAcItems("#organica", 
						term => window.findOrganica(pf.param("cod", term)),
						item => window.setUnidadesTramit(pf.param("org", item.value)));
	window.isOrganica = () => formOrganicas.isValid(buzon.isValidOrganica);

	tabs.setShowEvent(2, tab => {
		const factura = formBuzon.getInput("#factura_input").files[0];
		const justPago = formBuzon.getInput("#justPago_input").files[0];
		if (!factura)
			return !formBuzon.showError("Debe seleccionar una factura.");
		if (buzon.isJustPagoRequired() && !justPago)
			return !formBuzon.showError("Debe seleccionar Justificante de pago.");
		const fileNames = factura.name + (buzon.isJustPagoRequired() ? (", " + justPago.name) : "");
		return formBuzon.text("#ut-desc", formBuzon.getOptionText("#tramit-all")).text("#file-name", fileNames);
	});

	window.loadUnidadesTramit = (xhr, status, args) => {
		const utSelect = formOrganicas.getInput("#tramit");
		formOrganicas.setVisible("#unidades-tramit", JSON.size(utSelect.children) > 1);
	}
	window.loadBuzon = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args)) {
			const data = JSON.read(args.data); // read data
			data && table.render(data); // reload table if has rows
			formOrganicas.reset().showOk("saveOk"); // clear inputs, autofocus and message
		}
	}
});
