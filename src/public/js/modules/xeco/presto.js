
import alerts from "../../components/Alerts.js";
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import presto from "../../model/xeco/Presto.js";
import solicitudes from "./xeco.js";

pf.ready(() => {
    const partida = presto.getPartida();
    const partidas = presto.getPartidas();

    /*** FORMULARIO PARA EL DC 030 DE LAS GCR ***/
    const form030 = new Form("#xeco-030");
    const acOrg030 = form030.setAcItems("#acOrg030", //selector
                                        term => window.rcFindOrg030(pf.param("term", term)), //source
                                        item => form030.setval("#idEco030", item.imp)); //select
    form030.addClick("#save-030", ev => {
        partida.setData(lineas.getCurrentItem())
        if (!form030.validate(partida.validate030))
            return false; // Errores al validar el 030
        formPresto.saveTable("#partidas-json", lineas); // save data to send to server
        if (presto.isFinalizada())
            formPresto.click("#save030"); // actualizo los datos a integrar
        else
            tabs.backTab().showOk("Datos del documento 030 asociados correctamente."); // Back to presto view
    });
    /*** FORMULARIO PARA EL DC 030 DE LAS GCR ***/

    /*** FORMULARIO PRINCIPAL ***/
    const formPresto = new Form("#xeco-presto");
    solicitudes(presto, formPresto); // init. actions
    tabs.setActive(presto.isUxxiec() ? 0 : 2);

    const emptyOption = "Seleccione una económica";
	const ecoDec = pf.datalist(formPresto, "#idEcoDec", "#idEcoDecPF", {
        emptyOption,
        onChange: item => formPresto.setval("#cd", item.imp),
        onReset: () => formPresto.setval("#impDec").setval("#cd")
    });
	const ecoInc = pf.datalist(formPresto, "#idEcoInc", "#idEcoIncPF", { emptyOption });
    pf.uploads(formPresto.querySelectorAll(".pf-upload"));
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
                        .setVisible(".show-partida-inc", presto.showPartidasInc());
        },
        "#doc030": row => { // load tab view 3
            row.ej030 = row.ej; // Ejercicio de la partida a añadir
            row.imp080 = i18n.isoFloat(row.imp); // formated float
            form030.render(".info-080", row).setData(row).setVisible("#memo-030", presto.getMemo())
                    .setVisible("#save-030", !presto.isReadOnly()).text("#memo-030", presto.getMemo());
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
            const partida = partidas[0]; // unique row
            partida.imp = formPresto.getValue(ev.target); //importe obligatorio
            partida.imp030 = partida.imp; // update imp 030
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
    window.fnAddPartidaInc = () => formPresto.validate(partida.validate);
    window.loadPartidaInc = (xhr, status, args) => {
        const partidaInc = JSON.read(args.data);
        formPresto.closeAlerts().hide(".link-adjunto");
        if (!partidas.setData(lineas).validatePartida(partidaInc))
            return formPresto.setErrors(); // error en la partida a incrementar
        partidaInc.imp030 = partidaInc.imp = formPresto.valueOf("#impInc"); // Importe de la partida a añadir
        lineas.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
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
                    .setVisible(".show-partida-dec", presto.isPartidaDec()).setVisible(".show-partida-inc", presto.showPartidasInc())
                    .setVisible(".show-imp-cd", presto.isImpCd()).setVisible(".show-memoria", !presto.isL83()).setVisible(".grp-urgente", presto.isUrgente())
                    .setVisible(".show-subtipo", presto.isUae() && presto.isGcr()).setVisible(".is-fce", presto.isFce()).setVisible(".link-adjunto", presto.getAdjunto())
                    .text(".filename", "");
        fnLoadEcoDec(args); // cargo las econonomicas a decrementar
        lineas.render(JSON.read(args.data)); // Load table partidas
        acOrgDec.setValue(data.idOrgDec, data.orgDec + " - " + data.dOrgDec);
        tabs.render(".load-data", data).showTab(1);
    }
    window.fnSend = () => {
        partidas.setData(lineas); // Cargo las partidas para su validación
        if (!formPresto.validate(presto.validate))
            return false; //error en las validaciones
        partidas.setPrincipal(); //marco la primera como principal
        formPresto.saveTable("#partidas-json", lineas); // save data to send to server
        return i18n.confirm("msgSend") && formPresto.loading();
    }
    /*** FORMULARIO PRINCIPAL ***/
});
