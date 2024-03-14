
import sb from "./StringBox.js"
import alerts from "./Alerts.js";

function Api() {
    var headers;

    function setHeaders(opts) {
        opts.headers = opts.headers || {}; // Headers container
        opts.headers["x-requested-with"] = "XMLHttpRequest"; // AJAX
        //opts.headers["user-agent"] = "Component API AJAX"; // user description
        if (opts.token) {
            opts.headers["x-access-token"] = opts.token;
            opts.headers["authorization"] = "Bearer " + opts.token;
        }
        headers = opts.headers;
    }
    function fnError(err) {
        alerts.showError(err);
    }

    this.getHeaders = () => headers;
    this.getHeader = name => headers[name];
    this.getToken = () => headers["x-access-token"] || sb.substring(headers["authorization"], 7);

    this.json = async (url, opts) => {
        opts = opts || {}; // Call options
        setHeaders(opts); // set common headers

        alerts.loading(); // show loading indicator
        const res = await globalThis.fetch(url, opts); // send api call
        const promise = res.ok ? res.json() : Promise.reject(res.statusText);
        // Add default catch and finally functions to promise
        return promise.catch(fnError).finally(alerts.working);
    }
    this.text = async (url, opts) => {
        opts = opts || {}; // Call options
        setHeaders(opts); // set common headers

        alerts.loading(); // show loading indicator
        const res = await globalThis.fetch(url, opts); // send api call
        const promise = res.ok ? res.text() : Promise.reject(res.statusText);
        // Add default catch and finally functions to promise
        return promise.catch(fnError).finally(alerts.working);
    }

    this.send = async (url, opts) => {
        opts = opts || {}; // Call options
        setHeaders(opts); // set common headers

        alerts.loading(); // show loading indicator
        const res = await globalThis.fetch(url, opts); // send api call
        const type = res.headers.get("content-type") || ""; // get response mime type
        const data = await (type.includes("application/json") ? res.json() : res.text());
        const promise = res.ok ? Promise.resolve(data) : Promise.reject(data || res.statusText);
        return promise.finally(alerts.working);
    }
}

export default new Api();
