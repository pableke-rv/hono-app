
import tabs from "../../components/Tabs.js";
import Form from "../../components/Form.js";
import nav from "../../components/Navigation.js";

function fnAdmin() { // Script id
    const formProfile = new Form("#profile"); // instance
    formProfile.submit(ev => {
        formProfile.send().then(info => {
            tabs.setActive(0);
            formProfile.setOk(info);
        });
        ev.preventDefault();
    });

    // Register handler for navigation
    nav.setScript("admin-js", fnAdmin);
}

// Register event on page load and export default handler
document.addEventListener("DOMContentLoaded", fnAdmin);
export default fnAdmin;
