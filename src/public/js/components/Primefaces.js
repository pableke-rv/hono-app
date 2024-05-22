
import alerts from "./Alerts.js";
import coll from "./CollectionHTML.js";

const PARAMS = []; // params container
function param(name, value) {
    PARAMS.splice(0, PARAMS.length, { name, value }); // reset array
    return PARAMS;
}
function params(data) {
    PARAMS.splice(0, PARAMS.length); // reset array
    for (const name in data) // Object to params
        PARAMS.push({ name, value: data[name] });
    return PARAMS;
}
// p:remoteCommand server call
function send(action, params) {
    alerts.loading(); // Show loading frame
    const fnCall = window[action];
    fnCall(params); // call server
}
function sendId(action, id) { send(action, param("id", id)); }
function sendTerm(action, term) { send(action, param("term", term)); }
function sendIndex(action, index) { send(action, param("i", index)); }
function fetch(action, data) { send(action, params(data)); }

function isLoaded(xhr, status, args) { // Error or parse server messages
    return (xhr && (status == "success")) || !alerts.showError(xhr || "Error 500: Internal server error.").working();
}
function showAlerts(xhr, status, args) {
    if (isLoaded(xhr, status, args)) { // Error or parse server messages
        const msgs = args.msgs && JSON.parse(args.msgs); // Parse server messages
        alerts.showAlerts(msgs); // Always show alerts after change tab
        return !msgs?.msgError; // has error message
    }
    return false; // Server error
}

function datalist(form, select, input, opts) {
    opts = opts || {}; // Init. options
    const fnChange = opts.onChange || globalThis.void; // fired on load event
    const fnReset = opts.onReset || globalThis.void; // fired on reset event

    input = form.getInput(input); // get input element
    opts.onChange = item => { // fired on load event
        input.value = item.value ?? item; // item object or simple string
        fnChange(item);
    }
    opts.onReset = () => { // fired on reset event
        input.value = "";
        fnReset();
    };
    return form.setDatalist(select, opts);
}

function uploads(list) {
	list.setClick(ev => {
		const parent = ev.target.parentNode;
		parent.querySelector("[type='file']").onchange = ev => {
			const el = parent.querySelector(".filename");
            if (el) // Element to show file name
                el.innerHTML = ev.target.files[0]?.name || "";
		}
		parent.querySelector(".ui-fileupload-choose").click();
	});
}

export default {
    param, params, 
    send, sendId, sendTerm, sendIndex, fetch,
    ready: coll.ready, isLoaded, showAlerts, 
    datalist, uploads
}
