
import en from "./en.js";
import es from "./es.js";
// referencia local a i18n en la parte publica (cliente)
import i18n from "app/i18n/langs";

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
    list = list || ""; // languages list (ej: es-ES,es)
    return list.split(",").find(lang => client[lang]) || i18n.getDefault();
}

globalThis.log = (err, msg) => {
	if (err)
		console.error(err);
	else
		console.log(msg);
}

// Server language container
export default i18n;
