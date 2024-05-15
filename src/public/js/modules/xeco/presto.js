
import alerts from "../../components/Alerts.js";
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import presto from "../../model/xeco/Presto.js";
import uxxiec from "../../model/xeco/Solicitud.js";
import solicitudes from "./xeco.js";

document.addEventListener("DOMContentLoaded", () => {
    const partida = presto.getPartida();
    const partidas = presto.getPartidas();

    /*** FORMULARIO PARA EL DC 030 DE LAS GCR ***/
    const form030 = new Form("#xeco-030");
    const acOrg030 = form030.setAcItems("#acOrg030", //selector
                                        term => window.rcFindOrg030(pf.param("term", term)), //source
                                        item => form030.setval("#idEco030", item.imp)); //select
    form030.setClick("#save-030", ev => {
        partida.setData(lineas.getCurrentItem());
        if (form030.isValid(partida.validate030)) {
            formPresto.saveTable("#partidas-json", lineas); // save data to send to server
            tabs.backTab().showOk("Datos del documento 030 asociados correctamente."); // Back to presto view
        }
    });
    /*** FORMULARIO PARA EL DC 030 DE LAS GCR ***/

    /*** FORMULARIO PRINCIPAL ***/
    const formPresto = new Form("#xeco-presto");
    solicitudes(presto, formPresto); // init. actions
    tabs.setActive(uxxiec.isUxxiec() ? 0 : 2);

    const emptyOption = "Seleccione una económica";
	const ecoDec = pf.datalist(formPresto, "#idEcoDec", "#idEcoDecPF", {
        emptyOption,
        onChange: item => formPresto.setval("#cd", item.imp),
        onReset: () => formPresto.setval("#impDec").setval("#cd")
    });
	const ecoInc = pf.datalist(formPresto, "#idEcoInc", "#idEcoIncPF", { emptyOption });
    const lineas = formPresto.setTable("#partidas-inc", {
        msgEmptyTable: "No existen partidas asociadas a la solicitud",
        beforeRender: resume => { resume.imp = 0; },
        onHeader: partida.thead,
        onRender: partida.row,
        onFooter: partida.tfoot,
        afterRender: resume => {
            partidas.setData(lineas);
            const readonly = resume.size > 0;
            formPresto.readonly(readonly, "#ejDec").readonly(readonly || presto.isDisableEjInc(), "#ejInc")
                        .setVisible(".show-partida-inc", !formPresto.getId() && (lineas.size() < 20));
        },
        "#doc030": row => { // load tab view 3
            row.ej030 = row.ej; // Ejercicio de la partida a añadir
            row.imp080 = i18n.isoFloat(row.imp); // formated float
            const readonly = presto.isDisabled() && !presto.isFirmable();
            form030.render(".info-080", row).setData(row)
                    .readonly(readonly).setVisible("#save-030", !readonly).text("#memo-030", presto.getMemo());
            acOrg030.setValue(row.idOrg030, row.o030 + " - " + row.dOrg030);
            tabs.showTab(3);
        }
    });

    //****** partida a decrementar ******//
    const fnSelectOrgDec = item => {
        presto.isAutoLoadInc() && lineas.render(); //autoload => clear table
        formPresto.setval("#faDec", item.int & 1);
        pf.sendId("rcEcoDec", item.value);
    }
    const fnResetOrgDec = () => {
        presto.isAutoLoadInc() && lineas.render(); //autoload => clear table
        formPresto.setval("#faDec");
        pf.sendId("rcEcoDec");
    }
    const acOrgDec = formPresto.setAcItems("#acOrgDec", //selector
                                        term => window.rcFindOrgDec(pf.param("term", term)), //source
                                        fnSelectOrgDec, //select
                                        fnResetOrgDec); //reset
    const acOrgInc = formPresto.setAcItems("#acOrgInc", //selector
                                        term => window.rcFindOrgInc(pf.param("term", term)), //source
                                        item => { formPresto.setval("#faInc", item.int & 1); pf.sendId("rcEcoInc", item.value); }, //select
                                        () => { formPresto.setval("#faInc").setval("#impInc"); pf.sendId("rcEcoInc"); }); //reset

    formPresto.onChangeInput("#idEcoDec", ev => {
        if (presto.isL83()) //L83 => busco su AIP
            formPresto.click("#autoload-l83");
        else if (presto.isAnt()) //ANT => cargo misma organica
            formPresto.click("#autoload-ant");
    });
    formPresto.onChangeInput("#impDec", ev => {
        const partidas = lineas.getData();
        if (presto.isAutoLoadImp() && partidas.length) {
            partidas[0].imp = formPresto.getValue(ev.target); //importe obligatorio
            lineas.render(partidas);
        }
    });
    formPresto.onChangeInput("#urgente", ev => formPresto.setVisible(".grp-urgente", ev.target.value == "2"))
            .onChangeInput("#ejDec", ev => { formPresto.setval("#ejInc", ev.target.value); acOrgDec.reset(); })
            .onChangeInput("#ejInc", acOrgInc.reset);

    const fnAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
        const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
        partida.isAfectada(item?.int) && (presto.isTcr() || presto.isFce()) && formPresto.showInfo(info);
        alerts.working(); // Hide loading indicator
    }
    const fnAutoloadInc = (partida, imp) => {
        partida.imp = imp || 0; //propone un importe
        lineas.render([ partida ]); //render partida unica
        formPresto.setval("#impDec", partida.imp);
    }

    window.autoloadL83 = (xhr, status, args) => {
        const partida = JSON.read(args?.data);
        if (partida)
            fnAutoloadInc(partida, ecoDec.getItem(0).imp);
        else if (acOrgDec.isItem())
            formPresto.showError("Aplicación AIP no encontrada en el sistema.");
    }
    window.autoloadAnt = (xhr, status, args) => {
        const partida = JSON.read(args?.data);
        if (partida) //hay partida?
            fnAutoloadInc(partida, Math.max(0, partida.ih));
        else if (acOrgDec.isItem())
            formPresto.showError("No se ha encontrado el anticipo en el sistema.");
    }

    const fnLoadEcoDec = args => {
        ecoDec.setItems(JSON.read(args?.economicas));
    }
    window.loadEconomicasDec = (xhr, status, args) => {
        fnLoadEcoDec(args); // carga las econonomicas a decrementar
        if (presto.isL83()) //L83 => busco su AIP
            window.autoloadL83(xhr, status, args);
        else if (presto.isAnt()) //ANT => cargo misma organica
            window.autoloadAnt(xhr, status, args);
        fnAvisoFa(acOrgDec.getCurrentItem()); //aviso para organicas afectadas en TCR o FCE
    }
    //****** partida a decrementar ******//

    /****** partida a incrementar ******/
    window.loadEconomicasInc = (xhr, status, args) => {
        ecoInc.setItems(JSON.read(args?.data)); // get items
        fnAvisoFa(acOrgInc.getCurrentItem()); //aviso para organicas afectadas en TCR o FCE
    }
    /****** partida a incrementar ******/

    //****** tabla de partidas a incrementar ******//
    window.fnAddPartidaInc = () => formPresto.isValid(partida.validate);
    window.loadPartidaInc = (xhr, status, args) => {
        const partida = JSON.read(args.data);
        if (!partidas.setData(lineas).validatePartida(partida)) // compruebo si la partida existía previamente
            return formPresto.setError("#acOrgInc", "¡Partida ya asociada a la solicitud!", "notAllowed");
        partida.imp030 = partida.imp = formPresto.valueOf("#impInc"); // Importe de la partida a añadir
        lineas.add(partida); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
        formPresto.setVisible(".link-adjunto", presto.getAdjunto());
        acOrgInc.reload();
    }
    //****** tabla de partidas a incrementar ******//

    window.viewPresto = (xhr, status, args) => {
        if (!pf.showAlerts(xhr, status, args))
            return false; // Server error
        const data = JSON.read(args.presto);
        presto.setData(data); // Load data-model before view
        ecoInc.reset(); // cargo las econonomicas a incrementar
        formPresto.setData(data).readonly(presto.isDisabled()).readonly(!presto.isEditableUae(), ".editable-uae")
                    .setVisible(".insert-only", presto.isEditable()).setVisible(".update-only", presto.isDisabled())
                    .setVisible(".firmable-only", presto.isFirmable()).setVisible(".rechazable-only", presto.isRechazable())
                    .setVisible(".show-partida-dec", presto.isPartidaDec()).setVisible(".show-partida-inc", presto.isMultipartida() && presto.isEditable())
                    .setVisible(".show-imp-cd", presto.isImpCd()).setVisible(".show-memoria", !presto.isL83()).setVisible(".grp-urgente", presto.isUrgente())
                    .setVisible(".show-subtipo", uxxiec.isUae() && presto.isGcr()).setVisible(".is-fce", presto.isFce()).setVisible(".link-adjunto", presto.getAdjunto());
        fnLoadEcoDec(args); // cargo las econonomicas a decrementar
        lineas.render(JSON.read(args.data)); // Load table partidas
        acOrgDec.setValue(data.idOrgDec, data.orgDec + " - " + data.dOrgDec);
        tabs.render(".load-data", data).showTab(1);
    }
    window.fnSend = () => {
        partidas.setData(lineas); // Cargo las partidas para su validación
        if (formPresto.isValid(presto.validate)) { //todas las validaciones estan ok?
            partidas.setPrincipal(); //marco la primera como principal
            formPresto.saveTable("#partidas-json", lineas); // save data to send to server
			return i18n.confirm("msgSend");
        }
        return false;
    }
    /*** FORMULARIO PRINCIPAL ***/
});
