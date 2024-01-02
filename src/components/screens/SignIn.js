import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../../css/styles';
import Button from '../common/Button';
import Label from '../screens/Label';
import OverLay from './OverLay';
import InputText from '../screens/InputText';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from './AuthContext';

const SignIn = () => {
  const { handleLoginSuccess } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [loginFail, setLoginFail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
  }, []);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateForm = () => {
    const errors = {};

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Please enter your phone number';
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!password.trim()) {
      errors.password = 'Please enter your password';
    }
    setErrorMessages(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const db = getFirestore();
        const registrationsCol = collection(db, 'users');
        const userQUery = query(
          registrationsCol,
          where('phonenumber', '==', phoneNumber),
          where('password', '==', password)
        );

        const snapshot = await getDocs(userQUery);
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          handleLoginSuccess(userData);
          navigation.navigate('Dashboard');
        } else {
          setLoginFail(true)
          setTimeout(() => {
            setLoginFail(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Error: user login', error);
        return false;
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <View style={styles.pageContainer}>
      {loading && (
        <Text style={styles.subHeadline}>Processing your login, please wait...</Text>
      )}
      <Text style={styles.headline}>SIGN IN</Text>

      {loginFail && (
        <Text style={styles.errorMessage}>Invalid phone or password</Text>
      )}

      <Label label='Mobile no.' />
      <InputText
        value={phoneNumber}
        placeholder="Phone number (10 digit)*"
        onChangeText={(value) => setPhoneNumber(value)}
        onFocus={() => handleFocus('phoneNumber')}
        onBlur={handleBlur}
        isFocused={focusedInput === 'phoneNumber'}
        keyboardType="phoneNumber"
        error={errorMessages.phoneNumber}
      />
      <Label label='Password' />
      <InputText
        value={password}
        placeholder="Password*"
        onChangeText={(value) => setPassword(value)}
        onFocus={() => handleFocus('password')}
        onBlur={handleBlur}
        isFocused={focusedInput === 'password'}
        secureTextEntry={!showPassword}
        error={errorMessages.password}
        togglePasswordVisibility={togglePasswordVisibility}
        type='password'
      />


      <Button
        disabled={loading}
        label="LOGIN" onPress={() => handleLogin()}
        style={{ marginTop: 15 }}
      />

      <OverLay
        isVisible={showForgotPasswordModal}
        onClose={closeForgotPasswordModal}
        content='forgot_password'
      />

      <Text style={styles.subHeadline}>
        Forgot your password?
        <Text style={styles.termConditions} onPress={openForgotPasswordModal}>
          {' '}Click here{' '}
        </Text>
        for help
      </Text>
    </View>
  );
};

export default SignIn;