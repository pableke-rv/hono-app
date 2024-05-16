
import en from "./langs/en/lang.js";
import es from "./langs/es/lang.js";
import sb from "../components/StringBox.js";

const isnum = val => ((typeof(val) === "number") || (val instanceof Number));
const round = (num, scale) => +(Math.round(num + "e+" + scale)  + "e-" + scale);

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

    this.getValidation = () => _lang.validators; // Current validators
    this.getValidators = () => _lang.validators.reset(); // Initialize messages
    this.resetValidators = lang => self.setLang(lang).getValidators(); // Reset lang instance
    this.createValidators = lang => self.setLang(lang).getLang().createValidators(); // Create instance

    this.get = msg => _lang[msg] || msg || "";
    this.getItem = (msg, index) => _lang[msg][index];
    this.confirm = msg => msg ? confirm(self.get(msg)) : true;
    this.set = (name, msg) => { _lang[name] = msg; return self; }

    // Add i18n Date formats
    _langs.en.isoDate = str => str && str.substring(0, 10); //Iso string = yyyy-mm-dd
    _langs.es.isoDate = str => str && (str.substring(8, 10) + "/" + str.substring(5, 7) + "/" + str.substring(0, 4)); //Iso string to dd/mm/yyyy

    this.enDate = _langs.en.isoDate; //Iso string = yyyy-mm-dd
    this.isoTime = str => str && str.substring(11, 19); //hh:MM:ss
    this.isoTimeShort = str => str && str.substring(11, 16); //hh:MM
    this.isoDate = str => _lang.isoDate(str); // String locale date
    this.isoDateTime = str => self.isoDate(str) + " " + self.isoTime(str); //ISO date + hh:MM:ss

    const BOOLEAN_TRUE = ["1", "true", "yes", "on"];
    this.boolval = str => globalThis.isset(str) ? _lang.msgBool[+BOOLEAN_TRUE.includes("" + str)] : null;
    this.strval = (data, name) => data[name + "_" + _lang.lang] || data[name];

    // Float formats
    const options = { minimumFractionDigits: 2 };
    function toFloat(str, d) { //String to Float
        if (!str)
            return null; // nada que parsear
        const separator = str.lastIndexOf(d);
        const sign = ((str.charAt(0) == "-") ? "-" : ""); // Get sign number + or -
        const whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
        const decimal = (separator < 0) ? "" : ("." + str.substr(separator + 1)); //decimal part
        const num = parseFloat(sign + whole.replace(/\D+/g, "") + decimal); //float value
        return isNaN(num) ? null : num;
    }
    function isoFloat(num, n) { // Float to String formated
        return isnum(num) ? round(num, n ?? 2).toLocaleString(_lang.lang, options) : null;
    }
    function fmtFloat(str, dIn, n) { // String to String formated
        return isoFloat(toFloat(str, dIn), n);
    }

    _langs.en.isoFloat = isoFloat; // Float to String formated
    _langs.en.toFloat = str => toFloat(str, ".");  // String to Float
    _langs.en.fmtFloat = (str, n) => fmtFloat(str, ".", n); // String to EN String formated

    _langs.es.isoFloat = isoFloat; // Float to String formated
    _langs.es.toFloat = str => toFloat(str, ",");  // String to Float
    _langs.es.fmtFloat = (str, n) => fmtFloat(str, ",", n); // String to ES String formated

    this.toFloat = str => _lang.toFloat(str);
    this.isoFloat = num => _lang.isoFloat(num);
    this.isoFloat2 = num => _lang.isoFloat(num);
    this.isoFloat3 = num => _lang.isoFloat(num, 3);
    this.fmtFloat = str => _lang.fmtFloat(str);
    this.fmtFloat2 = str => _lang.fmtFloat(str);
    this.fmtFloat3 = str => _lang.fmtFloat(str, 3);

    // Int formats
    function toInt(str) { //String to Int
        if (!str)
            return null; // nada que parsear
        const sign = ((str.charAt(0) == "-") ? "-" : ""); // Get sign number + or -
        const num = parseInt(sign + str.replace(/\D+/g, "")); // Integer number
        return isNaN(num) ? null : num;
    }
    function isoInt(num) { // Int to String formated
        return isnum(num) ? num.toLocaleString(_lang.lang) : null;
    }
    function fmtInt(str) { // String to String formated
        return isoInt(toInt(str));
    }

    this.toInt = toInt; // String to Int
    this.isoInt = isoInt; // Int to String formated
    this.fmtInt = fmtInt; // String to EN String formated

    // Extends Number prototype
    Number.isNumber = isnum;
    Number.prototype.mask = function(i) { return ((this >> i) & 1); } // check bit at i position
    Number.prototype.bitor = function(flags) { return ((this & flags) > 0); } // some flags up?
    Number.prototype.bitand = function(flags) { return ((this & flags) == flags); } // all flags up?
    Number.prototype.round = function(digits) { return round(this, digits ?? 2); } // default round 2 decimals

    globalThis.isnum = isnum; // Check if Number type
    globalThis.dec = (num, min) => ((num > (min ?? 0)) ? num-- : num); // Decrement number until min
    globalThis.inc = (num, max) => ((num < max) ? num++ : num); // Increment number until max
}

export default new Langs();
