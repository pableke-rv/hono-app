
import api from "./Api.js";
import alerts from "./Alerts.js";
import tabs from "./Tabs.js";
import i18n from "../i18n/langs.js";

function Navigation() {
	const self = this; //self instance
    const main = document.body.children.findOne("main");
    const langs = document.getElementById("languages");
    const links = langs.querySelectorAll("a");
    var isVt = true;

    this.isStatic = pathname => pathname.endsWith(".html");
    this.isDynamic = pathname => !self.isStatic(pathname);
    this.init = () => {
        i18n.setLanguage(); // Client language
        const link = langs.querySelector("a#" + i18n.get("lang")); // Language selector
        langs.firstElementChild.firstElementChild.src = link.firstElementChild.src;
        return self;
    }
    this.setLangs = pathname => {
        const suffix = self.isStatic(window.location.pathname) ? ".html?nav=1" : "";
        links.forEach(link => { link.href = "/" + link.id + pathname + suffix; });
        return self;
    }
    // Capture clicks events to load main via AJAX
    this.setClick = (el, selector) => {
        selector = selector || "a.load-main";
        el.querySelectorAll(selector).setClick((ev, link) => {
            if (self.isStatic(link.href))
                return; // Not click event necesary 
            api.text(link.href).then(text => { // Load main via AJAX on click
                self.setMain(text, link.getAttribute("href"));
            });
            ev.preventDefault();
        });
        return self;
    }
    this.setMain = (data, pathname, vt) => {
        if (!data) // exists changes
            return self; // Not changes
        isVt = vt; // View Transition indicator
        main.innerHTML = data; // update contents
        const basename = pathname.substring(pathname.lastIndexOf("/"));
        document.dispatchEvent(new Event("vt:" + basename)); // Dispatch vt event

        alerts.top(); // Show top view
        tabs.load(main); // reload tabs events
        return self.setClick(main); // Listen new clicks
    }
    this.addListener = (name, fn) => {
        if (window.location.pathname.endsWith(name))
            document.addEventListener("DOMContentLoaded", fn);
        document.addEventListener("vt:" + name, fn);
        //console.log(window.location.pathname, name, "vt:" + name);
        return self;
    }

    // cargamos la pagina de destino con fetch
    const fetchMain = url => {
        api.text(url.href).then(text => {
            // utilizamos la api de View Transitions
            document.startViewTransition(() => {
                // extraigo el contenido de la etiqueta main
                const re =/<main[^>]*>([\s\S]*)<\/main>/im;
                self.setMain(text.match(re)[1], url.pathname, true);
            });
        });
    }

    // Check to see if API is supported
    if (document.startViewTransition) {
        // capture navigation event links
        window.navigation.addEventListener("navigate", ev => {
            const url = new URL(ev.destination.url);
            //console.log(location.pathname, isVt, url, ev);
            if (url.searchParams.get("nav") || self.isDynamic(url.pathname))
                return; // Desactive View Transition interceptor
            // Current location, Important! AJAX NOT to change url
            if (isVt && (location.pathname == url.pathname))
                return ev.preventDefault(); // Current destination
            // Si es una pagina externa => ignoramos el evento
            if (location.origin == url.origin) {
                // Navegación en el mismo dominio (origin)
                const handler = () => fetchMain(url);
                ev.intercept({ handler }); // intercept event
            }
        });
    }
}

export default new Navigation();
