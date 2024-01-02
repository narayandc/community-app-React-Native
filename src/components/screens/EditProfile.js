import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { db } from '../../services/db';
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import InputText from '../screens/InputText';
import Button from '../common/Button';
import { MEMBERS_LIST } from '../../utils/Constant';
import Label from '../screens/Label';
import AnimatedBanner from './AnimatedBanner';
import { SelectList } from 'react-native-dropdown-select-list'
import styles from '../../css/styles';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

const EditProfile = () => {
  const { loginData, setLoginData, isAdmin } = useAuth();
  const navigation = useNavigation();
  const [fullname, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selected, setSelected] = React.useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');


  useEffect(() => {

    if (loginData) {
      setFullName(loginData?.fullname || '');
      setCity(loginData?.city || '');
      setPhoneNumber(loginData?.phonenumber || '');
      setSelected(loginData?.member_id || '');
    }

    let dots = '';
    const intervalId = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      setLoadingDots(dots);
    }, 500);

    return () => clearInterval(intervalId);
  }, [loading, loginData]);

  const validateForm = () => {
    const errors = {};

    if (!fullname.trim()) {
      errors.fullname = 'Please enter your full name';
    }

    if (!city.trim()) {
      errors.city = 'Please enter your city';
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Please enter your phone number';
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrorMessages(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };


  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const phonenumber = loginData.phonenumber;
      const userQuery = query(collection(db, 'users'), where('phonenumber', '==', phonenumber));
      const querySnapshot = await getDocs(userQuery);

      try {
        if (querySnapshot.size === 1) {
          setLoading(true);

          const userDoc = querySnapshot.docs[0].ref;

          const fullNameValue = fullname ? fullname : loginData.fullname;
          const cityValue = city ? city : loginData.city;
          const phoneNumberValue = phoneNumber ? phoneNumber : loginData.phonenumber;

          await updateDoc(userDoc, {
            fullname: fullNameValue,
            city: cityValue,
            phonenumber: phoneNumberValue,
            member_id: selected
          }, { merge: true });

          setLoginData({
            ...loginData,
            fullname: fullNameValue,
            city: cityValue,
            phonenumber: phoneNumberValue,
            member_id: selected
          });

          setTimeout(() => {
            setLoading(false);
            navigation.navigate('Dashboard');
          }, 2000); // Simulate a delay for better user experience
        }
      } catch (error) {
        setLoading(false);
        console.error('Error: updating user profile', error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={styles.container}>
        {loading && (
          <AnimatedBanner visible={loading} label="updating..." onAnimationEnd={() => setLoading(false)} />
        )}

        <Label label='Name' style={{ marginLeft: wp(1), padding: wp(1) }} />
        <InputText
          value={fullname ? fullname : ''}
          placeholder="Full Name*"
          onChangeText={(value) => setFullName(value)}
          onFocus={() => handleFocus('fullName')}
          onBlur={handleBlur}
          isFocused={focusedInput === 'fullName'}
          error={errorMessages.fullname}
        />
        <Label label='City' style={{ marginLeft: wp(1), padding: wp(1) }} />
        <InputText
          value={city ? city : ''}
          placeholder="City*"
          onChangeText={(value) => setCity(value)}
          onFocus={() => handleFocus('city')}
          onBlur={handleBlur}
          isFocused={focusedInput === 'city'}
          error={errorMessages.city}
        />
        <Label label='Mobile no.' style={{ marginLeft: wp(1), padding: wp(1) }} />
        <InputText
          value={phoneNumber ? phoneNumber : ''}
          placeholder="Phone Number*"
          onChangeText={(value) => setPhoneNumber(value)}
          onFocus={() => handleFocus('phoneNumber')}
          onBlur={handleBlur}
          isFocused={focusedInput === 'phoneNumber'}
          keyboardType="numeric"
          error={errorMessages.phoneNumber}
        />
       
        {loginData?.is_committe_member && (
          <>
           <Label label='Position' style={{ marginLeft: wp(1), padding: wp(1) }} />
          <SelectList
            search={false}
            inputStyles={styles.dropdownBoxSelect}
            dropdownStyles={styles.dropdownBoxItemView}
            dropdownItemStyles={styles.dropdownBoxItem}
            boxStyles={styles.dropdownBox}
            setSelected={(val) => setSelected(val)}
            data={MEMBERS_LIST}
            value='key'
            defaultOption={{
              key: selected,
              value: MEMBERS_LIST.find(item => item.key === selected)?.value
            }}
          />
          </>
        )}
        <Button
          label='update'
          onPress={() => handleSubmit()}
          disabled={loading}
          style={{ marginTop: 15 }}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;
