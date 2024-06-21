
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

pf.ready(() => { // on load view
	const formOrganicas = new Form("#xeco-organicas");
	const organicas = JSON.read(formOrganicas.html("#organcias-json"));
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

	const page = formOrganicas.getInput("#pagina");
	page.onchange = () => fnPaginate(tableRecientes, +page.value);
	fnLoadTables(formOrganicas, tableAncladas, tableRecientes, organicas);
	modals.set("#report", () => {
		const data = buzon.getData(); // current row
		pf.fetch("report", { id: data.org, ut: formOrganicas.getval("#utProv") });
		modals.close(); // always close modal
	});

	const formFactura = new Form("#xeco-factura");
	const elTipo = formFactura.getInput("#tipo");
	const fileNames = formFactura.querySelectorAll(".filename");

	function fnFacturaOrganica(data) {
		const isIsu = buzon.setData(data).setTipoPago(+elTipo.value).isIsu();
		buzon.setJustPagoRequired(buzon.isPagoCesionario() && isIsu);
		formFactura.setVisible("#msg-isu", isIsu).setVisible("#file-jp", buzon.isJustPagoRequired());
		tabs.exclude();
		buzon.isPagoCesionario() || tabs.exclude(3);
		buzon.isMonogrupo() && tabs.exclude(4)
	}
	function fnFacturaOtros() {
		buzon.setTipoPago(+elTipo.value);
		buzon.setJustPagoRequired(buzon.isPagoCesionario());
		formFactura.hide("#msg-isu").setVisible("#file-jp", buzon.isJustPagoRequired());
		tabs.exclude();
		buzon.isPagoCesionario() || tabs.exclude(3);
	}
	function fnAddActions(table) {
		table.set("#anclar", data => pf.sendId("anclar", data.org));
		table.set("#desanclar", data => pf.sendId("desanclar", data.org));
		table.set("#users", data => { buzon.setData(data); pf.sendTerm("users", data.oCod); });
		table.set("#modal", data => { buzon.setData(data); pf.sendId("utProv", data.org); });
		table.set("#report", data => pf.fetch("report", { id: data.org, ut: data.ut }));

		table.set("#buzon", data => {
			formFactura.setval("#buzon-cod-org", data.oCod).text("#org-desc", data.oCod + " / " + data.oDesc);
			elTipo.onchange = () => fnFacturaOrganica(data); // update event
			fnFacturaOrganica(data);
			pf.sendId("utFact", data.org);
		});
		table.set("#buzon-otros", () => {
			formFactura.setval("#buzon-cod-org").text("#org-desc", table.html("#otras"));
			elTipo.onchange = fnFacturaOtros; // update event
			fnFacturaOtros();
			window.utFact(); // id = null
		});
	}

	fnAddActions(tableAncladas);
	fnAddActions(tableRecientes);

	pf.uploads(formFactura.querySelectorAll(".pf-upload"));
	tabs.setShowEvent(2, tab => {
		const fileName = formFactura.querySelector(".filename").innerHTML;
		return fileName || !formFactura.showError("Debe seleccionar una factura.");
	});
	tabs.setShowEvent(4, tab => {
		const files = fileNames.filter(el => el.innerHTML);
		if (buzon.isJustPagoRequired() && (files.length < 2))
			return !formFactura.showError("Debe seleccionar Justificante de pago.");
		return true;
	});
	tabs.setViewEvent(6, tab => {
		const names = fileNames.filter(el => el.innerHTML).map(el => el.innerHTML);
		formFactura.text("#ut-desc", formFactura.getOptionText("#utFact")).text("#file-name", names.join(","));
	});

	window.loadBuzon = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args)) { // reload all tables
			fnLoadTables(formOrganicas, tableAncladas, tableRecientes, JSON.read(args.data));
			formOrganicas.showOk("saveOk"); // clear inputs, autofocus and message
		}
	}
	window.loadUsuarios = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return; // server error message
		const formUsers = new Form("#xeco-users");
		formUsers.querySelector("#msg-org").render(buzon.getData());
		tabs.showTab(10);
	}
});
