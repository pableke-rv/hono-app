
const isnum = val => ((typeof(val) === "number") || (val instanceof Number));
const round = (num, scale) => +(Math.round(num + "e+" + scale)  + "e-" + scale);

function NumberBox() {
	const self = this; //self instance

    this.round = (num, scale) => num ?? round(num, scale);
	this.rand = (min, max) => Math.random() * ((max || 1e9) - min) + min;
	this.randInt = (min, max) => Math.floor(self.rand(min || 0, max));

    // Int formats
    this.toInt = str => { //String to Int
        if (!str)
            return null; // nada que parsear
        const sign = ((str.charAt(0) == "-") ? "-" : ""); // Get sign number + or -
        const num = parseInt(sign + str.replace(/\D+/g, "")); // Integer number
        return isNaN(num) ? null : num;
    }
    this.isoInt = num => { // Int to String formated
        return isnum(num) ? num.toLocaleString(_lang.lang) : null;
    }
    this.fmtInt = str => { // String to String formated
        return self.isoInt(self.toInt(str));
    }

    // Float formats
    const options = { minimumFractionDigits: 1 };
    this.toFloat = (str, d) => { //String to Float
        if (!str)
            return null; // nada que parsear
        const separator = str.lastIndexOf(d);
        const sign = ((str.charAt(0) == "-") ? "-" : ""); // Get sign number + or -
        const whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
        const decimal = (separator < 0) ? "" : ("." + str.substr(separator + 1)); //decimal part
        const num = parseFloat(sign + whole.replace(/\D+/g, "") + decimal); //float value
        return isNaN(num) ? null : num;
    }
    this.isoFloat = (num, n) => { // Float to String formated
        n = n ?? 2; // 2 decimals by default
        options.minimumFractionDigits = n;
        return isnum(num) ? round(num, n).toLocaleString(_lang.lang, options) : null;
    }
    this.fmtFloat = (str, dIn, n) => { // String to String formated
        return self.isoFloat(self.toFloat(str, dIn), n);
    }
}

// Extends Number prototype
Number.isNumber = isnum;
Number.prototype.mask = function(i) { return ((this >> i) & 1); } // check bit at i position
Number.prototype.bitor = function(flags) { return ((this & flags) > 0); } // some flags up?
Number.prototype.bitand = function(flags) { return ((this & flags) == flags); } // all flags up?
Number.prototype.round = function(digits) { return round(this, digits ?? 2); } // default round 2 decimals

globalThis.isnum = isnum; // Check if Number type
globalThis.dec = (num, min) => ((num > (min ?? 0)) ? num-- : num); // Decrement number until min
globalThis.inc = (num, max) => ((num < max) ? num++ : num); // Increment number until max

export default new NumberBox();
