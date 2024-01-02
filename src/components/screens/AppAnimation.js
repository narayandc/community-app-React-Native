import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const AppAnimation = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // Experiment with the duration
      easing: Easing.ease, // Experiment with the easing function
      delay: 500, // Experiment with the delay
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

export default AppAnimation;
