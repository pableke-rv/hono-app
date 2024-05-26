
function Modals() {
	const self = this; //self instance
    const modal = document.querySelector(".modal"); // overlay

    const opts = {};  // default options
    opts.closeClass = "modal-close";
    opts.actionClass = "modal-action";
    opts.activeClass = "active";

    const fnClose = window => {
        modal.classList.remove(opts.activeClass);
        window.classList.remove(opts.activeClass);
        return self;
    }

    this.getModal = () => modal;
    this.set = (name, fn) => { opts[name] = fn; return self; } // set options and actions
    this.close = selector => fnClose(modal.children.findOne(selector)); //find modal by selector
    this.open = selector => { //find modal by selector
        const window = modal.children.findOne(selector);
        modal.classList.add(opts.activeClass);
        window.classList.add(opts.activeClass);
        return self;
    }

    this.load = () => {
        modal.children.forEach(window => { // Iterate over all modals
            window.getElementsByClassName(opts.closeClass).setClick(ev => {
                ev.preventDefault(); fnClose(window);
            });
            window.getElementsByClassName(opts.actionClass).setClick((ev, link) => {
                opts[link.getAttribute("href")](link, window);
                ev.preventDefault();
            });
        });
        /*el.getElementsByClassName(BTN_OPEN).setClick((ev, link) => {
            self.open(link.dataset.modal || link.href);
            ev.preventDefault();
        });*/
        return self;
    }

    // Init. modals
    self.load();
}

export default new Modals();
