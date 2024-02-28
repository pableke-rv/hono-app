
import Form from "../components/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";
import solicitud from "../model/Solicitud.js";
import uxxiec from "../model/Uxxiec.js";
import i18n from "../i18n/presto/langs.js";

export default model => {
    /*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/
    const tabUxxi = tabs.getTab(15);
    solicitud.setUser(tabUxxi.dataset);
    const formUxxi = new Form("#xeco-uxxi");
	const tableUxxi = formUxxi.setTable("#docs-uxxi", {
        msgEmptyTable: "No se han encontrado documentos de UXXI-EC asociadas a la solicitud",
        onRender: uxxiec.row,
        onFooter: uxxiec.tfoot
    });

    const acUxxi = formUxxi.setAutocomplete("#uxxi", {
		minLength: 4,
		source: term => window.rcFindUxxi(pf.param("term", term)),
		render: uxxiec.autocomplete,
		select: item => item.id
	});
	formUxxi.setClick("a#add-uxxi", () => {
        const doc = acUxxi.getCurrentItem();
		doc && tableUxxi.add(doc); // Add and remove PK autocalculated in v_*_uxxiec
        acUxxi.reload(); // Reload autocomplete
	});
    window.loadUxxiec = (xhr, status, args) => {
        if (window.showTab(xhr, status, args, 15))
            tableUxxi.render(JSON.read(args.operaciones)); // Load uxxi-docs
    }
    window.saveUxxiec = (xhr, status, args) => {
        formUxxi.saveTable("#docs-json", tableUxxi).loading();
    }
    /*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/

    /*** FORMULARIO DE RECHAZO Y FILTRO ***/
    const formReject = new Form("#xeco-reject");
    const formFilter = new Form("#xeco-filter");
    const solicitudes = formFilter.setTable("#solicitudes", {
        msgEmptyTable: "No se han encontrado solicitudes para a la búsqueda seleccionada",
        onRender: model.row,
        onFooter: model.tfoot
    });

    solicitudes.setActions(document); // table-action
    const fnSend = (action, data) => pf.sendId(action, data.id);
    solicitudes.set("#rcView", data => fnSend("rcView", data));
    solicitudes.set("#rcViewCached", () => tabs.showTab(1));
    solicitudes.set("#rcFirmar", data => fnSend("rcFirmar", data));
    solicitudes.set("#tab-11", data => {
        fnSend("rcFirmas", data);
        formReject.restart("#rechazo");
        tabs.render(".load-data", data);
    });
    solicitudes.set("#tab-11Cached", () => tabs.showTab(11));
    solicitudes.set("#rcReport", data => fnSend("rcReport", data));
    solicitudes.set("#rcUxxiec", data => {
        formUxxi.restart("#uxxi").toggle(".show-ejecutable", solicitud.isEjecutable(data)); // Update view
        tabs.render(".load-data", data);
        fnSend("rcUxxiec", data);
    });
    solicitudes.set("#rcUxxiecCached", () => tabs.showTab(15));
    solicitudes.set("#rcEmails", data => fnSend("rcEmails", data));
    solicitudes.set("#rcRemove", data => fnSend("rcRemove", data));
    solicitudes.set("#rcIntegrar", (data, link) => {
        fnSend("rcIntegrar", data); // llamada al servidor
        link.hide().closest("tr").querySelectorAll(".estado").text("Procesando...");
    });
    const divSolicitudes = formFilter.querySelector("#solicitudes-json");
    solicitudes.render(JSON.read(divSolicitudes?.innerHTML)); // preload data

    window.onList = () => formFilter.setData({ fMiFirma: "5" }).loading();
    window.fnFirmar = () => i18n.confirm("msgFirmar") && window.loading();
    window.fnRechazar = () => formReject.isValid(solicitud.validateReject) && i18n.confirm("msgRechazar") && window.loading();
    window.handleReport = (xhr, status, args) => window.showAlerts(xhr, status, args).redir(args?.url);

    window.loadFiltro = (xhr, status, args) => {
        window.showTab(xhr, status, args, 2) && solicitudes.render(JSON.read(args.data));
    }
    window.updateList = (xhr, status, args) => {
        if (window.showTab(xhr, status, args, 2)) {
            solicitudes.querySelectorAll(".firma-" + args.id).hide();
            solicitudes.querySelectorAll(".estado-" + args.id).text("Procesando...");
        }
    }
    /*** FORMULARIO DE RECHAZO Y FILTRO ***/
}
