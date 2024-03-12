
import en from "./en.js";
import es from "./es.js";
// referencia local a i18n en la parte publica (cliente)
import i18n from "app/i18n/langs";
import sb from "app/js/components/StringBox.js";

// ¡¡Importante!!
// usar siempre la referencia: app/i18n/langs.js en el servidor
// para evitar crear mas de una instancia del modulo
// usar la referncia local: ./i18n/langs.js en el cliente
const client = i18n.getLangs();
Object.assign(client.en, en);
Object.assign(client.es, es);

// Server redefinitions
i18n.confirm = () => true;
i18n.getNavLang = i18n.getDefault;
i18n.getLanguage = list => {
    const langs = i18n.getIsoLangs(); // Keys array of langs
    const fnLang = lang => langs.find(i18n => (lang == i18n) || lang.startsWith(i18n));
    return fnLang(sb.split(list, ",").find(fnLang) || i18n.getDefault());
}

// Server language container
export default i18n;
