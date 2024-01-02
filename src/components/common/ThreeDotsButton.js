import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ThreeDotsButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="more-vert" size={30} />
    </TouchableOpacity>
  );
};

export default ThreeDotsButton;