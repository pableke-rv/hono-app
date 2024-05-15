
import Form from "../../../components/Form.js";
import msgs from "./i18n.js";

function List() {
	const self = this; //self instance

    this.init = () => {
        i18n.addLangs(msgs).setCurrent(IRSE.lang); // Init. lang
        const formList = new Form("#xeco-filtro"); // Current form
        window.clickVinc = () => formList.reset(".ui-filter").setval("#estado", "1").click("#filter-list");
        window.onList = () => formList.reset(".ui-filter").setval("#firma", "5").loading();
        window.clickList = () => onList().click("#filter-list", "click");
        return self;
    }
}

export default new List();
