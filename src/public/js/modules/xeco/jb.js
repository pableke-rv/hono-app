
import Form from "../../components/Form.js";
import pf from "../../components/Primefaces.js";

pf.ready(() => {
    const formJb = new Form("#xeco-jb");
    const fnSource = term => pf.sendTerm("rcFindDcs", term);
    const fnSelect = () => formJb.click("#search");
    const fnReset = () => formJb.click("#reset");
    const acDocContable = formJb.setAcItems("#num-dc", fnSource, fnSelect, fnReset);

    window.jbSearch = () => {
        const formDoc = new Form("#xeco-doc");
        return formDoc.isCached(formJb.getval("#dc")) ? false : loading();
    }
    window.jbReset = () => {
        loading();
        acDocContable.reload();
    }
});
