
import Form from "../../components/Form.js";
import Table from "../../components/Table.js";
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
		onFooter: buzon.tfoot
	});
	const tableRecientes = formOrganicas.setTable("#recientes", {
		rowEmptyTable: buzon.lastRow(),
		onRender: buzon.row,
		onLastRow: buzon.lastRow,
		onFooter: buzon.tfoot
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
		const isIsu = buzon.setData(data).setFacturaOtros().setTipoPago(+elTipo.value).isIsu();
		buzon.setJustPagoRequired(buzon.isPagoCesionario() && isIsu);
		formFactura.setVisible(".show-isu", isIsu).setVisible(".show-no-isu", !isIsu)
					.setVisible("#file-jp", buzon.isJustPagoRequired())
					.text("#type-name", formFactura.getOptionText("#tipo")).setval("#desc");
		tabs.exclude();
		buzon.isPagoCesionario() || tabs.exclude(3);
		buzon.isMonogrupo() && tabs.exclude(4);
		tabs.exclude(5); // always hide otros
	}
	function fnFacturaOtros() {
		buzon.setFacturaOtros(true).setTipoPago(+elTipo.value);
		buzon.setJustPagoRequired(buzon.isPagoCesionario());
		formFactura.show(".show-isu").hide(".show-no-isu")
					.setVisible("#file-jp", buzon.isJustPagoRequired())
					.text("#type-name", formFactura.getOptionText("#tipo"));
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
			pf.sendId("utFact", data.org);
			fnFacturaOrganica(data);
		});
		table.set("#buzon-otros", () => {
			formFactura.setval("#buzon-cod-org").text("#org-desc", table.html("#otras"));
			elTipo.onchange = fnFacturaOtros; // update event
			window.utFact(); // id = null
			fnFacturaOtros();
		});
	}

	fnAddActions(tableAncladas);
	fnAddActions(tableRecientes);

	pf.uploads(formFactura.querySelectorAll(".pf-upload"));
	formFactura.getInput("#fileFactura_input").setAttribute("accept", "application/pdf"); // PDF only
	function fnValidateJustPago() {
		const files = fileNames.filter(el => el.innerHTML);
		if (buzon.isJustPagoRequired() && (files.length < 2))
			return !formFactura.showError("Debe seleccionar Justificante de pago.");
		if (buzon.isFacturaOtros()) {
			const first = tableAncladas.getItem(0) || tableRecientes.getItem(0);
			return formFactura.setval("#utFact", first.ut) // default ut
		}
		return true;
	}

	tabs.setShowEvent(2, tab => {
		const fileName = formFactura.querySelector(".filename").innerHTML;
		return fileName || !formFactura.showError("Debe seleccionar una factura.");
	});
	tabs.setShowEvent(4, fnValidateJustPago).setShowEvent(5, fnValidateJustPago).setShowEvent(6, fnValidateJustPago);
	tabs.setViewEvent(6, tab => {
		const desc = formFactura.getval("#desc");
		const names = fileNames.filter(el => el.innerHTML).map(el => el.innerHTML);
		formFactura.text("#ut-desc", formFactura.getOptionText("#utFact")).text("#file-name", names.join(","))
					.text("#desc-gestor", desc).setVisible("#msg-gestor", desc);
	});
	window.factUpload = (xhr, status, args) => {
		if (window.showTab(xhr, status, args, 0)) { // reload all tables
			formOrganicas.fireReset().showOk("saveOk"); // clear inputs, autofocus and message
			fileNames.forEach(el => { el.innerHTML = ""; }); // clear file names
		}
	}

	window.loadBuzon = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args)) { // reload all tables
			fnLoadTables(formOrganicas, tableAncladas, tableRecientes, JSON.read(args.data));
			formOrganicas.showOk("saveOk"); // datos actualizados correctamente
		}
	}

	const tUsuarios = new Table("#usuarios", {
		onRender: buzon.rowUsuarios,
		onFooter: buzon.tfootUsuarios,
		onRemove: data => !pf.fetch("rcRemoveUser", { org: data.oCod, nif: data.nif })
	});
	const fnToggle = data => pf.fetch("rcToggle", { id: data.org, nif: data.nif, acc: data.acc });
	tUsuarios.set("#toggleUsers", data => { buzon.setData(data).togglePermisoUser(); fnToggle(data); });
	tUsuarios.set("#toggleGastos", data => { buzon.setData(data).toggleGastos(); fnToggle(data); });
	tUsuarios.set("#toggleIngresos", data => { buzon.setData(data).toggleIngresos(); fnToggle(data); });
	tUsuarios.set("#toggleReportProv", data => { buzon.setData(data).toggleReportProv(); fnToggle(data); });
	tUsuarios.set("#toggleFactura", data => { buzon.setData(data).toggleFactura(); fnToggle(data); });
	document.querySelector("[href='#save-users']").addClick(ev => tabs.showTab(0).showOk("saveOk"));

	window.loadUsuarios = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return; // server error message
		const data = buzon.getData();
		const formUsers = new Form("#xeco-users");
		formUsers.querySelector("#msg-org").render(data);
		const acUser = formUsers.setAcItems("#ac-usuarios", term => pf.sendTerm("rcFindUsers", term)); //selector, source
		formUsers.addClick("#add-user", ev => {
			if (acUser.isLoaded())
				pf.fetch("rcAddUser", { org: data.oCod, ut: data.ut, nif: acUser.getValue() });
			acUser.reload(); // clear data and autofocus
			ev.preventDefault();
		});
		tUsuarios.render(JSON.read(args.data));
		tabs.showTab(10);
	}
	window.updateUsuarios = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return; // server error message
		if (args.data)
			tUsuarios.render(JSON.read(args.data));
		else
			tUsuarios.reload();
		tabs.showOk("saveOk");
	}
	window.reloadAll = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return; // server error message
		tUsuarios.reload(); // tabla de usuarios
		args.data && fnLoadTables(formOrganicas, tableAncladas, tableRecientes, JSON.read(args.data));
		tabs.showOk("saveOk");
	}
});
