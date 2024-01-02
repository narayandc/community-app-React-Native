import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Button from '../common/Button';
import { db } from '../../services/db';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import InputText from '../screens/InputText';
import Label from '../screens/Label';
import styles from '../../css/styles';
import { colors } from '../../styles/colors';
import 'react-native-get-random-values';
import Checkbox from 'expo-checkbox';
import OverLay from './OverLay';
import { v4 as uuidv4 } from 'uuid';


const SignUp = ({ reload }) => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [isChecked, setChecked] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (reload) {
      setFullName('');
      setCity('');
      setPhoneNumber('');
      // setEmail('');
      setPassword('');
      setChecked(false)
      setRegistrationSuccess(false);
      setErrorMessages({})
    }
  }, [reload]);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const checkPhoneExists = async (phonenumber) => {
    try {
      const db = getFirestore();
      const collectionQuery = collection(db, 'users');
      const userQuery = query(
        collectionQuery,
        where('phonenumber', '==', phoneNumber)
      );
      const snapshot = await getDocs(userQuery);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error: checking phone number existence:');
      return false;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateForm = () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }

    if (!city.trim()) {
      errors.city = 'Please enter your city';
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Please enter your phone number';
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // if (!email.trim()) {
    //   errors.email = 'Please enter your email';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    //   errors.email = 'Please enter a valid email address';
    // }

    if (!password.trim()) {
      errors.password = 'Please enter your password';
    }
    if (!isChecked) {
      errors.terms_and_conditions = 'Please accept terms and conditions';
    }


    setErrorMessages(errors);

    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const handleSubmit = async () => {

    if (validateForm()) {
      const phoneExists = await checkPhoneExists(phoneNumber);
      if (phoneExists) {
        setErrorMessages({ phoneNumber: 'Phone number already used' });
        return;
      }

      try {
        const data = {
          id: uuidv4(),
          admin: 0,
          fullname: fullName,
          city,
          phonenumber: phoneNumber,
          //email: email.toLowerCase(),
          password,
          is_approve: 0,
          is_committe_member: false,
          member_id: 0,
          profileURL: '',
          terms_and_conditions: true
        };
        await addDoc(collection(db, 'users'), data);
        //Reset form on success screen
        setFullName('');
        setCity('');
        setPhoneNumber('');
        // setEmail('');
        setPassword('');
        setChecked(false)
        setRegistrationSuccess(true);
        //navigation.navigate('SignIn');
      } catch (error) {
        console.log('Error: submitting data');
      } finally {
        // setRegistrationSuccess(false);
      }
    }
  };
  return (

    <View style={styles.pageContainer}>
      <Text style={styles.headline}>JOIN US!</Text>
      <Text style={styles.subHeadline}>NEPAL METERI MUNCH MILANO</Text>
      {registrationSuccess && (
        <View style={styles.success}>
          <Text style={{ ...styles.processingText, textTransform: 'none' }}>Registration successful! Your request is awaiting approval, and you'll be added to Milan groups once approved</Text>
        </View>
      )}
      <OverLay
        isVisible={showForgotPasswordModal}
        onClose={closeForgotPasswordModal}
        content='term_and_content'
      />
      <Label label='Name' />
      <InputText
        value={fullName}
        placeholder="Full Name*"
        onChangeText={(value) => setFullName(value)}
        onFocus={() => handleFocus('fullName')}
        onBlur={handleBlur}
        isFocused={focusedInput === 'fullName'}
        error={errorMessages.fullName}
      />
      <Label label='City' />
      <InputText
        value={city}
        placeholder="City*"
        onChangeText={(value) => setCity(value)}
        onFocus={() => handleFocus('city')}
        onBlur={handleBlur}
        isFocused={focusedInput === 'city'}
        error={errorMessages.city}
      />
      <Label label='Mobile no.' />
      <InputText
        value={phoneNumber}
        placeholder="Phone Number (10 digit)*"
        onChangeText={(value) => setPhoneNumber(value)}
        onFocus={() => handleFocus('phoneNumber')}
        onBlur={handleBlur}
        isFocused={focusedInput === 'phoneNumber'}
        keyboardType="numeric"
        error={errorMessages.phoneNumber}
      />

      {/* <InputText
        value={email}
        placeholder="Email*"
        onChangeText={(value) => setEmail(value)}
        onFocus={() => handleFocus('email')}
        onBlur={handleBlur}
        isFocused={focusedInput === 'email'}
        keyboardType="email-address"
        error={errorMessages.email}
      /> */}
      <Label label='Password' />
      <InputText
        value={password}
        placeholder="Password*"
        onChangeText={(value) => setPassword(value)}
        onFocus={() => handleFocus('password')}
        onBlur={handleBlur}
        isFocused={focusedInput === 'password'}
        error={errorMessages.password}
        secureTextEntry={!showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        type='password'
      />


      <View style={styles.privacyPolicy}>
        <Checkbox
          style={[
            styles.checkboxBorder,
            { borderColor: !errorMessages?.terms_and_conditions ? colors.primaryBackground : colors.errorColor }
          ]}
          value={isChecked || false}
          onValueChange={() => setChecked(!isChecked)}
          color={isChecked ? colors.primaryBackground : undefined}
        />

        <Text style={styles.privacyPolicyText}>
          {' '}*Accept the{' '}
          <Text style={styles.termConditions} onPress={openForgotPasswordModal}>
            Terms and Conditions
          </Text>{' '}
          and acknowledge our{' '}
          <Text style={styles.privacyPolicyText}>
            Privacy Policy
          </Text>

        </Text>

      </View>

      <Button
        label="REGISTER"
        onPress={() => handleSubmit()}
      />
    </View>

  );
};

export default SignUp;