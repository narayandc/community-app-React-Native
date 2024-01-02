import React, { useState, useEffect } from 'react';
import { View, Image, Text, FlatList, TextInput } from 'react-native';
import InputText from '../screens/InputText';
import { getFirestore, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Checkbox from 'expo-checkbox';
import { useAuth } from './AuthContext';
import AnimatedBanner from './AnimatedBanner';
import OverLay from './OverLay';
import styles from '../../css/styles';
import { colors } from '../../styles/colors';

const Settings = () => {
  const { loginData, setLoginData } = useAuth();
  const [milanGroups, setMilanGroups] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  useEffect(() => {
    getMilanGroups();
  }, [loading]);

  const getMilanGroups = async () => {
    try {
      setIsRefreshing(true);
      const db = getFirestore();
      const committeeCollection = collection(db, 'users');
      const querySnapshot = await getDocs(query(committeeCollection, orderBy('is_approve')));

      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMilanGroups(members);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const generateRandomPassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handlePasswordReset = async (phonenumber) => {
    try {
      const db = getFirestore();
      const userQuery = query(collection(db, 'users'), where('phonenumber', '==', phonenumber));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.size === 1) {
        const userDoc = querySnapshot.docs[0].ref;
        const newPassword = generateRandomPassword();

        await updateDoc(userDoc, { password: newPassword });
        setGeneratedPassword(newPassword);
        setShowForgotPasswordModal(true);
        console.log('New Password:', newPassword);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleUpdate = async (phonenumber, field, value) => {
    setLoading(true);
    try {
      const db = getFirestore();
      const userQuery = query(collection(db, 'users'), where('phonenumber', '==', phonenumber));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.size === 1) {
        const userDoc = querySnapshot.docs[0].ref;
        const updateField = { [field]: value };

        if (field === 'is_committe_member' && value === false) {
          updateField['member_id'] = 0;
        }
        if (field !== 'is_approve') {
          setChecked(!isChecked);
        }

        await updateDoc(userDoc, updateField);
        setTimeout(() => {
          getMilanGroups(); // Refresh data
          setLoading(false);
          setLoginData({
            ...loginData,
            [field]: value,
            member_id: field === 'is_committe_member' ? 0: loginData.member_id
          });
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error updating user status:', error);
    }
  };

  const getStatus = (item) => {
    return item.is_approve ? 'Accepted' : 'Confirm request';
  };

  const filteredMilanGroups = milanGroups.filter((item) =>
    item.fullname.toLowerCase().includes(searchItem.toLowerCase())
  );

  const renderMilanGroups = ({ item }) => (
    <View style={[styles.memberContainer, { justifyContent: 'space-between' }]}>
      {item.is_approve === 0 && (
        <View style={styles.pending}>
          <Text style={styles.upcomingEventText}>pending</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row' }}>
      <Image
        source={item.profileURL ? { uri: item.profileURL } : require('../../assets/images/Profile.png')}
        style={styles.profileIcon}
      />

      <View style={{ flexDirection: 'column'}}>
        <View style={[styles.contactDetails, { justifyContent: 'center' }]}>
          <Text style={[styles.headline, styles.capitalize]}>{item.fullname}</Text>
          <Text style={styles.contactItem}>{item.phonenumber}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text
            style={styles.contactItem}
            onPress={() => handleUpdate(item.phonenumber, 'is_approve', item.is_approve === 1 ? 0 : 1)}
          >
            {getStatus(item)}
          </Text>
          {item.is_approve === 1 && (
            <Text style={styles.contactItem} onPress={() => handlePasswordReset(item.phonenumber)}>
              {' | '}Reset Password
            </Text>
          )}
        </View>
      </View>
      </View>
      <View>
        <View style={[styles.checkboxContainer, !isChecked && styles.checkboxBorder]}>
          <Checkbox
            style={styles.checkbox}
            value={item.is_committe_member || false}
            onValueChange={() => handleUpdate(item.phonenumber, 'is_committe_member', !item.is_committe_member)}
            color={item.is_committe_member ? colors.primaryBackground : undefined}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="search"
        value={searchItem}
        onChangeText={(text) => setSearchItem(text)}
        style={{
          backgroundColor: '#fff',
          marginBottom: 15,
          height: 50,
          padding: 8,
          borderColor: colors.primaryBackground,
          borderRadius: 20,
          fontSize: 16,
          color: colors.primaryTextColor,
          paddingLeft: 20
        }}
        placeholderTextColor='#999'
      />
      {loading && (
        <AnimatedBanner visible={loading} label="updating..." onAnimationEnd={() => setLoading(false)} />
      )}
      <View style={{ flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
        <Text style={styles.headline}>IMPORTANT: </Text>
        <Text style={styles.subleftHeadline}>Check the box if the user is a committe member</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredMilanGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderMilanGroups}
      />
      <OverLay
        isVisible={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        content={`New Password: ${generatedPassword}`}
      />
    </View>
  );
};

export default Settings;
