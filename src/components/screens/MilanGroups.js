import React, { useState, useEffect } from 'react';
import { View, Image, Text, FlatList, RefreshControl, TextInput } from 'react-native';
import InputText from '../screens/InputText';
import { db } from '../../services/db';
import { getFirestore, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { MEMBERS_LIST } from '../../utils/Constant';
import { useAuth } from './AuthContext';
import styles from '../../css/styles';
import { colors } from '../../styles/colors';

const MilanGroups = () => {
  const { loginData } = useAuth();
  const [milanGroups, setMilanGroups] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getMilanGroups();
  }, []);


  const getMilanGroups = async () => {
    try {
      setIsRefreshing(true);
      const db = getFirestore();
      const querySnapshot = await getDocs(query(collection(db, 'users'),
        where('is_approve', '==', 1)));

      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMilanGroups(members);
    } catch (error) {
      console.error('Error: fetching milan groups');
    } finally {
      setIsRefreshing(false);
    }
  };


  const filteredMilanGroups = milanGroups.filter((item) => {
    if (item.fullname) {
      return item.fullname.toLowerCase().includes(searchItem.toLowerCase());
    }
    return false;
  });

  const renderMilanGroups = ({ item }) =>
  (<View style={styles.memberContainer}>
    <Image
      source={item.profileURL ? { uri: item.profileURL } : require('../../assets/images/Profile.png')}
      style={styles.profileIcon}>
    </Image>
    <View style={[styles.contactDetails, { justifyContent: 'flex-start' }]}>
      <View style={{ flexDirection: 'column' }}>
        <Text style={[styles.headline, styles.capitalize]}>{item.fullname}</Text>
        {item.is_committe_member &&
          <Text style={styles.contactItem}>{MEMBERS_LIST.find(list => list.key === item.member_id)?.value || '?'}</Text>
        }
      </View>
      <Text style={styles.contactItem}>Contact:{' '}{item.phonenumber}</Text>
    </View>
  </View>
  )

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

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredMilanGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderMilanGroups}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={getMilanGroups}
          />
        }
      />
    </View>
  );
};


export default MilanGroups;