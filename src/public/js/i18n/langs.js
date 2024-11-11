
import en from "./langs/en.js";
import es from "./langs/es.js";
import nb from "../components/NumberBox.js";
import sb from "../components/StringBox.js";
import Validators from "./validators.js";

function Langs() {
	const self = this; //self instance
    const DEFAULT = "en"; // Default iso lang

    let _langs = { en, es }; // All langs
    let _lang = en; // Default language

    this.getLangs = () => _langs;
    this.getLang = () => _lang;
    this.getCurrent = () => _lang;
    this.getI18n = lang => _langs[lang] || _langs[sb.substring(lang, 0, 2)] || _lang;
    this.setLang = lang => { // Load especific language by key
        _lang = self.getI18n(lang);
        return self;
    }

    this.addLang = function(name, lang) {
        Object.assign(_langs[name], lang);
        return self;
    }

    this.getDefault = () => DEFAULT;
    this.getIsoLang = () => _lang.lang;
    this.getIsoLangs = () => Object.keys(_langs);
	this.getNavLang = () => navigator.language || navigator.userLanguage; // default browser language
    this.getLanguage = () => document.documentElement.getAttribute("lang") || self.getNavLang() || DEFAULT;
    this.getAcceptLanguage = list => self.setLang(sb.substring(list, 0, 5)).getIsoLang(); // server header Accept-Language
    this.setLanguage = () => self.setLang(self.getLanguage()); // Set language object

    en.validators = new Validators(en); // constant
    es.validators = new Validators(es); // constant
    this.getValidation = () => _lang.validators; // Current validators
    this.getValidators = () => _lang.validators.reset(); // Initialize messages
    this.resetValidators = lang => self.setLang(lang).getValidators(); // Reset lang instance
    this.createValidators = () => new Validators(_lang); // Create instance

    this.get = msg => _lang[msg] || msg || "";
    this.getItem = (msg, index) => _lang[msg][index];
    this.confirm = msg => msg ? confirm(self.get(msg)) : true;
    this.set = (name, msg) => { _lang[name] = msg; return self; }

    // Add i18n Date formats
    en.isoDate = str => str && str.substring(0, 10); //Iso string = yyyy-mm-dd
    es.isoDate = str => str && (str.substring(8, 10) + "/" + str.substring(5, 7) + "/" + str.substring(0, 4)); //Iso string to dd/mm/yyyy

    this.enDate = en.isoDate; //Iso string = yyyy-mm-dd
    this.isoTime = str => str && str.substring(11, 19); //hh:MM:ss
    this.isoTimeShort = str => str && str.substring(11, 16); //hh:MM
    this.isoDate = str => _lang.isoDate(str); // String locale date
    this.isoDateTime = str => self.isoDate(str) + " " + self.isoTime(str); //ISO date + hh:MM:ss

    const BOOLEAN_TRUE = ["1", "true", "yes", "on"];
    this.boolval = str => globalThis.isset(str) ? _lang.msgBool[+BOOLEAN_TRUE.includes("" + str)] : null;
    this.strval = (data, name) => data[name + "_" + _lang.lang] || data[name];

    // Float formats
    en.toFloat = str => nb.toFloat(str, ".");  // String to Float
    en.isoFloat = (num, n) => nb.isoFloat(num, n, _lang.lang); // Float to String formated
    en.fmtFloat = (str, n) => nb.fmtFloat(str, ".", n, _lang.lang); // String to EN String formated

    es.toFloat = str => nb.toFloat(str, ",");  // String to Float
    es.isoFloat = (num, n) => nb.isoFloat(num, n, _lang.lang); // Float to String formated
    es.fmtFloat = (str, n) => nb.fmtFloat(str, ",", n, _lang.lang); // String to ES String formated

    this.toFloat = str => _lang.toFloat(str);
    this.isoFloat = num => _lang.isoFloat(num);
    this.isoFloat1 = num => _lang.isoFloat(num, 1);
    this.isoFloat2 = num => _lang.isoFloat(num);
    this.isoFloat3 = num => _lang.isoFloat(num, 3);
    this.fmtFloat = str => _lang.fmtFloat(str);
    this.fmtFloat1 = str => _lang.fmtFloat(str, 1);
    this.fmtFloat2 = str => _lang.fmtFloat(str);
    this.fmtFloat3 = str => _lang.fmtFloat(str, 3);

    // Int formats
    this.toInt = nb.toInt; // String to Int
    this.isoInt = num => nb.isoInt(num, _lang.lang); // Int to String formated
    this.fmtInt = str => nb.fmtInt(str, _lang.lang); // String to EN String formated

    // Render styled string
    const STATUS = {};
    const RE_VAR = /[@$](\w+)(\.\w+)?;/g;
    this.render = function(str, data, i, size) {
        if (!str) // has string
            return str;
        i = i || 0;
        STATUS.index = i;
        STATUS.count = i + 1;
        STATUS.size = size || 1;
        data = data || _lang; // default lang
        return str.replace(RE_VAR, (m, k, t) => { // remplace function
            if (m.startsWith("$") || (t == ".f")) // float
                return self.isoFloat(data[k]);
            if (t == ".d") // ISO String format
                return self.isoDate(data[k]); // substring = 0, 10
            return (data[k] ?? STATUS[k] ?? ""); // Default = String
        });
    }
}

export default new Langs();
