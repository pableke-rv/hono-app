
import Form from "../components/Form.js";
import nav from "../components/Navigation.js";

function fnLogin() {
    const formSignin = new Form("#signin"); // instance
    formSignin.submit(ev => {
        formSignin.send().then(info => { // Access allowed
            window.location.href = "admin?ok=" + info;
        });
        ev.preventDefault();
    });
    nav.setLangs("/login");
}

function fnAdmin() {
    nav.setLangs("/admin");
}

export default () => {
    nav.addListener("/login", fnLogin).addListener("/logout", fnLogin)
        .addListener("/admin", fnAdmin);
}
