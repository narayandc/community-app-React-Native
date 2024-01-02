import React from 'react';
import { Image } from 'react-native';

// load an image dynamically
const DynamicImage = ({ source, width, height, style }) => {
    const dynamicStyle = {
        width: width || '100%', 
        height: height || '100%',
      };
  return <Image source={source} style={[dynamicStyle, style]} resizeMode="contain" />;
};

export default DynamicImage;