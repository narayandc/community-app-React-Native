
import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../css/styles';

const InputLabel = ({ label, style }) => (
  <View style={[styles.fieldLabelContainer, style]}>
    <Text style={styles.fieldLabel}>{label}</Text>
  </View>
);

export default InputLabel;
