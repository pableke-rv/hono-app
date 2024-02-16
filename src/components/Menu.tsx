// @ts-nocheck 

import { raw } from "hono/html";
import menus from "app/js/data/menus.js";

// Build tree menu as UL > Li > *
function preorden(data, node, level) {
    const children = data.filter(child => (child.padre == node.id)); // sub-menu items (children from node)
    const label = `<span class="label-menu level-${level}">` + ((node.icono || "") + node.nombre) + "</span>"; // item menu label
    if (children.length) {
        var output = `<li class="item-menu level-${level} item-parent">`; // parent item menu (with children)
        output += `<a href="${node.enlace}" class="link-menu level-${level}" title="${node.titulo}">${label}<i class="fas fa-caret-right icon-right"></i></a>`;
        output += `<ul class="sub-menu level-${level + 1}">` + children.map(child => preorden(data, child, level + 1)).join("") + "</ul>";
        return output + "</li>";
    }
    var output = `<li class="item-menu level-${level} item-leaf">`; // leaf item menu (item hoja)
    output += `<a href="${node.enlace}" class="link-menu level-${level}" title="${node.titulo}">${label}</a>`;
    output += children.map(child => preorden(data, child, level + 1)).join("");
    return output + "</li>";
}
const menuHTML = menus.sort((a, b) => (a.orden - b.orden))
                        .filter(node => (!node.padre && (node.tipo == 1)))
                        .map(node => preorden(menus, node, 1)).join("");

export default (props: any) => {
    return ( <ul class="menu hide">{raw(menuHTML)}</ul> );
}
