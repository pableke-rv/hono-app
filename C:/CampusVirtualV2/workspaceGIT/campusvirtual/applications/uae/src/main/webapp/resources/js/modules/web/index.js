import api from"../../components/Api.js";import Form from"../../components/Form.js";import nav from"../../components/Navigation.js";import sb from"../../components/StringBox.js";import excel from"../../components/Excel.js";import menus from"../../data/menus.js";function fnIndex(){const o=document.getElementById("info-pokemon"),t=e=>{o.innerHTML=`<div>
                <h3>Pokemon ${e.name}</h3>
                <ul>
                    <li><b>Nombre:</b> ${e.name}</li>
                    <li><b>Tipo:</b> ${e.types[0].type.name}</li>
                    <li><b>Especie:</b> ${e.species.name}</li>
                    <li><b>HP:</b> ${e.stats[0].base_stat}</li>
                    <li><b>Ataque:</b> ${e.stats[1].base_stat}</li>
                    <li><b>Defensa:</b> ${e.stats[3].base_stat}</li>
                </ul>
            </div>
            <img src="${e.sprites.front_default}" alt="${e.name}">`,o.show(),console.log(e)};var e=new Form("#form-pokemon");e.submit(e=>e.preventDefault()),e.setAutocomplete("#ac-pokemon",{source:(o,t)=>{const n=e=>sb.ilike(e.name,o);api.init().json("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0").then(e=>t.render(e.results.filter(n)))},render:e=>e.name,select:e=>(api.json("https://pokeapi.co/api/v2/pokemon/"+e.name).then(t),e.name),onReset:()=>o.hide()}),document.getElementById("xlsx").addEventListener("click",e=>{excel.json(menus,{keys:["id","tipo","nombre","titulo","orden","mask","creado","padre"],columns:{titulo:(e,o)=>{e.l={Target:o.enlace,Tooltip:"Find us @ SheetJS.com!"}},orden:e=>{e.t="n"},creado:e=>{e.t="d"}}})}),nav.setScript("index-js",fnIndex)}nav.ready(fnIndex);export default fnIndex;