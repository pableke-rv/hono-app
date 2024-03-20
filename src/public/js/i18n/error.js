
export class ValidationError extends Error {
    constructor(message, field, tiperr, ...args) {
        super(message, args);
        this.field = field;
        this.tiperr = tiperr;
    }
}
