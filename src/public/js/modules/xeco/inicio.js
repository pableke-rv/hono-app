
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";

pf.ready(() => {
    const formXeco = new Form("#xeco");
    dom.toggleInfo(document);
	dom.eachInput(".ac-xeco-item", el => {
		$(el).attr("type", "search").keydown(fnAcChange).change(fnAcReset).on("search", fnAcReset).autocomplete({
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			minLength: 4, //reduce matches
			focus: fnFalse, //no change focus on select
			search: fnAcSearch, //lunch source
			source: fnSourceItems, //show datalist
			select: fnSelectItem //show item selected
		});
	});
});

window.showAlerts = pf.showAlerts;
window.showNextTab = window.showTab;
window.viewTab = tabs.showTab;
