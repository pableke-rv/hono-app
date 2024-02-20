
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

// Server language container
export default i18n;
