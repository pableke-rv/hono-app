
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import modals from "../../components/Modals.js";
import pf from "../../components/Primefaces.js";
import buzon from "../../model/xeco/Buzon.js";

function fnPaginate(recientes, size) {
	recientes.getRows().forEach((row, i) => row.setVisible(i < size));
	recientes.getLastRow().show();
}
function fnLoadTables(form, ancladas, recientes, data) {
	ancladas.render(data.filter(org => (org.mask & 2)));
	form.setVisible("#card-ancladas", ancladas.size() > 0);
	recientes.render(data.filter(org => !(org.mask & 2)));
	fnPaginate(recientes, form.getval("#pagina")); // current page size
}

function fnFacturaOrganica(form, elTipo, data) {
	const isIsu = buzon.setTipoPago(+elTipo.value).isIsu(data);
	buzon.setJustPagoRequired(buzon.isPagoCesionario() && isIsu);
	form.setVisible("#file-jp", buzon.isJustPagoRequired()).text(".filename", "")
		.setVisible("#check-jp", buzon.isPagoCesionario() && !isIsu);
}
function fnFacturaOtros(form, elTipo) {
	buzon.setTipoPago(+elTipo.value);
	buzon.setJustPagoRequired(buzon.isPagoCesionario());
	form.hide("#check-jp").text(".filename", "").setVisible("#file-jp", buzon.isJustPagoRequired());
}

function fnAddActions(form, table) {
	const elTipo = form.getInput("#tipo");
	table.set("#anclar", data => pf.sendId("anclar", data.org));
	table.set("#desanclar", data => pf.sendId("desanclar", data.org));
	table.set("#modal", data => { modals.set("data", data); pf.sendId("utProv", data.org); });
	table.set("#report", data => pf.fetch("report", { id: data.org, ut: data.ut }));

	table.set("#buzon", data => {
		form.setval("#buzon-cod-org", data.oCod).text("#org-desc", data.oCod + " / " + data.oDesc);
		elTipo.onchange = () => fnFacturaOrganica(form, elTipo, data);
		fnFacturaOrganica(form, elTipo, data);
		pf.sendId("utFact", data.org);
	});
	table.set("#buzon-otros", () => {
		form.setval("#buzon-cod-org").text("#org-desc", table.html("#otras"));
		elTipo.onchange = () => fnFacturaOtros(form, elTipo);
		fnFacturaOtros(form, elTipo);
		window.utFact(); // id = null
	});
}

pf.ready(() => { // on load view
	const formFactura = new Form("#xeco-factura");
	const formOrganicas = new Form("#xeco-organicas");
	const tableAncladas = formOrganicas.setTable("#ancladas", {
		onRender: buzon.row,
		onFooter: buzon.tfoot,
		onRemove: data => pf.sendId("remove", data.org)
	});
	const tableRecientes = formOrganicas.setTable("#recientes", {
		rowEmptyTable: buzon.lastRow(),
		onRender: buzon.row,
		onLastRow: buzon.lastRow,
		onFooter: buzon.tfoot,
		onRemove: data => pf.sendId("remove", data.org)
	});

	fnAddActions(formFactura, tableAncladas);
	fnAddActions(formFactura, tableRecientes);
	const organicas = JSON.read(formOrganicas.html("#organcias-json"));
	fnLoadTables(formOrganicas, tableAncladas, tableRecientes, organicas);
	modals.set("#report", () => {
		const data = modals.get("data");
		pf.fetch("report", { id: data.org, ut: formOrganicas.getval("#utProv") });
	});

	const page = formOrganicas.getInput("#pagina");
	page.onchange = () => fnPaginate(tableRecientes, +page.value);

	pf.uploads(formFactura.querySelectorAll(".pf-upload"));
	tabs.setShowEvent(2, tab => {
		const files = formFactura.querySelectorAll(".filename").filter(el => el.innerHTML);
		const fileNames = files.map(el => el.innerHTML).join(", ");
		if (!fileNames)
			return !formFactura.showError("Debe seleccionar una factura.");
		if (buzon.isJustPagoRequired() && (files.length < 2))
			return !formFactura.showError("Debe seleccionar Justificante de pago.");
		return formFactura.text("#ut-desc", formFactura.getOptionText("#utFact")).text("#file-name", fileNames);
	});

	window.loadBuzon = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args)) { // reload all tables
			fnLoadTables(formOrganicas, tableAncladas, tableRecientes, JSON.read(args.data));
			formOrganicas.showOk("saveOk"); // clear inputs, autofocus and message
		}
	}
});
