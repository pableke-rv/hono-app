
const EMPTY = [];

export default class TableModel {
    #table; #model; #rows; #index; #tBody; #resume;

    constructor(table, model) {
        this.#table = globalThis.isstr(table) ? document.querySelector(table) : table;
        this.#model = model; // implements Table interface
        this.#rows = EMPTY; // default = empty array
        this.#index = -1; // current item position in data
        this.#tBody = this.#table.tBodies[0]; //body element
        this.#resume = {}; //Resume container
    }

    getData() { return this.#rows; }
    getIndex() { return this.#index; }
    getResume() { return this.#resume; }
    clear() { this.#index = -1; return this; }

    render(data) {
        this.#rows = data || []; // data to render on table
        this.#index = -1; // clear previous selects
        this.#resume.size = this.#rows.length;
        return this;
    }
}
