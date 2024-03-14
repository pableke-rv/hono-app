// @ts-nocheck 

import i18n from "../i18n/langs";
import menu from "app/js/components/Menu.js";
import sqlite from "app/dao/sqlite/factory.js";

// Top level async
i18n.setLang("es").set("menu", menu.html(await sqlite.menus.getPublic("es")));
i18n.setLang("en").set("menu", menu.html(await sqlite.menus.getPublic("en")));

export default (props: any) => {
    return ( <ul class="menu hide">{props.children}</ul> );
}
