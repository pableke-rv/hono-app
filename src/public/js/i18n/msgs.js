
export default class Msgs {
    #lang; // private lang object (readonly)
    #MSGS = {}; // Messages container
    #KEY_ERR = "msgError"; // Error key
    #errors = 0; // Errors counter

    constructor(lang) {
        this.#lang = lang;
    }

    getLang() { return this.#lang; }
    getMsgs() { return this.#MSGS; }
    getMsg(name) { return this.#MSGS[name]; }
    setMsg(name, msg) {
        this.#MSGS[name] = this.#lang[msg] || msg;
        return this;
    }
    reset() {
        this.#errors = 0;
        Object.clear(this.#MSGS);
        return this;
    }

    isOk() { return (this.#errors == 0); }
    isError() { return (this.#errors > 0); }

    setOk(msg) { return this.setMsg("msgOk", msg); }
    setInfo(msg) { return this.setMsg("msgInfo", msg); }
    setWarn(msg) { return this.setMsg("msgWarn", msg); }
    getError(name) { return this.#MSGS[name || this.#KEY_ERR]; }
    setMsgError(name, msg) { this.#errors++; return this.setMsg(name, msg); }
    reject(msg) { return this.setMsgError(this.#KEY_ERR, msg); } // Error and finish
    catch(err) { return (this.isOk() || this.#MSGS.msgError) ? this : this.reject(err); } // If error and empty message => set message
    setInputError(name, tip, msg) { return this.setMsgError(name, tip).setMsg(this.#KEY_ERR, msg); }
    setError(msg, name, tip) {
        return tip ? this.setInputError(name, tip, msg) : this.setMsgError(name || this.#KEY_ERR, msg);
    }

    setException(err) {
        console.error(err); // Show log error
        const msg = err.message || err; // Main message
        return this.setError(msg, err.field, err.tiperr);
    }
}
