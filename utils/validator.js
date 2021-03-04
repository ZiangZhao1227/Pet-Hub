// adapted from function validate() in https://medium.com/@pavsidhu/validating-forms-in-react-native-7adc625c49cf
import validate from 'validate.js';

const validator = (field, value, constraints) => {
  let object = {};
  if (typeof value === 'string') {
    object[field] = value;
  } else {
    object = value;
  }

  const constraint = constraints[field];
  const result = validate(object, {[field]: constraint});
  if (result) {
    return result[field][0];
  }
  return null;
};

export {validator};
