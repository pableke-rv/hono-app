
const ab = new ArrayBox(); //array-box
const dt = new DateBox(); //datetime-box
const nb = new NumberBox(); //number box
const sb = new StringBox(); //string box
const valid = new ValidatorBox(); //validators
const i18n = new I18nBox(); //messages
const dom = new DomBox(); //HTML-DOM box

//funciones sinonimas de traduccion de datos y formatos (boolean, date, datepicker, number...)
const npLatin = i18n.toFloat;
const nfLatin = i18n.isoFloat;
const dpLatin = i18n.toDate;
const dfLatin = i18n.isoDate;

//gestion de informes y mensajes
const fnFirmar = () => i18n.confirm("msgFirmar") && loading();
const fnIntegrar = link => i18n.confirm("msgIntegrar") && loading() && link.hide().closest("tr").querySelectorAll(".estado").text("Procesando...");
const fnRemove = () => i18n.confirm("removeSolicitud") && loading();
//const handleMessages = (xhr, status, args) => { working(); dom.showAlerts(ab.parse(args.msgs)); }
//const handleReport = (xhr, status, args) => { working(); dom.showAlerts(ab.parse(args.msgs)).redir(args.url); }
const fnRechazar = () => dom.closeAlerts().required("#rechazo", "Debe indicar un motivo para el rechazo de la solicitud.").isOk() && i18n.confirm("msgRechazar");

//Autocomplete helper
let _search = false; //call source indicator
function handleJson() {} //default handler
function fnFalse() { return false; } //always false
function fnAcSearch() { return _search; } //lunch source
function fnAcChange(ev) { _search = (ev.keyCode == 8) || sb.between(ev.keyCode, 46, 111) || sb.between(ev.keyCode, 160, 223); } //backspace or alfanum
function fnAcFilter(data, columns, term) { return data && data.filter(row => sb.olike(row, columns, term)).slice(0, 8); } //filter max 8 results
function fnAcRender(jqel, fnRender) { jqel.autocomplete("instance")._renderItem = (ul, item) => $("<li></li>").append("<div>" + sb.iwrap(fnRender(item), jqel.val()) + "</div>").appendTo(ul); }
function fnAcLoad(el, id, txt) { return !$(el).val(txt).siblings("[type=hidden]").first().val(id); }
function fnSelectItem(ev, ui) { return fnAcLoad(this, ui.item.value, ui.item.label); } 
function fnAcReset() { this.value || fnAcLoad(this, "", ""); }
function fnSourceItems(req, res) {
	loading();
	window.handleJson = function(xhr, status, args) {
		res(ab.parse(args?.data) || []);
		working();
	}
	fnAcRender(this.element, item => item.label);
	this.element.siblings("[id^='find-']").click(); //ajax call
}
function fnAutocomplete(el, columns, fnResponse, fnRender) {
	loading();
	window.handleJson = function(xhr, status, args) {
		let data = ab.parse(args?.data) || []; // JSON returned by server
		ab.multisort(data, sb.multicmp(columns)); // order by column name
		fnResponse(fnAcFilter(data, columns, el.val()));
		working();
	}
	fnAcRender(el, fnRender);
	el.siblings("[id^='find-']").click(); //ajax call
}

// Show / Hide related info
dom.toggleInfo = el => {
	el.querySelectorAll("a[href='#toggle']").forEach(link => {
		const names = sb.split(link.dataset.toggle, " "); // multi class name
		const fnToggle = child => { names.forEach(name => child.classList.toggle(name)); }
		link.onclick = () => dom.toggleLink(link).eachChild(link, "i", fnToggle);
	});
	return dom;
}

// Common validators for fields
dom.addError = dom.setError = dom.setInputError; // Synonym
dom.required = (el, msg) => dom.setError(el, msg, null, i18n.required);
dom.login = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.login);
dom.email = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.email);
dom.user = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.user);
dom.intval = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.intval);
dom.gt0 = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.gt0);
dom.fk = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.fk);
dom.past = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.past);
dom.leToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.leToday);
dom.geToday = (el, msg, msgtip) => dom.setError(el, msg, msgtip, i18n.geToday);
