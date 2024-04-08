
import es from "./es.js";
import Validators from "./validators.js";

es.validators = new Validators(es); // constant
es.createValidators = () => new Validators(es); // Create instance

export default es;
