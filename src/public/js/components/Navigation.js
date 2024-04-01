
import api from "./Api.js";
import alerts from "./Alerts.js";
import tabs from "./Tabs.js";

function Navigation() {
	const self = this; //self instance
    const main = document.body.children.findOne("main");

    this.isStatic = pathname => pathname.endsWith(".html");
    this.isDynamic = pathname => !self.isStatic(pathname);
    this.redirect = pathname => { window.location.href = pathname; }

    // Capture clicks events to load main via AJAX
    this.setClick = (el, selector) => {
        selector = selector || "a.load-main";
        el.querySelectorAll(selector).setClick((ev, link) => {
            const fnLoad = text => self.setMain(text, link.getAttribute("href"));
            api.init().text(link.href).then(fnLoad); // Load main via AJAX on click
            ev.preventDefault();
        });
        return self;
    }
    this.setMain = (data, pathname) => {
        if (!data) // exists changes
            return self; // Not changes
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

    // Check to see if API is supported
    if (document.startViewTransition) {
        // capture navigation event links
        window.navigation.addEventListener("navigate", ev => {
            const url = new URL(ev.destination.url);
            //console.log(location.pathname, url, ev);
            if (url.searchParams.get("nav") || self.isDynamic(url.pathname))
                return; // Desactive View Transition interceptor
            // Current location, Important! AJAX NOT to change url
            if (location.pathname == url.pathname)
                return ev.preventDefault(); // Current destination
            // Si es una pagina externa => ignoramos el evento
            if (location.origin == url.origin) {
                // Navegación en el mismo dominio (origin)
                const RE_MAIN = /<main[^>]*>([\s\S]*)<\/main>/im;
                const fnTransition = text => {
                    // Extraigo el contenido de la etiqueta main
                    const fnLoad = () => self.setMain(text.match(RE_MAIN)[1], url.pathname);
                    // Utilizamos la api de View Transitions
                    document.startViewTransition(fnLoad);
                }
                // Intercept event => Cargamos la pagina de destino con fetch
                const handler = () => api.init().text(url.href).then(fnTransition);
                ev.intercept({ handler }); // intercept event
            }
        });
    }
}

export default new Navigation();
