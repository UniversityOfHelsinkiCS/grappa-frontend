import Validator from "validator";
import Schemas from "./validate.schemas";

class ValidateCore {

  setCustomRules(customRules) {
    this.customRules = customRules;
  }

  isNotValid(values, rule, value) {
    // console.log(values, rule, value)
    const type = rule.type;
    if (type === "notEmpty") {
      return Validator.isNull(value);
    } else if (type === "validEmail") {
      return !Validator.isEmail(value);
    } else if (type.substring(0, 3) === "min" || type.substring(0, 3) === "max") {
      const prefix = rule.type.substring(0, 3);
      if (rule.type.substring(3, 8) === "Count") {
        // Amount is between square brackets : minCount[2]
        const amount = parseInt(rule.type.substring(rule.type.indexOf("[") + 1, rule.type.lastIndexOf("]")), 10);
        if ((prefix === "min" && value.length < amount) || (prefix === "max" && value.length > amount)) {
          return true;
        }
      } else if (rule.type.substring(3, 9) === "Length") {
        const amount = parseInt(rule.type.substring(rule.type.indexOf("[") + 1, rule.type.lastIndexOf("]")), 10);
        if ((prefix === "min" && value.length < amount) || (prefix === "max" && value.length > amount)) {
          return true;
        }
      }
    } else if (rule.type.substring(0, 5) === "equal") {
      const field = rule.type.substring(rule.type.indexOf("[") + 1, rule.type.lastIndexOf("]"));
      // console.log(values[field], value)
      // console.log(values[field] !== value)
      return values[field] !== value;
    }
    return false;
  }

  validate(values, rules, value) {
    return rules.reduce((previous, rule) => {
      return this.isNotValid(values, rule, value) ? [...previous, rule.error] : previous;
    }, []);
  }

  /**
   * Validates one of model's fields
   *
   * @param {String} name - Name of the field
   * @param {Any} value - Value of the field
   * @param {String} modelname - Name of the model that can be found in rules-file
   * @return {Array} - Found errors
   */
  validateField(values, model, field, value) {
    // console.log(model, field, value)
    const errors = {};
    errors[`${model}_${field}`] = this.validate(values, Schemas[model][field].rules, value);
    // console.log(errors)
    return errors;
  }

  /**
   * Validates all of models' fields
   */
  validateForm(values, model) {
    // console.log(modelname);
    // console.log(values);
    let errors = {};
    if (values.constructor === Object) {
      for (const key in values) {
        if ({}.hasOwnProperty.call(values, key)) {
          Object.assign(errors, this.validateField(values, model, key, values[key]));
          const validation = Schemas[model][key].rules;
          if (validation !== undefined && validation.model !== undefined) {
            const modelErrors = this.validateForm(values[key], validation.model);
            console.log(modelErrors);
            errors = Object.assign(errors.obj, modelErrors.obj);
          }
        }
      }
    // array of instances of models
    } else if (values.constructor === Array) {

      throw new Error("doesnt work");

      console.log("array of forms????!");
      console.log(values);
      errors = values.reduce((previous, item) => {
        console.log(previous);
        const modelErrors = validateForm(item, modelname);
        console.log(modelErrors);
        const newErrors = {
          list: Object.assign(previous.list, modelErrors.list),
          obj: Object.assign(previous.obj, modelErrors.obj),
        };
        return newErrors;
      }, { list: [], obj: {} });
      console.log(errors);
    }
    // console.log(errors)
    return errors;
  }
}

export default new ValidateCore();
