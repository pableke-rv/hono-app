
import Form from "../../../components/Form.js";
//import dt from "../../../components/DateBox.js";
import msgs from "./i18n.js";

function List() {
	const self = this; //self instance

    //const sysdate = new Date(); // current date
	//const mindate = dt.addDays(sysdate, -9).isoDate(sysdate); // ultimos 10 dias

    this.init = () => {
        i18n.addLangs(msgs).setCurrent(IRSE.lang); // Init. lang
        const formList = new Form("#xeco-filtro"); // Current form
        window.clickVinc = () => formList.reset(".ui-filter").setval("#estado", "1").click("#filter-list");
        window.onList = () => formList.reset(".ui-filter").setval("#firma", "5").loading();
        window.clickList = () => window.onList().click("#filter-list");
        //window.onListAll = () => formList.reset(".ui-filter").setval("#f-min", mindate).loading();
        return self;
    }
}

export default new List();
