// this is not used anymore (for now?)
import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'react-native-elements';

const FormTextInput = ({style, ...otherProps}) => {
  return <Input style={style} {...otherProps} />;
};

FormTextInput.propTypes = {
  style: PropTypes.object,
};

export default FormTextInput;
