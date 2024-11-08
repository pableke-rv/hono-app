
import Msgs from "./msgs.js";
import { BankNames, IbanCodeLengths } from "../data/banks.js";

function fnSize(valid, name, value, max, msg) {
	if (!value) // String length validations
		return !valid.addRequired(name, msg);
	if (value.length > max)
		 !valid.addError(name, "errMaxlength", msg);
	return true;
}
function fnDate(valid, name, value, msg) {
	if (!value) // iso date validation
		return !valid.addRequired(name, msg); // required
	const ok = /^\d{4}-[01]\d-[0-3]\d/.test(value); // RE_DATE format
	return ok || !valid.addDateError(name, msg);
}

export default class Validators extends Msgs {
	static #sysdate = (new Date()).toISOString();

	// RegEx for validating
	/*const RE_IPv4 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
	const RE_IPv6 = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
	const RE_URL = /(http|fttextp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
	// Cards Numbers
	const RE_VISA = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
	const RE_MASTER_CARD = /^(?:5[1-5][0-9]{14})$/;
	const RE_AMEX = /^(?:3[47][0-9]{13})$/;
	const RE_DISCOVER = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
	const RE_DINER_CLUB = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
	const RE_JCB = /^(?:(?:2131|1800|35\d{3})\d{11})$/;*/

	gt(name, value, min, msgtip, msg) { return (value && (value > min)) ? this : this.addError(name, msgtip, msg); } // required gt min
	gt1(name, value, msgtip, msg) { return this.gt(name, value, 1, msgtip, msg); } // required gt1
	gt0(name, value, msg) { return this.gt(name, value, 0, "errGt0", msg); } // required gt0
	ge(name, value, min, msgtip, msg) { return (!value || (value >= min)) ? this : this.addError(name, msgtip, msg); } // optional or ge min
	ge1(name, value, msgtip, msg) { return this.ge(name, value, 1, msgtip, msg); } // optional or ge1
	ge0(name, value, msg) { return this.ge(name, value, 0, "errGt0", msg); } // optional or ge0
	max(name, value, max, msg) { return (!value || (value.length <= max)) ? this : this.addError(name, "errMaxlength", msg); } // optional or length <= max
	le(name, value, max, msgtip, msg) { return (value && (value > 0) && (value <= max)) ? this : this.addError(name, msgtip, msg); } // required gt0 and le max
	le10(name, value, msgtip, msg) { return this.le(name, value, 10, msgtip, msg); } // required gt0 and le 10
	le20(name, value, msgtip, msg) { return this.le(name, value, 20, msgtip, msg); } // required gt0 and le 20
	le25(name, value, msgtip, msg) { return this.le(name, value, 25, msgtip, msg); } // required gt0 and le 25
	le50(name, value, msgtip, msg) { return this.le(name, value, 50, msgtip, msg); } // required gt0 and le 50
	isKey(name, value, msg) { // Required DB-key
		if (!value)
			return this.addRequired(name, msg);
		return (value > 0) ? this : this.addError(name, "notFound", msg);
	}

	// required and length <= max (Default max size == 1000)
	size(name, value, msg, max) { fnSize(this, name, value, max ?? 1000, msg); return this; }
	size20(name, value, msg) { fnSize(this, name, value, 20, msg); return this; }
	size50(name, value, msg) { fnSize(this, name, value, 50, msg); return this; }
	size100(name, value, msg) { fnSize(this, name, value, 100, msg); return this; }
	size200(name, value, msg) { fnSize(this, name, value, 200, msg); return this; }
	size250(name, value, msg) { fnSize(this, name, value, 250, msg); return this; }
	size500(name, value, msg) { fnSize(this, name, value, 500, msg); return this; }

	isEmail(name, value, msg) {
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		const ok = /\w+[^\s@]+@[^\s@]+\.[^\s@]+/.test(value); // RE_MAIL format
		return ok ? this : this.addError(name, "errCorreo", msg);
	}
	isLogin(name, value, msg) { // Loggin / Password / Code
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		if (value.length < 8)
			return this.addError(name, "errMinlength8", msg); // min length
		const ok = /^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{6,}$/.test(value); // RE_LOGIN format
		return ok ? this : this.addFormatError(name, msg);
	}

	word(name, value, msg) {
		if (!fnSize(this, name, value, 50, msg))
			return this; // size message error
		const ok = /\w+/.test(value); // RE_WORD format
		return ok ? this : this.addFormatError(name, msg);
	}
	words(name, value, msg) {
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		const ok = /^\w+(,\w+)*$/.test(value); // RE_WORDS format
		return ok ? this : this.addFormatError(name, msg);
	}
	digits(name, value, msg) {
		if (!fnSize(this, name, value, 20, msg))
			return this; // size message error
		const ok = /^[1-9]\d*$/.test(value); // RE_DIGITS format
		return ok ? this : this.addFormatError(name, msg);
	}
	numbers(name, value, msg) {
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		const ok = /^\d+(,\d+)*$/.test(value); // RE_NUMBERS format
		return ok ? this : this.addFormatError(name, msg);
	}

	// Date validations in string iso format (ej: "2022-05-11T12:05:01")
	isDate(name, value, msg) {
		fnDate(this, name, value, msg);
		return this;
	}
	isTime(name, value, msg) {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d:[0-5]\d[\.\d{1,3}]?$/.test(value); // RE_TIME format
		return ok ? this : this.addDateError(name, msg);
	}
	isDateTime(name, value, msg) {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}Z$/.test(value); // RE_DATE_TIME format
		return ok ? this : this.addDateError(name, msg);
	}
	past(name, value, msg) {
		if (!fnDate(this, name, value, msg))
			return this; // format message error
		if (value.substring(0, 19) > Validators.#sysdate.substring(0, 19)) //yyyy-mm-ddThh:MM:ss
			return this.addError(name, "errDateLt", msg); // not in time
		return this;
	}
	leToday(name, value, msg) {
		if (!fnDate(this, name, value, msg))
			return this; // format message error
		if (value.substring(0, 10) > Validators.#sysdate.substring(0, 10))
			return this.addError(name, "errDateLe", msg); // not in time
		return this;
	}
	geToday(name, value, msg) {
		if (!fnDate(this, name, value, msg))
			return this; // format message error
		if (value.substring(0, 10) < Validators.#sysdate.substring(0, 10))
			return this.addError(name, "errDateGe", msg); // not in time
		return this;
	}

	// Bancks entities and credit cards
	isIban(name, iban, msg) {
		let code = iban && iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
		if (!code || (iban.length !== IbanCodeLengths[code[1]]))
			return this.addRequired(name, msg);

		let digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, letter => (letter.charCodeAt(0) - 55));
		let digital = digits.toString();
		let checksum = digital.slice(0, 2);
		for (let offset = 2; offset < digital.length; offset += 7) {
			let fragment = checksum + digital.substring(offset, offset + 7);
			checksum = parseInt(fragment, 10) % 97;
		}
		return (checksum === 1) ? this : this.addError(name, "errFormat", msg);
	}
	isSwift(name, value, msg) {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$/.test(value); // RE_SWIFT / RE_BIC format
		return ok ? this : this.addFormatError(name, msg);
	}

	getEntidades() { return BankNames; }
	getIban1(iban) { return iban && iban.substring(0, 4); }
	getIban2(iban) { return iban && iban.substring(4, 8); }
	getEntidad(iban) { return BankNames[this.getIban2(iban)]; }
	getIban3(iban) { return iban && iban.substring(8, 12); }
	getOficina(iban) { return iban && iban.substring(8, 12); }
	getDC(iban) { return iban && iban.substring(12, 14); }

	isCreditCardNumber(name, cardNo, msg) { //Luhn check algorithm
		if (!cardNo || (cardNo.length != 16))
			return this.addRequired(name, msg);

		let s = 0;
		let doubleDigit = false;
		for (let i = 15; i >= 0; i--) {
			let digit = +cardNo[i];
			if (doubleDigit) {
				digit *= 2;
				digit -= (digit > 9) ? 9 : 0;
			}
			s += digit;
			doubleDigit = !doubleDigit;
		}
		return ((s % 10) == 0) ? this : this.addError(name, "errFormat", msg);
	}

	generatePassword(size, charSet) {
		charSet = charSet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$";
		return Array.apply(null, Array(size || 10)).map(() => charSet.charAt(Math.random() * charSet.length)).join(""); 
	}
	testPassword(pass) {
		let strength = 0;
		//Check each group independently
		strength += /[A-Z]+/.test(pass) ? 1 : 0;
		strength += /[a-z]+/.test(pass) ? 1 : 0;
		strength += /[0-9]+/.test(pass) ? 1 : 0;
		strength += /[\W]+/.test(pass) ? 1 : 0;
		//Validation for length of password
		strength += ((strength > 2) && (pass.length > 8));
		return strength; //0 = bad, 1 = week, 2-3 = good, 4 = strong, 5 = very strong
	}
}
