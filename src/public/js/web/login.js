
import Form from "../components/Form.js";
import nav from "../components/Navigation.js";

function fnLogin() {
    const formSignin = new Form("#signin"); // instance
    formSignin.submit(ev => {
        formSignin.send();
        ev.preventDefault();
    });
    nav.setLangs("/login");
}

export default () => {
    nav.addListener("/login", fnLogin);
}
