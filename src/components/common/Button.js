import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from '../../css/styles';

const Button = ({ label, onPress, style, disabled }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} disabled={disabled} style={[styles.buttonContainer, style]} onPress={onPress}>
      <Text style={[styles.buttonText]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;