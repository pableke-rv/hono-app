
import en from "./en.js";
import Validators from "./validators.js";

en.validators = new Validators(en); // constant
en.createValidators = () => new Validators(en); // Create instance

export default en;
