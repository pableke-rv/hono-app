
import api from "../components/Api.js";
import Form from "../components/Form.js";
import sb from "../components/StringBox.js";
import nav from "../components/Navigation.js";

function fnIndex() {
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
    formPokemon.setAutocomplete("#ac-pokemon", {
        source: (term, acPokemon) => {
            const fnFilter = pokemon => sb.ilike(pokemon.name, term);
            api.init()
                .json("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
                .then(data => acPokemon.render(data.results.filter(fnFilter)));
        },
		render: item => item.name,
		select: item => item.name,
		afterSelect: item => api.json(`https://pokeapi.co/api/v2/pokemon/${item.name}`).then(fnSelect),
		onReset: () => info.hide()
    });
}

export default () => {
    nav.addListener("/index.html", fnIndex).addListener("/index", fnIndex).addListener("/", fnIndex);
}
