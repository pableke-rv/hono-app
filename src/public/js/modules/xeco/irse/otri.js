
import Form from "../../../components/Form.js";
import pf from "../../../components/Primefaces.js";
import sb from "../../../components/StringBox.js";
import excel from "../../../components/Excel.js";
import rutas from "./rutas.js";

function Otri() {
	const self = this; //self instance

    this.init = () => {
        const formListIsu = new Form("#xeco-filtro-isu");
        if (formListIsu.isset())
            formListIsu.setAutocomplete("#organica-isu", {
                minLength: 4,
                source: term => pf.sendTerm("rcFindOrg", term),
                render: item => item.o + " - " + item.dOrg,
                select: item => item.id
            });
        return self; // No isu
    }

    this.colaboracion = (form, tab3) => {
        window.fnPaso3 = () => dom.closeAlerts().required("#justifi", "errJustifiSubv", "errRequired").isOk();
        return self;
    }
    this.congreso = (form, tab3) => {
        rutas.update(); // Actualizo los tipos de rutas
        tab3.querySelectorAll(".rutas-vp").forEach(el => el.classList.toggle("hide", rutas.getNumRutasVp() < 1));
    
        const eCong = form.getInput("#congreso"); //congreso si/no
        const eIniCong = form.getInput("#fIniCong"); //fecha inicio del congreso
        const eFinCong = form.getInput("#fFinCong"); //fecha fin del congreso
        const eJustifiCong = form.querySelector(".justifi-congreso"); //justificacion del congreso
    
        function validCong() {
            let fIniCong = dt.toDate(eIniCong.value);
            let fFinCong = dt.toDate(eFinCong.value);
            dt.addDate(fIniCong, -1).trunc(fIniCong).addDate(fFinCong, 2).trunc(fFinCong);
            return ((fIniCong && dt.lt(rutas.start(), fIniCong)) || (fFinCong && dt.lt(fFinCong, rutas.end())));
        }
        function fechasCong() {
            eIniCong.setAttribute("max", eFinCong.value);
            eFinCong.setAttribute("min", eIniCong.value);
            dom.toggleHide(eJustifiCong, !validCong());
        }
        function updateCong() {
            dom.toggleHide(".grp-congreso", eCong.value == "0");
            (+eCong.value > 0) ? fechasCong() : dom.hide(eJustifiCong);
        }
    
        dom.onBlurInput(eIniCong, fechasCong)
            .onBlurInput(eFinCong, fechasCong)
            .onChangeInput(eCong, updateCong);
        updateCong();
    
        window.fnPaso3 = function() {
            dom.closeAlerts()
                .required("#justifi", "errJustifiSubv", "errRequired")
                .required("#entidad-origen", "errEntidadOrigen", "errRequired");
            if (rutas.getNumRutasVp())
                dom.required("#justifiVp", "errJustifiVp", "errRequired");
            if (validCong())
                dom.required("#justifiCong", "errCongreso", "errRequired");
            if (eCong.value == "4")
                dom.required("#impInsc", "errNumber", "errRequired");
            return dom.isOk();
        }
        return self;
    }
}

window.xlsx = (xhr, status, args) => {
    if (!showAlerts(xhr, status, args))
        return false; // Server error
    const data = JSON.parse(args.data);
    excel.json(data, {
        keys: [ // column order
            "ej", "cod", "jg", "fact", "nif", "ter", "impJg", "fJg", "descJg", 
            "nifInt", "int", "vinc", "gasto", "act", "proy",
            "dest", "pais", "itinerario", "start", "end", "loc", "vp", "km", "impKm",
            "fCong1", "fCong2", "impTrans", "noches", "impPern", "dias", "impDietas", "impTotal", "taxis"
        ],
        titles: [ // column names
            "Ej.", "ID", "Nº JG.", "Nº Factura", "NIF Tercero", "Nombre del Tercero", "Imp. Total", "F. Emisión", "Descripción", 
            "NIF Interesado", "Nombre del Interesado", "Vinculación", "Tipo de Gasto", "Actividad", "Relación con el Proyecto",
            "Destino Principal", "Pais", "Itinerario", "F. Inicio", "F. Fin", "Locomoción", "Vehiculo Propio", "Km.", "Imp./Km.",
            "F. Inicio Congreso", "F. Fin Congreso", "Tot. Locomoción", "Nº Noches", "Tot. Alojamiento", "Nº Días", "Tot. Manutención", "Total", "Taxi"
        ],
        columns: {
            km: cell => { cell.z = "#,##0.00"; }, // currency format
            impKm: cell => { cell.z = "#,##0.00"; }, // currency format
            //fCong1: (cell, data) => { cell.v = sb.isoDate(data.fCong1); console.log('Log:', sb.isoDate(data.fCong1), cell.v); }, // iso date format
            impTrans: cell => { cell.z = "#,##0.00"; }, // currency format
            impPern: cell => { cell.z = "#,##0.00"; }, // currency format
            impDietas: cell => { cell.z = "#,##0.00"; }, // currency format
            impTotal: cell => { cell.z = "#,##0.00"; } // currency format
        }
    });
}

export default new Otri();
