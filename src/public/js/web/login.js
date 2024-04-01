
import tabs from "../components/Tabs.js";
import Form from "../components/Form.js";
import nav from "../components/Navigation.js";

function fnLogin() {
    const formSignin = new Form("#signin"); // instance
    formSignin.submit(ev => {
        formSignin.send().then(() => nav.redirect("/admin/welcome")); // Access allowed
        ev.preventDefault();
    });
}

function fnAdmin() {
    const formProfile = new Form("#profile"); // instance
    formProfile.submit(ev => {
        formProfile.send().then(info => {
            tabs.setActive(0);
            formProfile.setOk(info);
        });
        ev.preventDefault();
    });
}

export default () => {
    nav.addListener("/login", fnLogin).addListener("/logout", fnLogin)
        .addListener("/admin", fnAdmin);
}
