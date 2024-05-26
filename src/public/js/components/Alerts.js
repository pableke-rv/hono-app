
import coll from "./CollectionHTML.js";

HTMLElement.prototype.eachPrev = function(fn) {
    var el = this.previousElementSibling;
    for (let i = 0; el; el = el.previousElementSibling)
        fn(el, i++);
    return this;
}
HTMLElement.prototype.prev = function(selector) {
    var el = this.previousElementSibling;
    while (el) {
        if (el.matches(selector))
            return el;
        el = el.previousElementSibling;
    }
    return null;
}
HTMLElement.prototype.eachNext = function(fn) {
    var el = this.nextElementSibling;
    for (let i = 0; el; el = el.nextElementSibling)
        fn(el, i++);
    return this;
}
HTMLElement.prototype.next = function(selector) {
    var el = this.nextElementSibling;
    while (el) {
        if (el.matches(selector))
            return el;
        el = el.nextElementSibling;
    }
    return null;
}
HTMLElement.prototype.eachSibling = function(fn) {
    return this.eachPrev(fn).eachNext(fn);
}
HTMLElement.prototype.sibling = function(selector) {
    return this.prev(selector) || this.next(selector);
}

// Classes Configuration
const ALERT_TEXT = "alert-text";
const ALERT_CLOSE = "alert-close";
const ALERT_ACTIVE = "active";

function Alerts() {
	const self = this; //self instance
    const alerts = document.querySelector(".alerts");
    const texts = alerts.getElementsByClassName(ALERT_TEXT);
    const close = alerts.getElementsByClassName(ALERT_CLOSE);

	// Handle loading div
    const _loading = alerts.nextElementSibling; // loading animation = none
	this.loading = () => { _loading.classList.add("fade60"); return self.closeAlerts(); }
	this.working = () => { _loading.fadeOut(); return self; } // working animation = fadeOut

    // Scroll body to top on click and toggle back-to-top arrow
	const _top = _loading.nextElementSibling;
    this.top = () => { document.body.scrollIntoView({ behavior: "smooth" }); return self; }
	this.redir = (url, target) => { url && window.open(url, target || "_blank"); return self; };
	_top.addEventListener("click", ev => { self.top(); ev.preventDefault(); });
	window.onscroll = function() { _top.setVisible(this.scrollY > 80); }

    const fnShow = (el, txt) => {
        el.parentNode.classList.add(ALERT_ACTIVE);
        el.setMsg(txt);
        return self;
    }
    const fnClose = el => el.classList.remove(ALERT_ACTIVE);
    const fnCloseParent = el => fnClose(el.parentNode);
    const setAlert = (el, txt) => {
        if (txt) { // Message exists
            el.parentNode.eachSibling(fnClose); // close previous alerts
            return fnShow(el, txt); // show specific alert typw
        }
        return self;
    }

    this.showOk = msg => setAlert(alerts[0], msg); //green
    this.showInfo = msg => setAlert(alerts[1], msg); //blue
    this.showWarn = msg => setAlert(alerts[2], msg); //yellow
    this.showError = msg => setAlert(alerts[3], msg); //red
    this.showAlerts = function(msgs) { //show posible multiple messages types
        if (msgs) {
            msgs.msgOk && fnShow(alerts[0], msgs.msgOk);
            msgs.msgInfo && fnShow(alerts[1], msgs.msgInfo);
            msgs.msgWarn && fnShow(alerts[2], msgs.msgWarn);
            msgs.msgError && fnShow(alerts[3], msgs.msgError);
        }
        return self.working();
    }

    this.closeAlerts = function() {
        texts.forEach(fnCloseParent); // fadeOut all alerts
        return self;
    }

    close.forEach(el => el.addEventListener("click", ev => fnCloseParent(el))); // Add close click event
    const fnAlerts = () => texts.forEach(el => { el.innerHTML && fnShow(el, el.innerHTML); }); // Alerts with contents
    coll.ready(() => setTimeout(fnAlerts, 1)); // Show posible server messages after DOMContentLoaded event

    // Global singleton instance
    window.loading = self.loading;
    window.working = self.working;
    window.showAlerts = (xhr, status, args) => self.showAlerts(coll.parse(args?.msgs)); // Hack PF (only for CV-UAE)
}

export default new Alerts();
