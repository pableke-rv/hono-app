
import alerts from "./Alerts.js";

function Modals() {
	const self = this; //self instance
    const modals = document.querySelectorAll(".modal"); // all overlays
    let current; // current window

    const opts = {};  // default options
    opts.closeClass = "modal-close";
    opts.actionClass = "modal-action";
    opts.activeClass = "active";

    const fnWindow = selector => {
        let window = null;
        for (let i = 0; (i < modals.length) && !window; i++)
            window = modals[i].children.findOne(selector);
        return window;
    }
    const fnClose = window => {
        if (window) { // has modal
            window.parentNode.classList.remove(opts.activeClass);
            window.classList.remove(opts.activeClass);
        }
        alerts.working();
        return self;
    }

    this.get = name => opts[name]; // get data
    this.set = (name, fn) => { opts[name] = fn; return self; } // set options and actions
    this.close = selector => fnClose(selector ? fnWindow(selector) : current); //find modal by selector
    this.open = selector => { //find modal by selector
        const window = fnWindow(selector);
        window.parentNode.classList.add(opts.activeClass);
        window.classList.add(opts.activeClass);
        current = window;
        alerts.working();
        return self;
    }

    this.load = () => {
        modals.forEach(modal => {
            modal.children.forEach(window => { // Iterate over all modals
                window.getElementsByClassName(opts.closeClass).addClick(ev => {
                    ev.preventDefault(); fnClose(window);
                });
                window.getElementsByClassName(opts.actionClass).addClick((ev, link) => {
                    opts[link.getAttribute("href")](link, window);
                    ev.preventDefault();
                });
            });
        });
        return self;
    }

    // Init. modals
    self.load(); // load modals
    window.openModal = (xhr, status, args, selector) => { // PF hack
        window.showAlerts(xhr, status, args) && self.open(selector);
    }
    window.closeModal = (xhr, status, args) => {
        window.showAlerts(xhr, status, args) && self.close();
    }
}

export default new Modals();
