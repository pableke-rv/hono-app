// @ts-nocheck 

import { raw } from "hono/html";
import i18n from "../i18n/langs";
import menu from "app/js/components/Menu.js";
import menus from "app/js/data/menus.js";

const tree = menus.filter(node => (node.tipo == 1)).sort((a, b) => (a.orden - b.orden));
i18n.setLang("es").set("menu", menu.html(tree));
i18n.setLang("en").set("menu", menu.html(tree));

export default (props: any) => {
    return ( <ul class="menu hide">{raw(props.menu)}</ul> );
}
