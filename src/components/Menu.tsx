// @ts-nocheck 

import { raw } from "hono/html";
import menu from "app/js/components/Menu.js";
import menus from "app/js/data/menus.js";

const menuHTML = menu.html(menus.filter(node => (node.tipo == 1)).sort((a, b) => (a.orden - b.orden)));

export default (props: any) => {
    return ( <ul class="menu hide">{raw(menuHTML)}</ul> );
}
