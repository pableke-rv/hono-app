
import api from "./components/Api.js";
import Form from "./components/Form.js";
import Table from "./components/Table.js";
import nav from "./components/Navigation.js";
import menu from "./components/Menu.js";
import menus from "./data/menus.js";
import maps from "./xeco/iris/tests.js";
import i18n from "./i18n/langs.js";

document.addEventListener("DOMContentLoaded", () => {
    const menuHTML = document.querySelector("ul.menu");
    menuHTML.innerHTML = menu.html(menus.filter(node => (node.tipo == 1)).sort((a, b) => (a.orden - b.orden)));
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
    const linkLang = langs.querySelector('[href="?lang=' + i18n.get("lang") + '"]');
    langs.firstElementChild.firstElementChild.src = linkLang.firstElementChild.src;

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

function tables() {
    const table = new Table(document.querySelector("table"));
    table.set("onRender", (data, status, resume) => {
        return `<tr class="tb-data">
            <td class="text-center">${status.count}</td>
            <td><a href="#">${data.nombre}</a></td>
            <td>${data.titulo}</td>
            <td class="text-center">${data.icono || ""}</td>
            <td class="text-center"><a href="#remove" class="fas fa-times action text-red text-xl resize row-action" title="Desasociar partida"></a></td>
        </tr>`;
    });
    table.set("onFooter", resume => `<tr><td colspan="${resume.columns}">Filas: ${resume.size}</td></tr>`);
    table.render(menus.filter(node => (node.tipo == 1)));
}

nav.addListener("/", fnLoadIndex).addListener("/index.html", fnLoadIndex)
    .addListener("/views/maps.html", maps).addListener("/views/tables.html", tables);
