import Table from"../components/Table.js";import nav from"../components/Navigation.js";import menus from"../data/menus.js";function fnTable(){var t=new Table(document.querySelector("table"));t.set("onRender",(t,e,a)=>`<tr class="tb-data">
            <td class="text-center">${e.count}</td>
            <td><a href="#">${t.nombre}</a></td>
            <td>${t.titulo}</td>
            <td class="text-center">${t.icono||""}</td>
            <td class="text-center"><a href="#remove" class="fas fa-times action text-red text-xl resize row-action" title="Desasociar partida"></a></td>
        </tr>`),t.set("onFooter",t=>`<tr><td colspan="${t.columns}">Filas: ${t.size}</td></tr>`),t.render(menus.filter(t=>1==t.tipo)),nav.setScript("table-js",fnTable)}nav.ready(fnTable);export default fnTable;