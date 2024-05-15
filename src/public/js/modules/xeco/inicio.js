
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";

pf.ready(() => {
    dom.toggleInfo(document);
    const formXeco = new Form("#xeco");
});

window.showAlerts = pf.showAlerts;
window.showNextTab = window.showTab;
window.viewTab = tabs.showTab;
