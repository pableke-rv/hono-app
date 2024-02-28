
import i18n from "../i18n/langs.js";

function Uxxiec() {
	const self = this; //self instance

    let data; // Current presto data type
    this.getData = name => (name ? data[name] : data);
    this.setData = documentos => { data = documentos; return self; }

    this.row = data => {
        return `<tr class="tb-data">
            <td>${data.num}</td>
            <td>${data.uxxi}</td>
            <td class="text-right">${i18n.isoFloat(data.imp) || "-"} €</td>
            <td class="text-center">${i18n.isoDate(data.fUxxi)}</td>
            <td>${data.desc}</td>
            <td class="text-center">
                <a href="#remove" class="row-action"><i class="fas fa-times action action-red"></i></a>
            </td>
        </tr>`;
    }
    this.tfoot = resume => `<tr><td colspan="99">Operaciones: ${resume.size}</td></tr>`;
    this.autocomplete = item => (item.num + " - " + item.uxxi + "<br>" + item.desc);
}

export default new Uxxiec();
