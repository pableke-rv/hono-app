
import Table from "../components/Table.js";
import nav from "../components/Navigation.js";
import menus from "../data/menus.js";

function fnTable() {
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

    // Register handler for navigation
    nav.setScript("table-js", fnTable);
}

// Register event on page load and export default handler
document.addEventListener("DOMContentLoaded", fnTable);
export default fnTable;
