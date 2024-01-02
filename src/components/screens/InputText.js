import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Animated } from 'react-native';
import styles from '../../css/styles';

const InputText = ({
  value,
  placeholder,
  onChangeText,
  onFocus,
  onBlur,
  isFocused,
  error,
  secureTextEntry,
  editable,
  togglePasswordVisibility,
  type
}) => {
  const errorOpacity = useRef(new Animated.Value(error ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(errorOpacity, {
      toValue: error ? 1 : 0,
      duration: 300, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  }, [error]);

  return (
    <>
      <View
        style={[
          styles.inputContainer,
          (editable === false || editable !== undefined) && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.placeholder,
            isFocused && styles.placeholderFocused,
          ]}
        >
          {placeholder}
        </Text>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
          ]}
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          editable={editable}
        />
        {type === 'password' && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
            <Image
              source={
                secureTextEntry
                  ? require('../../assets/images/eye-off.png')
                  : require('../../assets/images/eye.png')
              }
              style={styles.inputIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      
      {error && (
        <Animated.Text style={[styles.errorText, { opacity: errorOpacity }]}>
        {error}
      </Animated.Text>
      )}
      
    </>
  );
};

export default InputText;
