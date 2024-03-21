
import i18n from "./langs.js";

i18n.setException = (lang, err) => {
    i18n.setLang(lang); // Define lang.
    console.error(err); // Show log-error
    if (err instanceof ValidationError) // translate messages
        return i18n.setError(err.message, err.field, err.tiperr);
    return i18n.setError(err.message);
}

export class ValidationError extends Error {
    constructor(message, field, tiperr, ...args) {
        super(message, args);
        this.field = field;
        this.tiperr = tiperr;
        i18n.reset();
    }
}

export class LoginError extends ValidationError {
    constructor(field, tiperr, ...args) {
        super("userNotFound", field, tiperr, args);
    }
}
