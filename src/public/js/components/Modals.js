
// Classes Configuration
const MODAL_CLASS = "modal";
//const BTN_OPEN = "btn-open-modal";
const BTN_CLOSE = "btn-close-modal";
const ACTIVE_CLASS = "active";

function Modals() {
	const self = this; //self instance
    var modals; // All modals array

    const fnClose = modal => {
        modal.classList.remove(ACTIVE_CLASS);
        return self;
    }

    this.getModals = () => modals;
    this.close = selector => fnClose(modals.findOne(selector)); //find modal by selector
    this.open = selector => { //find modal by selector
        const modal = modals.findOne(selector);
        modal.classList.add(ACTIVE_CLASS);
        return self;
    }

    this.load = el => {
        modals = el.getElementsByClassName(MODAL_CLASS);
        modals.forEach(modal => { // Iterate over all modals
            modal.getElementsByClassName(BTN_CLOSE).setClick(ev => {
                fnClose(modal);
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
    self.load(document);
}

export default new Modals();
