
import en from "./main/en.js";
import es from "./main/es.js";

const isnum = val => ((typeof(val) === "number") || (val instanceof Number));
const round = (num, scale) => +(Math.round(num + "e+" + scale)  + "e-" + scale);

function I18n() {
	const self = this; //self instance
    const DEFAULT = "en"; // Default iso lang

    let _langs = { en, "en-GB": en, es, "es-ES": es }; // All langs
    let _lang = en; // Default language

    this.getLangs = () => _langs;
    this.getLang = () => _lang;
    this.setLang = lang => { // especific language
        _lang = _langs[lang] || _lang;
        return self;
    }

    this.addLang = function(name, lang) {
        Object.assign(_langs[name], lang);
        return self;
    }

    this.getIsoLangs = () => Object.keys(_langs);
	this.getNavLang = () => navigator.language || navigator.userLanguage; // default browser language
    this.getIsoLang = () => document.documentElement.getAttribute("lang") || self.getNavLang() || DEFAULT;
    this.getAcceptLang = list => {
        list = list || ""; // languages list (ej: es-ES,es)
        return list.split(",").find(lang => _langs[lang]) || DEFAULT;
    }

    this.get = msg => _lang[msg] || msg || "";
    this.getItem = (msg, index) => _lang[msg][index];
    this.set = (name, msg) => { _lang[name] = msg; return self; }

    // Add i18n Date formats
    _langs.en.isoDate = str => str && str.substring(0, 10); //Iso string = yyyy-mm-dd
    _langs.es.isoDate = str => str && (str.substring(8, 10) + "/" + str.substring(5, 7) + "/" + str.substring(0, 4)); //Iso string to dd/mm/yyyy

    this.enDate = _langs.en.isoDate; //Iso string = yyyy-mm-dd
    this.isoTime = str => str && str.isoTime(); //Iso hh:MM:ss
    this.isoTimeShort = str => str && str.isoTimeShort(); //Iso hh:MM
    this.isoDate = str => self.getLang().isoDate(str); // String locale date
    this.isoDateTime = str => self.isoDate(str) + " " + i18n.isoTime(str); //ISO date + hh:MM:ss

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
        return isnum(num) ? round(num, n ?? 2).toLocaleString(i18n.getLang().lang, options) : null;
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

    this.toFloat = str => self.getLang().toFloat(str);
    this.isoFloat = num => self.getLang().isoFloat(num);
    this.isoFloat2 = num => self.getLang().isoFloat(num);
    this.isoFloat3 = num => self.getLang().isoFloat(num, 3);
    this.fmtFloat = str => self.getLang().fmtFloat(str);
    this.fmtFloat2 = str => self.getLang().fmtFloat(str);
    this.fmtFloat3 = str => self.getLang().fmtFloat(str, 3);

    // Int formats
    function toInt(str) { //String to Int
        if (!str)
            return null; // nada que parsear
        const sign = ((str.charAt(0) == "-") ? "-" : ""); // Get sign number + or -
        const num = parseInt(sign + str.replace(/\D+/g, "")); // Integer number
        return isNaN(num) ? null : num;
    }
    function isoInt(num) { // Int to String formated
        return isnum(num) ? num.toLocaleString(i18n.getLang().lang) : null;
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

export default new I18n();
