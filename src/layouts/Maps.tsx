
import Layout from "./Main";
import { Tab } from "../components/Tabs";
import i18n from "../i18n/langs.js";

export const MapsTab0 = () => {
    return (
        <Tab id="tab-0" active="active" title="GOOGLE MAPS API">
            <div class="ui-blocks">
                <label class="ui-block-xl ui-icon-block">
                    <div class="label required">Origen de la ruta:</div>
                    <i class="fas fa-map-marker-alt ui-icon-left"></i>
                    <input type="search" id="origen" name="origen" class="ui-input ui-ruta" 
                        tabindex="1" autocomplete="off" placeholder="Search a place" />
                    <div class="ui-errtip"></div>
                </label>
            </div>

            <div class="address-components hide">
                <h2>Address Components:</h2>
                <ul>
                    <li><b>Dirección (route):</b> @dir;</li>
                    <li><b>Localidad (locality):</b> @localidad;</li>
                    <li><b>Código Postal (postal_code):</b> @cp;</li>
                    <li><b>Provincia (administrative_area_level_2):</b> @provincia;</li>
                    <li><b>Comunidad Autonoma (administrative_area_level_1):</b> @ccaa;</li>
                    <li><b>País (country):</b> @pais;</li>
                </ul>
            </div>

            <hr/>
            <div class="dieta hide">
                <h2>Dietas:</h2>
                <ul>
                    <li><b>País / Ciudad:</b> @name;</li>
                    <li><b>Alojamiento 1:</b> @a1; €</li>
                    <li><b>Alojamiento 2:</b> @a2; €</li>
                    <li><b>Manutención 1:</b> @m1; €</li>
                    <li><b>Manutención 2:</b> @m2; €</li>
                </ul>
            </div>
        </Tab>
    );
}

export const Maps = (props: any) => {
    return (
        <Layout>
            <MapsTab0/>
        </Layout>
    );
}
