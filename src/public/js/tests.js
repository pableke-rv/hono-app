
import api from "./components/Api.js";
import Form from "./components/Form.js";
import nav from "./components/Navigation.js";
import maps from "./xeco/iris/tests.js";
import i18n from "./i18n/langs.js";

document.addEventListener("DOMContentLoaded", () => {
    i18n.setLanguage(); // Client language

    const menuHTML = document.querySelector("ul.menu");
    menuHTML.slideIn();
    // toggle phone menu
    const menuToggleBtn = document.querySelector("#menu-toggle");
    menuToggleBtn.addEventListener("click", ev => {
        menuHTML.closest("nav").toggle("active");
        menuToggleBtn.children.toggle();
    });

    // Language selector
    const html = document.documentElement;
    const langs = document.getElementById("languages");
    const fnLang = link => { langs.firstElementChild.firstElementChild.src = link.firstElementChild.src; };
    //langs.querySelectorAll("a").forEach(link => link.addEventListener("click", ev => { fnLang(link); })); // force reload
    fnLang(langs.querySelector("." + i18n.get("lang")));

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    const themeToggleBtn = document.querySelector("#theme-toggle");
    if ((localStorage.getItem("color-theme") === "dark") || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        html.classList.add("dark");
        themeToggleBtn.lastElementChild.show(); // ligth icon
    }
    else {
        html.classList.remove("dark");
        themeToggleBtn.firstElementChild.show(); // dark icon
    }
    themeToggleBtn.addEventListener("click", function() {
        // toggle icons inside button
        themeToggleBtn.children.toggle();
    
        // if set via local storage previously
        if (localStorage.getItem("color-theme")) {
            if (localStorage.getItem("color-theme") === "light") {
                html.classList.add("dark");
                localStorage.setItem("color-theme", "dark");
            } else {
                html.classList.remove("dark");
                localStorage.setItem("color-theme", "light");
            }
        }
        else { // if NOT set via local storage previously
            if (html.classList.contains("dark")) {
                html.classList.remove("dark");
                localStorage.setItem("color-theme", "light");
            } else {
                html.classList.add("dark");
                localStorage.setItem("color-theme", "dark");
            }
        }
    });
});

function fnLoadIndex() {
    // Tab0 = API Tests
    document.querySelector('a[href="/api/maps"]').addEventListener("click", ev => {
        api.text(ev.target.href).then(nav.setMain).then(maps);
        ev.preventDefault();
    });

    // Tab1 = Pokemon API Tests
    const info = document.getElementById("info-pokemon");
    const fnSelect = data => {
        info.innerHTML = `<div>
                <h3>Pokemon ${data.name}</h3>
                <ul>
                    <li><b>Nombre:</b> ${data.name}</li>
                    <li><b>Tipo:</b> ${data.types[0].type.name}</li>
                    <li><b>Especie:</b> ${data.species.name}</li>
                    <li><b>HP:</b> ${data.stats[0].base_stat}</li>
                    <li><b>Ataque:</b> ${data.stats[1].base_stat}</li>
                    <li><b>Defensa:</b> ${data.stats[3].base_stat}</li>
                </ul>
            </div>
            <img src="${data.sprites.front_default}" alt="${data.name}">`;
        info.show();
        console.log(data);
    }

    const formPokemon = new Form("#form-pokemon"); // instance
    formPokemon.submit(ev => ev.preventDefault()); // ajax submit
    formPokemon.setAutocomplete("#pokemon", {
        source: (term, acPokemon) => {
            const fnFilter = pokemon => String.ilike(pokemon.name, term);
            api.json("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
                .then(data => acPokemon.render(data.results.filter(fnFilter)));
        },
		render: item => item.name,
		select: item => item.name,
		afterSelect: item => api.json(`https://pokeapi.co/api/v2/pokemon/${item.name}`).then(fnSelect),
		onReset: () => info.hide()
    });
}

nav.addListener("/", fnLoadIndex).addListener("/index", fnLoadIndex)
    .addListener("/maps", maps);
