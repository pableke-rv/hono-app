
import nav from "./components/Navigation.js";
import MultiSelectCheckbox from "./components/MultiSelectCheckbox.js";
//import menu from "./components/Menu.js";
//import menus from "./data/menus.js";
import i18n from "./i18n/langs.js";

//const menuTree = menus.filter(node => (node.tipo == 1)).sort((a, b) => (a.orden - b.orden));

nav.ready(() => {
    const langs = document.getElementById("languages");
    const link = langs.querySelector("a#" + i18n.get("lang")); // Language selector
    langs.firstElementChild.firstElementChild.src = link.firstElementChild.src;

    /* multioptions */
    const options = new MultiSelectCheckbox(".multi-options", { name: "animales" });
    const animales = [ { value: 1, label: "Perro" }, { value: 2, label: "Gato" }, { value: 3, label: "Girafa" }, { value: 4, label: "Leon" }, { value: 5, label: "Tiburón" } ]
    options.setItems(animales);

    const menuHTML = document.querySelector("ul.menu");
    //menuHTML.innerHTML = menuHTML.innerHTML || menu.html(menuTree);
    menuHTML.classList.add("active");

    // toggle phone menu
    const menuToggleBtn = document.querySelector("#menu-toggle");
    menuToggleBtn.addEventListener("click", ev => {
        menuHTML.closest("nav").toggle("active");
        menuToggleBtn.children.toggle();
    });

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    const themeToggleBtn = document.querySelector("#theme-toggle");
    if (nav.setTheme().isDarkMode()) // check current mode
        themeToggleBtn.lastElementChild.show(); // light icon
    else
        themeToggleBtn.firstElementChild.show(); // dark icon
    themeToggleBtn.addEventListener("click", function() {
        nav.toggleMode(); // toggle mode light / dark
        themeToggleBtn.children.toggle();  // toggle icons inside button
    });

    nav.setClick(document);
});
