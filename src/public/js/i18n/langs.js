
import i18n from "./validators.js";

const KEY_ERR = "msgError"; // Error key
const MSGS = {}; // Messages container
let errors = 0; // Errors counter

i18n.getMsgs = () => MSGS;
i18n.getMsg = name => MSGS[name];
i18n.setMsg = (name, msg) => {
    MSGS[name] = i18n.get(msg);
    return self;
}

i18n.setOk = msg => i18n.setMsg("msgOk", msg);
i18n.setInfo = msg => i18n.setMsg("msgInfo", msg);
i18n.setWarn = msg => i18n.setMsg("msgWarn", msg);
i18n.getError = name => MSGS[name || KEY_ERR];
i18n.reject = msg => !i18n.setMsg(KEY_ERR, msg);
i18n.setMsgError = (name, msg) => { errors++; return i18n.setMsg(name, msg); }
i18n.setInputError = (name, tip, msg) => i18n.setMsgError(name, tip).setMsg(KEY_ERR, msg);
i18n.setError = (msg, name, tip) => {
    return tip ? i18n.setInputError(name, tip, msg): i18n.setMsgError(name || KEY_ERR, msg);
}

i18n.isOk = () => (errors == 0);
i18n.isError = () => (errors > 0);
i18n.reset = () => {
    errors = 0;
    Object.clear(MSGS);
    return self;
}

// Extends Date prototype
Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
}
Date.prototype.diffDays = function(date) { // Days between to dates
    return Math.floor((date.getTime() - this.getTime()) / (1000 * 3600 * 24));
}

// String formats
String.prototype.inDay = function(dt) {
    return this.startsWith(dt.substring(0, 10)); //yyyy-mm-dd
}
String.prototype.isoTime = function() {
    return this.substring(11, 19); //hh:MM:ss
}
String.prototype.isoTimeShort = function() {
    return this.substring(11, 16); //hh:MM
}
String.prototype.getHours = function() {
    return +this.substring(11, 13); //hh int format
}
i18n.getHours = str => str && str.getHours(); // Get HH int format

export default i18n;
