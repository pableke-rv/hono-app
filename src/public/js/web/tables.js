
import Table from "../components/Table.js";
import nav from "../components/Navigation.js";
import menus from "../data/menus.js";

function fnTables() { // Table-Tab
    const table = new Table(document.querySelector("table"));
    table.set("onRender", (data, status, resume) => {
        return `<tr class="tb-data">
            <td class="text-center">${status.count}</td>
            <td><a href="#">${data.nombre}</a></td>
            <td>${data.titulo}</td>
            <td class="text-center">${data.icono || ""}</td>
            <td class="text-center"><a href="#remove" class="fas fa-times action text-red text-xl resize row-action" title="Desasociar partida"></a></td>
        </tr>`;
    });
    table.set("onFooter", resume => `<tr><td colspan="${resume.columns}">Filas: ${resume.size}</td></tr>`);
    table.render(menus.filter(node => (node.tipo == 1)));
    nav.setLangs("/index");
}

export default () => {
    nav.addListener("/tables.html", fnTables).addListener("/tables", fnTables);
}
