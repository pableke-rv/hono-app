
function DomBox() {
	const self = this; //self instance

	this.focus = el => { el && el.focus(); return self; }
	this.getAttr = (el, name) => el && el.getAttribute(name);
	this.setAttr = (el, name, value) => { el && el.setAttribute(name, value); return self; }
	this.delAttr = (el, name) => { el && el.removeAttribute(name); return self; }
    this.render = (el, data, i, size) => { el && el.render(data, i, size); return self; }
	this.empty = el => !el || !el.innerHTML || (el.innerHTML.trim() === "");

	this.setval = (el, value) => { // el must exists
		if ((el.tagName == "SELECT") && !value)
			el.selectedIndex = 0;
		else
			el.value = value || ""; // String
		return self;
	}
    this.setValue = (el, value) => el ? self.setval(el, value) : self;
    this.getValue = el => el?.value;

    this.getText = el => el?.innerText;
    this.text = (el, text) => {
        if (el)
            el.innerText = text;
        return self;
    }

    this.getHtml = el => el?.innerHTML;
    this.html = (el, html) => {
        if (el)
            el.innerHTML = html;
        return self;
    }

	this.getOptionText = select => { // get current option text from select-box
        return select && select.options[select.selectedIndex]?.innerHTML;
	}

	// Events handlers
	const fnEvent = (el, name, fn) => { el.addEventListener(name, fn); return self; }
	const fnChange = (el, fn) => fnEvent(el, "change", fn);

    this.onChange = (el, fn) => el ? fnChange(el, fn) : self;
	this.onChangeFile = (el, fn) => {
        if (!el) // checks if element exists
            return self; // not exists

        let file, index = 0; // file, position;
		const reader = new FileReader();
		const fnLoad = i => {
			file = el.files[i]; // multifile
			file && reader.readAsArrayBuffer(file); //reader.readAsText(file, "UTF-8");
		}
		reader.onload = ev => { // event on load file
			fn(el, file, reader.result, index);
			fnLoad(++index);
		}
		return fnChange(el, () => fnLoad(index));
	}
}

export default new DomBox();
