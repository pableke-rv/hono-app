
import i18n from "./main/i18n.js";

// Client language configuration
const initLang = () => i18n.setLang(i18n.getIsoLang());
document.addEventListener("DOMContentLoaded", initLang); // on load view

export default i18n;
